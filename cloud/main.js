// Stack: Node.js 22.x | Parse Server 8.x | File: cloud/main.js
// The rule for a Note lives here, not in the Next.js server action.
Parse.Cloud.beforeSave("Note", (request) => {
  const n = request.object;
  const text = (n.get("text") ?? "").trim();
  if (!text) throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "a note needs some text.");
  if (text.length > 280) throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "keep it under 280 characters.");
  n.set("text", text);
});
