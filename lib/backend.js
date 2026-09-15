// Stack: Next.js 15 (server only) | File: lib/backend.js
// Runs on the server during SSR and in server actions. The keys never reach the browser.
const BASE = process.env.PARSE_SERVER_URL ?? "https://parseapi.back4app.com";
const headers = () => ({
  "X-Parse-Application-Id": process.env.PARSE_APP_ID,
  "X-Parse-REST-API-Key": process.env.PARSE_REST_KEY,
  "Content-Type": "application/json",
});

export async function listNotes() {
  const r = await fetch(`${BASE}/classes/Note?order=-createdAt&limit=50`, { headers: headers(), cache: "no-store" });
  if (!r.ok) throw new Error(`backend ${r.status}: ${await r.text()}`);
  return (await r.json()).results;
}

export async function createNote(text) {
  const r = await fetch(`${BASE}/classes/Note`, { method: "POST", headers: headers(), body: JSON.stringify({ text }) });
  const body = await r.json();
  if (!r.ok) throw new Error(body.error ?? `backend ${r.status}`);
  return body;
}
