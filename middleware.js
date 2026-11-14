import { next } from "@vercel/functions";

const PUBLIC_PAGE = /^\/(?:login\.html|login\.js|auth-guard\.js|page-loader\.js|i18n\.js)$/;
const PUBLIC_FLAG = /^\/assets\/flags\//;
const PUBLIC_AUTH_API = /^\/api\/(?:login|register|session|logout)$/;

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
function encodeBase64Url(value) {
  let binary = "";
  for (const byte of new Uint8Array(value)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function readCookie(request, name) {
  return (request.headers.get("cookie") || "").split(";").map((value) => value.trim())
    .find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

async function validSession(request) {
  const secret = process.env.PLANETCRED_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const token = readCookie(request, "planetcred_session");
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expected = encodeBase64Url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
    if (expected.length !== suppliedSignature.length) return false;
    let difference = 0;
    for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ suppliedSignature.charCodeAt(index);
    if (difference !== 0) return false;

    const session = JSON.parse(new TextDecoder().decode(decodeBase64Url(payload)));
    return typeof session.sub === "string" && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export default async function middleware(request) {
  const url = new URL(request.url);
  if (PUBLIC_PAGE.test(url.pathname) || PUBLIC_FLAG.test(url.pathname) || PUBLIC_AUTH_API.test(url.pathname)) {
    return next();
  }
  if (await validSession(request)) return next();

  const destination = `${url.pathname}${url.search}`;
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL(`/login.html?next=${encodeURIComponent(destination)}`, url.origin).toString(),
      "Cache-Control": "no-store",
    },
  });
}\n