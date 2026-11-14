import {
  createSession,
  findAccount,
  passwordMatches,
  readJSON,
  requestIsSameOrigin,
  sendJSON,
  sessionCookie,
} from "./_lib/auth.mjs";

const failedAttempts = new Map();

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJSON(response, 405, { error: "Method not allowed." });
  }
  if (!requestIsSameOrigin(request)) return sendJSON(response, 403, { error: "Invalid request origin." });

  const ip = (request.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const attempts = (failedAttempts.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (attempts.length >= 10) return sendJSON(response, 429, { error: "Too many attempts. Please wait and try again." });

  try {
    const body = await readJSON(request);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rootUsername = process.env.PLANETCRED_USERNAME || "";
    const rootPassword = process.env.PLANETCRED_PASSWORD || "";
    let valid = Boolean(rootUsername && rootPassword && username.toLowerCase() === rootUsername.toLowerCase() && password === rootPassword);

    if (!valid && username && password) {
      const account = await findAccount(username);
      valid = Boolean(account && await passwordMatches(password, account.password_salt, account.password_hash));
    }
    if (!valid) {
      attempts.push(now);
      failedAttempts.set(ip, attempts);
      return sendJSON(response, 401, { error: "Invalid username or password." });
    }

    failedAttempts.delete(ip);
    const authenticatedUsername = rootUsername && username.toLowerCase() === rootUsername.toLowerCase()
      ? rootUsername
      : username;
    return sendJSON(response, 200, { authenticated: true }, { "Set-Cookie": sessionCookie(request, authenticatedUsername) });
  } catch (error) {
    console.error("Sign-in failed:", error.message);
    return sendJSON(response, 503, { error: "Authentication service is not configured or is temporarily unavailable." });
  }
}
