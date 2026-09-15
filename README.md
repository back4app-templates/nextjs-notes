# nextjs-notes

A server-rendered Next.js 15 notes app in a Docker container (standalone output). Notes are stored in a Back4app backend; the container renders HTML per request and never exposes the keys. Companion to the Back4app blog post on deploying a Next.js app from GitHub with a backend.

Run locally: `npm install`, `cp .env.example .env`, `node --env-file=.env node_modules/.bin/next dev`.
