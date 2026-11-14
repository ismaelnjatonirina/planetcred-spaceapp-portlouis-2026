import { randomBytes, scrypt as scryptCallback, createHmac, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scrypt = promisify(scryptCallback);
export const SESSION_COOKIE = "planetcred_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;
const MAX_BODY_BYTES = 4096;

let sql;
let accountTableReady;

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  sql ||= neon(process.env.DATABASE_URL);
  return sql;
}

export async function ensureAccountTable() {
  if (!accountTableReady) {
    accountTableReady = database()`
      CREATE TABLE IF NOT EXISTS planetcred_accounts (
        username_key TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    accountTableReady = accountTableReady.catch((error) => {
      accountTableReady = null;
      throw error;
    });
  }
  await accountTableReady;
}

export function sendJSON(response, status, data, headers = {}) {
  response.status(status);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  for (const [name, value] of Object.entries(headers)) response.setHeader(name, value);
  response.json(data);
}

export async function readJSON(request) {
  let body = request.body;
  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error("Request body too large");
    return JSON.parse(body || "{}");
  }
  if (body && typeof body === "object") {
    if (Buffer.byteLength(JSON.stringify(body)) > MAX_BODY_BYTES) throw new Error("Request body too large");
    return body;
  }
  return {};
}

export function requestIsSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.host;
  } catch {
    return false;
  }
}

export function sessionSecret() {
  const secret = process.env.PLANETCRED_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("PLANETCRED_SESSION_SECRET must contain at least 32 characters.");
  return secret;
}

function signature(payload) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createSession(username) {
  const payload = Buffer.from(JSON.stringify({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readSession(request) {
  try {
    const cookieHeader = request.headers.cookie || "";
    const token = cookieHeader.split(";").map((item) => item.trim())
      .find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
    if (!token) return null;
    const [payload, suppliedSignature, extra] = token.split(".");
    if (!payload || !suppliedSignature || extra) return null;
    const expected = signature(payload);
    const expectedBytes = Buffer.from(expected);
    const suppliedBytes = Buffer.from(suppliedSignature);
    if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof session.sub !== "string" || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

function cookieSecure(request) {
  return process.env.VERCEL === "1" || request.socket?.encrypted || request.headers["x-forwarded-proto"] === "https";
}

export function sessionCookie(request, username) {
  const secure = cookieSecure(request) ? "; Secure" : "";
  return `${SESSION_COOKIE}=${createSession(username)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookie(request) {
  const secure = cookieSecure(request) ? "; Secure" : "";
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`;
}

export function passwordMatches(password, salt, expectedHash) {
  return scrypt(password, salt, 64).then((derived) => {
    const expected = Buffer.from(expectedHash, "hex");
    return expected.length === derived.length && timingSafeEqual(expected, derived);
  });
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const passwordHash = (await scrypt(password, salt, 64)).toString("hex");
  return { salt, passwordHash };
}

export async function findAccount(username) {
  await ensureAccountTable();
  const [account] = await database()`
    SELECT username, password_salt, password_hash
    FROM planetcred_accounts
    WHERE username_key = ${username.toLowerCase()}
    LIMIT 1
  `;
  return account || null;
}

export async function insertAccount(username, salt, passwordHash) {
  await ensureAccountTable();
  const [account] = await database()`
    INSERT INTO planetcred_accounts (username_key, username, password_salt, password_hash)
    VALUES (${username.toLowerCase()}, ${username}, ${salt}, ${passwordHash})
    ON CONFLICT (username_key) DO NOTHING
    RETURNING username
  `;
  return account || null;
}
