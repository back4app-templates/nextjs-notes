"use server";
// Stack: Next.js 15 server action | File: app/actions.js
import { revalidatePath } from "next/cache";
import { createNote } from "../lib/backend";

export async function addNote(formData) {
  const text = String(formData.get("text") ?? "");
  await createNote(text);        // the backend's beforeSave decides what a valid note is
  revalidatePath("/");
}
