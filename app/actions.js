"use server";
// Stack: Next.js 15 server action | File: app/actions.js
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNote } from "../lib/backend";

export async function addNote(formData) {
  const text = String(formData.get("text") ?? "");
  try {
    await createNote(text);      // the backend's beforeSave decides what a valid note is
  } catch (err) {
    redirect(`/?error=${encodeURIComponent(err.message)}`); // show the backend's reason instead of a 500 page
  }
  revalidatePath("/");
  redirect("/");
}
