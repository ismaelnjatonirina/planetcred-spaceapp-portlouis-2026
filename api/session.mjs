import { readSession, sendJSON } from "./_lib/auth.mjs";

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJSON(response, 405, { error: "Method not allowed." });
  }
  const session = readSession(request);
  return sendJSON(response, 200, { authenticated: Boolean(session), username: session?.sub || null });
}
