# Manga Panel Studio

Manga Panel Studio turns rough ideas and scripts into editable, export-ready manga storyboard sequences.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/manga-panel-studio/src/App.tsx` — the interactive storyboard studio and local generation flow
- `artifacts/manga-panel-studio/src/index.css` — the paper-and-ink visual system, panel art, and responsive layout
- `artifacts/manga-panel-studio/package.json` — web artifact scripts and UI dependencies
- `artifacts/api-server/` — shared API scaffold, currently unused by the local-first studio

## Architecture decisions

- The first build is local-first so the core writing-to-storyboard loop is immediately usable without an account or external AI service.
- Generated panels are CSS-rendered compositions rather than placeholder image URLs, keeping the demo deterministic and fast while making the panel editor functional.
- The app uses a single studio route with responsive layout changes instead of splitting the first-run workflow across multiple pages.

## Product

- Start from an idea or script and edit the source text.
- Choose a visual direction: Ink & Grit, Quiet Wash, Paper Pastel, or Noir Cut.
- Generate a six-beat storyboard with selectable panels, dialogue/caption editing, delete and add-panel actions, zoom controls, and a presentation mode.
- Export the current storyboard as a text file or share it via the native share sheet/clipboard fallback.

## User preferences

No additional preferences recorded.

## Gotchas

- The artifact workflow supplies `PORT` and `BASE_PATH`; use the managed workflow rather than starting Vite directly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
