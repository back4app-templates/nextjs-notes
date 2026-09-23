# nextjs-notes

[![Deploy on Back4app](https://img.shields.io/badge/Deploy%20on-Back4app-1568B8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3djEwbDEwIDUgMTAtNVY3eiIvPjwvc3ZnPg==)](https://www.back4app.com/signup?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes)

**Deploy a server-rendered Next.js 15 app from GitHub with a backend: SSR on a container, data off it.** A notes app in 94 lines including the Dockerfile: a server component reads from a managed [Back4app](https://www.back4app.com/) backend, a server action writes to it, the page arrives as complete HTML, and the API keys never reach the browser.

Measured on September 15–16, 2026, on Back4app Containers: Deploy click → `DEPLOYMENT READY` in **6 min 4 s** (five of them `next build`), a note added through the form in the database **~300 ms** later, **0** keys in the served HTML. Every number in the article comes from this exact code.

> **Read the article:** [How to Deploy a Next.js SSR App With Docker and a Backend](https://www.back4app.com/blog/deploy-nextjs-app-github-backend?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes)

## What it does

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

## What we measured

| Measurement | Result |
|---|---|
| Deploy click → `DEPLOYMENT READY` (first deploy, free plan) | 6 min 4 s (5 min 19 s of it `npm ci` + `next build`) |
| Image build, same Dockerfile, three runs | 5 min 19 s · 3 min 04 s · 4 min 12 s — budget five minutes |
| Note added through the form → row in the backend | ~300 ms; the `POST` to the server action took 368 ms |
| Keys found in the served HTML | 0 |
| Plan change to Shared ($5/mo) | redeployed on its own, same URL, 3 min 14 s |
| `git push` with Autodeploy on → new version live | 4 min 34 s |
| RAM at idle | 45–47 MB |

Two findings: `next build` with `output: "standalone"` copies your `.env` into `.next/standalone/` (keep `.env` in `.dockerignore`, as this repo does), and a server action that throws shows Next.js's generic *Application error* page. Catch and `redirect()` instead (v1.1.0 here).

## Deploy your own

1. **Create a free account.** Sign up at [https://www.back4app.com/signup?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes](https://www.back4app.com/signup?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes). One account gives you both halves: **Build your Backend** (the Note class and its rule) and **Containers** (where `next start` runs).
2. **Backend:** New App → Build your Backend. On Overview copy the App ID and the REST API key. **Cloud Code → main.js**: paste `cloud/main.js`, Deploy, then edit and deploy again (the first deploy on a fresh backend ships nothing); prove the hook with a request.
3. **Container:** push this repo to GitHub, then **Containers → New App → Deploy from GitHub**. Set `PARSE_APP_ID` and `PARSE_REST_KEY` as environment variables and the health check to `/healthz`. Deploy, and expect the first build to take about five minutes.
4. Verify: `./deploy-check.sh https://<your-app>.b4a.run`, then add a note through the form and watch it appear in Database → Note.

On the free plan the container lives 60 minutes from the *start* of the deploy; a six-minute build leaves 54. For a permanent URL and Autodeploy (Settings → Build & deploy), change the plan; Shared starts at $5/month as of September 2026.

## Run locally

```bash
npm install
cp .env.example .env      # PARSE_APP_ID, PARSE_REST_KEY
node --env-file=.env node_modules/.bin/next dev
```

## What the platform gives you

Containers build the two-stage Dockerfile, run `node server.js` behind HTTPS on a public URL and redeploy on push. The backend is a managed Parse Server with a database, REST and GraphQL APIs, Cloud Code and a dashboard where every Note is a row you can inspect. Documentation: [https://www.back4app.com/docs-containers?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes](https://www.back4app.com/docs-containers?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes) · [https://www.back4app.com/docs?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes](https://www.back4app.com/docs?utm_source=github&utm_medium=repo&utm_campaign=nextjs-notes).

## License

MIT
