import { clearSessionCookie, requestIsSameOrigin, sendJSON } from "./_lib/auth.mjs";

export default function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJSON(response, 405, { error: "Method not allowed." });
  }
  if (!requestIsSameOrigin(request)) return sendJSON(response, 403, { error: "Invalid request origin." });
  return sendJSON(response, 200, { ok: true }, { "Set-Cookie": clearSessionCookie(request) });
}
