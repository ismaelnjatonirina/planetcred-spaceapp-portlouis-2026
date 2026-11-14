import {
  hashPassword,
  insertAccount,
  readJSON,
  requestIsSameOrigin,
  sendJSON,
  sessionCookie,
} from "../server/auth.mjs";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJSON(response, 405, { error: "Method not allowed." });
  }
  if (!requestIsSameOrigin(request)) return sendJSON(response, 403, { error: "Invalid request origin." });

  try {
    const body = await readJSON(request);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rootUsername = process.env.PLANETCRED_USERNAME || "";

    if (!/^[A-Za-z0-9._-]{3,32}$/.test(username) || password.length < 12 || password.length > 256) {
      return sendJSON(response, 400, { error: "Invalid username or password format." });
    }
    if (rootUsername && username.toLowerCase() === rootUsername.toLowerCase()) {
      return sendJSON(response, 409, { error: "That username is already registered." });
    }

    const { salt, passwordHash } = await hashPassword(password);
    const account = await insertAccount(username, salt, passwordHash);
    if (!account) return sendJSON(response, 409, { error: "That username is already registered." });
    return sendJSON(response, 201, { authenticated: true }, { "Set-Cookie": sessionCookie(request, username) });
  } catch (error) {
    console.error("Account registration failed:", error.message);
    return sendJSON(response, 503, { error: "Account storage is not configured or is temporarily unavailable." });
  }
}
