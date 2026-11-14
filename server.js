"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const ROOT = __dirname;
const SESSION_COOKIE = "planetcred_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MAX_BODY_BYTES = 4096;
const ACCOUNT_STORE = path.join(ROOT, ".auth", "accounts.json");
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "127.0.0.1";

function loadLocalEnvironment() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith("#") || process.env[match[1]]) continue;
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

loadLocalEnvironment();

const USERNAME = process.env.PLANETCRED_USERNAME || "";
const PASSWORD = process.env.PLANETCRED_PASSWORD || "";
const SESSION_SECRET = process.env.PLANETCRED_SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!USERNAME || !PASSWORD || USERNAME.startsWith("change-this") || PASSWORD.startsWith("replace-with")) {
  console.error("Authentication is not configured. Copy .env.example to .env and set a private username and password.");
  process.exit(1);
}
if (PASSWORD.length < 12) {
  console.error("PLANETCRED_PASSWORD must contain at least 12 characters.");
  process.exit(1);
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".tif": "image/tiff",
  ".tiff": "image/tiff",
  ".ico": "image/x-icon",
};

const failedLogins = new Map();
const digest = (value) => crypto.createHash("sha256").update(String(value)).digest();
function safeEqual(left, right) {
  return crypto.timingSafeEqual(digest(left), digest(right));
}

function loadAccounts() {
  if (!fs.existsSync(ACCOUNT_STORE)) return [];
  const accounts = JSON.parse(fs.readFileSync(ACCOUNT_STORE, "utf8"));
  if (!Array.isArray(accounts)) throw new Error("Account store has an invalid format.");
  return accounts;
}

function saveAccounts(accounts) {
  fs.mkdirSync(path.dirname(ACCOUNT_STORE), { recursive: true });
  const temporaryPath = `${ACCOUNT_STORE}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(accounts, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporaryPath, ACCOUNT_STORE);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  return {
    salt,
    passwordHash: crypto.scryptSync(password, salt, 64).toString("hex"),
  };
}

function accountExists(username, accounts) {
  const normalized = username.toLowerCase();
  return normalized === USERNAME.toLowerCase() || accounts.some(
    (account) => typeof account.username === "string" && account.username.toLowerCase() === normalized,
  );
}

function sign(payload) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

function createSession(username) {
  const payload = Buffer.from(
    JSON.stringify({ sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function getCookie(request, name) {
  const cookieHeader = request.headers.cookie || "";
  for (const item of cookieHeader.split(";")) {
    const [key, ...rest] = item.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

function readSession(request) {
  const token = getCookie(request, SESSION_COOKIE);
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !safeEqual(signature, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!session.sub || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

function sendJSON(response, status, data, extraHeaders = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  });
  response.end(JSON.stringify(data));
}

async function readJSON(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error("Request body too large");
  }
  return JSON.parse(body || "{}");
}

function requestIsSecure(request) {
  return Boolean(request.socket.encrypted);
}

function loginCookie(request, token) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}${requestIsSecure(request) ? "; Secure" : ""}`;
}

function clearLoginCookie(request) {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${requestIsSecure(request) ? "; Secure" : ""}`;
}

function isPublicPath(pathname) {
  return (
    pathname === "/login.html" ||
    pathname === "/login.js" ||
    pathname === "/auth-guard.js" ||
    pathname === "/page-loader.js" ||
    pathname === "/i18n.js" ||
    pathname.startsWith("/assets/flags/")
  );
}

function redirectToLogin(response, pathname, search) {
  const destination = `${pathname}${search}`;
  response.writeHead(302, {
    Location: `/login.html?next=${encodeURIComponent(destination)}`,
    "Cache-Control": "no-store",
  });
  response.end();
}

function safeStaticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes("\\") || decoded.includes("\0")) return null;
  if (decoded.split("/").some((part) => part.startsWith("."))) return null;
  const absolute = path.resolve(ROOT, `.${decoded}`);
  return absolute.startsWith(`${ROOT}${path.sep}`) ? absolute : null;
}

const server = http.createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("X-Frame-Options", "DENY");

  let url;
  try {
    url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;

  if (request.method === "GET" && pathname === "/api/session") {
    const session = readSession(request);
    sendJSON(response, 200, { authenticated: Boolean(session), username: session?.sub || null });
    return;
  }

  if (request.method === "POST" && pathname === "/api/login") {
    const client = request.socket.remoteAddress || "unknown";
    const now = Date.now();
    const attempts = (failedLogins.get(client) || []).filter((time) => now - time < 15 * 60 * 1000);
    if (attempts.length >= 10) {
      sendJSON(response, 429, { error: "Too many attempts. Please wait and try again." });
      return;
    }
    try {
      const body = await readJSON(request);
      const username = typeof body.username === "string" ? body.username : "";
      const password = typeof body.password === "string" ? body.password : "";
      const envAccountMatches = safeEqual(username, USERNAME) && safeEqual(password, PASSWORD);
      const accounts = loadAccounts();
      const storedAccount = accounts.find(
        (account) => typeof account.username === "string" && account.username.toLowerCase() === username.toLowerCase(),
      );
      const storedAccountMatches = storedAccount
        ? safeEqual(hashPassword(password, storedAccount.salt).passwordHash, storedAccount.passwordHash)
        : false;
      if (!envAccountMatches && !storedAccountMatches) {
        attempts.push(now);
        failedLogins.set(client, attempts);
        sendJSON(response, 401, { error: "Invalid username or password." });
        return;
      }
      failedLogins.delete(client);
      const authenticatedUsername = envAccountMatches ? USERNAME : storedAccount.username;
      sendJSON(response, 200, { authenticated: true }, { "Set-Cookie": loginCookie(request, createSession(authenticatedUsername)) });
    } catch {
      sendJSON(response, 400, { error: "Invalid login request." });
    }
    return;
  }

  if (request.method === "POST" && pathname === "/api/register") {
    try {
      const body = await readJSON(request);
      const username = typeof body.username === "string" ? body.username.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      const accounts = loadAccounts();

      if (!/^[A-Za-z0-9._-]{3,32}$/.test(username) || password.length < 12 || password.length > 256) {
        sendJSON(response, 400, { error: "Invalid username or password format." });
        return;
      }
      if (accountExists(username, accounts)) {
        sendJSON(response, 409, { error: "That username is already registered." });
        return;
      }

      accounts.push({ username, ...hashPassword(password), createdAt: new Date().toISOString() });
      saveAccounts(accounts);
      sendJSON(response, 201, { authenticated: true }, { "Set-Cookie": loginCookie(request, createSession(username)) });
    } catch (error) {
      console.error("Account registration failed:", error.message);
      sendJSON(response, 500, { error: "Could not save the account." });
    }
    return;
  }

  if (request.method === "POST" && pathname === "/api/logout") {
    sendJSON(response, 200, { ok: true }, { "Set-Cookie": clearLoginCookie(request) });
    return;
  }

  if (!isPublicPath(pathname) && !readSession(request)) {
    redirectToLogin(response, pathname, url.search);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  const filePath = safeStaticPath(pathname);
  if (!filePath || !MIME_TYPES[path.extname(filePath).toLowerCase()]) {
    response.writeHead(404).end("Not found");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()],
      "Cache-Control": /\.(html|js)$/.test(pathname) ? "no-store" : "public, max-age=300",
      "Content-Length": content.length,
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`PlanetCred authentication server running at http://${HOST}:${PORT}`);
  console.log(`Sign-in account: ${USERNAME}`);
  console.log("Use this server instead of Live Server so protected pages require the session cookie.");
});
