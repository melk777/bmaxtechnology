const encoder = new TextEncoder();
const SESSION_MESSAGE = "bmaxbrasil:visitas:v1";

function base64Url(bytes: Uint8Array) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signature(secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(SESSION_MESSAGE));
  return base64Url(new Uint8Array(signed));
}

function equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

export async function validAccessCode(code: string) {
  const configuredCode = process.env.BMAX_VISITS_ACCESS_CODE;
  return Boolean(configuredCode && equal(code, configuredCode));
}

export async function createVisitSessionToken() {
  const secret = process.env.BMAX_VISITS_SESSION_SECRET;
  if (!secret) throw new Error("BMAX_VISITS_SESSION_SECRET is not configured");
  return signature(secret);
}

export async function validVisitSession(token?: string) {
  const secret = process.env.BMAX_VISITS_SESSION_SECRET;
  if (!secret || !token) return false;
  return equal(token, await signature(secret));
}
