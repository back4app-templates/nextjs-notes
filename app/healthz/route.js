// Stack: Next.js 15 route handler | File: app/healthz/route.js
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json({ ok: true, version: "1.1.0" });
}
