# nextjs-notes

**A server-rendered Next.js 15 app deployed from GitHub into a container, with its data in a managed Back4app backend — the page arrives as complete HTML and the API keys never reach the browser.**

This is the companion repository for the Back4app blog post *How to Deploy a Next.js App From GitHub With a Backend — SSR on a Container, Data Off It*. Everything in the post was measured on this exact code, on September 15–16, 2026.

> Article: link added at publication.

## What it does

A notes page in 94 lines including the Dockerfile:

- `app/page.js` — a **server component**: fetches the notes from the backend on every request (`force-dynamic` + `cache: "no-store"`), renders the list and a form, and stamps the time it rendered.
- `app/actions.js` — a **server action**: the form posts to it, it creates the note through the backend, and redirects back; a rejected note comes back as `/?error=<the backend's message>` instead of a 500 page.
- `lib/backend.js` — the only file that knows `PARSE_APP_ID` and `PARSE_REST_KEY`; it runs on the server only.
- `cloud/main.js` — the backend rule (`beforeSave("Note")`): trims the text, rejects an empty note, caps it at 280 characters.
- `Dockerfile` — two stages: `next build` with `output: "standalone"`, then a runtime image that copies only the standalone output.

```
browser ──GET /──▶ ┌────────────────────────┐        ┌──────────────────────┐
        ◀─HTML───  │ container (node:22)    │ ─REST─▶│ Back4app backend      │
        ──POST───▶ │ server component +     │        │ Note + beforeSave     │
                   │ server action          │        └──────────────────────┘
                   └────────────────────────┘
```

## What we measured (September 2026, Back4app Containers)

| Measurement | Result |
|---|---|
| Deploy click → `DEPLOYMENT READY` (first deploy, free plan) | 6 min 4 s (5 min 19 s of it `npm ci` + `next build`) |
| Image build, same Dockerfile, three runs | 5 min 19 s · 3 min 04 s · 4 min 12 s — budget five minutes |
| Note added through the form → row in the backend | ~300 ms; the `POST` to the server action took 368 ms |
| Keys found in the served HTML | 0 |
| Plan change to Shared ($5/mo) | redeployed on its own, same URL, 3 min 14 s |
| `git push` with Autodeploy on → new version live | 4 min 34 s |
| RAM at idle | 45–47 MB |

Two findings: `next build` with `output: "standalone"` copies your `.env` into `.next/standalone/` (keep `.env` in `.dockerignore`, as this repo does), and a server action that throws shows Next.js's generic *Application error* page — catch and `redirect()` instead (v1.1.0 here).

## Run locally

```bash
npm install
cp .env.example .env      # PARSE_APP_ID, PARSE_REST_KEY
node --env-file=.env node_modules/.bin/next dev
```

## Deploy

1. Create a Back4app backend app; paste `cloud/main.js` into **Cloud Code → main.js** and deploy — twice: the first deploy on a fresh backend ships nothing, so prove the hook with a request.
2. Push this repo to GitHub, then **Back4app Containers → New App → Deploy from GitHub**.
3. Set `PARSE_APP_ID` and `PARSE_REST_KEY`; set the health check to `/healthz`; deploy. Expect the first build to take about five minutes.
4. Verify: `./deploy-check.sh https://<your-app>.b4a.run`, then add a note through the form.

On the free plan the container lives 60 minutes from the *start* of the deploy — a six-minute build leaves 54 minutes. For a permanent URL and Autodeploy (Settings → Build & deploy), change the plan; Shared starts at $5/month as of September 2026.

## License

MIT
