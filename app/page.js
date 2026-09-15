// Stack: Next.js 15 App Router | File: app/page.js
// A server component: this HTML is rendered on the container for every request, with data from the backend.
import { listNotes } from "../lib/backend";
import { addNote } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const notes = await listNotes();
  const renderedAt = new Date().toISOString();
  return (
    <main>
      <h1>Notes</h1>
      <form action={addNote} style={{ display: "flex", gap: 8 }}>
        <input name="text" placeholder="Write a note" required style={{ flex: 1, padding: 10, fontSize: 16 }} />
        <button style={{ padding: "10px 16px", fontSize: 16 }}>Add</button>
      </form>
      <ul>
        {notes.map((n) => (
          <li key={n.objectId}>{n.text} <small style={{ color: "#888" }}>{new Date(n.createdAt).toLocaleString("en-US", { timeZone: "UTC" })} UTC</small></li>
        ))}
      </ul>
      <p style={{ color: "#888", fontSize: 13 }}>{notes.length} notes · rendered on the server at {renderedAt}</p>
    </main>
  );
}
