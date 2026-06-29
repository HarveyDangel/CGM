# CGM monorepo

## Prerequisites
- Node 22 (see `.nvmrc`)
- pnpm 10.33.4 — `corepack enable` or `npm i -g pnpm`

## Commands
| Command | What it does |
|---|---|
| `pnpm dev` | Start frontend (:3000) + backend (:3001) via turbo |
| `pnpm build` | Turbo build — outputs `.next/` and `dist/` |
| `pnpm lint` | Biome check (single quotes, 2-space indent, lineWidth 80) |
| `pnpm format` | Biome format --write |
| `pnpm --filter backend test` | Jest unit tests (`*.spec.ts`) |
| `pnpm --filter backend test:e2e` | Jest e2e tests (`*.e2e-spec.ts`) |
| `pnpm --filter backend migration:generate -- <name>` | Generate TypeORM migration |
| `pnpm --filter backend migration:run` | Run pending migrations |
| `pnpm --filter backend migration:revert` | Revert last migration |

## Structure
- `apps/frontend/` — Next.js 16 App Router + React 19 + Tailwind v4 (no test runner)
- `apps/backend/` — NestJS 11 + Express + TypeORM + Supabase (Postgres)
  - Entrypoint `src/main.ts` on `PORT ?? 3001`
  - Entities in `src/<module>/entities/` — PascalCase classes, snake_case columns
  - DB config via `TypeOrmModule.forRoot()` reading env vars

## Environment
- `DATABASE_URL` — Supabase Postgres connection string
- `PORT` — backend port (default 3001)
- `.env*` files are gitignored; never commit them

## Gotchas
- No root `test` or `typecheck` — run per-app with `--filter`.
- Tailwind v4 uses `@tailwindcss/postcss` (no `tailwind.config.*`).
- NestJS decorators trigger Biome's `useImportType` lint — suppress with `biome-ignore lint/style/useImportType`.
- Biome VCS integration respects `.gitignore`.
- Next.js 16 has breaking changes — read `node_modules/next/dist/docs/` before writing code (see also `apps/frontend/AGENTS.md`).
- TypeORM CLI needs a `DataSource` export — keep `src/data-source.ts` in sync with the module config.
