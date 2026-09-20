import type { NextRequest } from "next/server";
export const runtime = "nodejs";
const authRoutes = new Set(["get-session", "sign-up/email", "sign-in/email", "sign-out", "request-password-reset", "reset-password", "send-verification-email", "verify-email"]);
async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join("/");
  const valid = route === "graphql" || route === "account/status" || (route.startsWith("auth/") && authRoutes.has(route.slice(5)));
  if (!valid) return Response.json({ message: "Not found." }, { status: 404 });
  const configured = process.env.GATEWAY_URL;
  const headers = { "Cache-Control": "no-store" };
  if (!configured) return route === "account/status" ? Response.json({ available: false }, { headers }) : Response.json({ message: "Accounts are not connected on this deployment yet. You can continue as a guest." }, { status: 503, headers });
  const publicOrigin = process.env.APP_ORIGIN;
  if (request.method === "POST" && (!publicOrigin || request.headers.get("origin") !== publicOrigin)) return Response.json({ message: "Request origin is not allowed." }, { status: 403, headers });
  try {
    const gateway = new URL(configured);
    if (!["http:", "https:"].includes(gateway.protocol) || gateway.username || gateway.password) throw new Error("Invalid gateway URL");
    const target = new URL(route === "graphql" ? "/graphql" : `/api/${route}`, gateway);
    target.search = request.nextUrl.search;
    const forward = new Headers();
    for (const name of ["cookie", "content-type", "origin", "user-agent", "sec-fetch-site"]) {
      const value = request.headers.get(name); if (value) forward.set(name, value);
    }
    let body: Uint8Array | undefined;
    if (request.method === "POST") {
      const reader = request.body?.getReader();
      const chunks: Uint8Array[] = []; let size = 0;
      if (reader) for (;;) {
        const chunk = await reader.read(); if (chunk.done) break;
        size += chunk.value.length;
        if (size > 65536) { await reader.cancel(); return Response.json({ message: "Request is too large." }, { status: 413, headers }); }
        chunks.push(chunk.value);
      }
      body = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
    }
    const response = await fetch(target, { method: request.method, headers: forward, body: body as BodyInit | undefined, redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(15000) });
    const outgoing = new Headers(headers);
    for (const name of ["content-type", "retry-after", "x-ratelimit-limit", "x-ratelimit-remaining"]) {
      const value = response.headers.get(name); if (value) outgoing.set(name, value);
    }
    for (const cookie of response.headers.getSetCookie()) outgoing.append("set-cookie", cookie);
    const location = response.headers.get("location");
    if (location) {
      const redirect = new URL(location, publicOrigin);
      if (redirect.origin !== publicOrigin) return Response.json({ message: "Invalid account redirect." }, { status: 502, headers });
      outgoing.set("location", redirect.href);
    }
    return new Response(response.body, { status: response.status, headers: outgoing });
  } catch { return Response.json({ message: "Account service is temporarily unavailable. Your browser progress is safe." }, { status: 503, headers: { ...headers, "Retry-After": "10" } }); }
}
export const GET = proxy;
export const POST = proxy;
