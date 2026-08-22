# Friendship Day Experience

A polished, interactive memory-book web experience for celebrating a special friendship.

## Run & Operate

- `pnpm --filter @workspace/friendship-day run dev` — run the frontend locally (the Replit workflow supplies `PORT` and `BASE_PATH`)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080; requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- API env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/friendship-day` — React/Vite Friendship Day experience and static assets
- `artifacts/api-server` — Express API service
- `lib/api-spec` — OpenAPI source of truth and generated client/schema inputs
- `lib/db` — Drizzle/PostgreSQL schema and database client
- `artifacts/friendship-day/src/index.css` — app theme tokens and visual styles

## Architecture decisions

- The Friendship Day experience is currently self-contained in the frontend and does not require the API to render.
- The frontend is served at `/` and the API is routed under `/api`.

## Product

The experience includes a guided welcome, friendship timeline, memory gallery, appreciation cards, an interactive letter, chat memories, a quiz, hidden hearts, a hidden teddy-bear discovery, music controls, and a final surprise.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
