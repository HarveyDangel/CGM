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
- `import type` for DTO classes breaks `ValidationPipe` metatype resolution — `design:paramtypes` emits `[Function]` instead of `[ClassName]`. Always use regular `import` with `// biome-ignore lint/style/useImportType` for DTOs used with `@Body()`.
- `ValidationPipe({ whitelist: true })` without `transform: true` strips all properties when metatype is unknown. Always pair: `{ whitelist: true, transform: true }`.

## Anchored Summary

### Achieved (Session 1 — Auth scaffolding)
- Added `@nestjs/config`, `@nestjs/typeorm`, `@supabase/supabase-js`, `typeorm`, `pg`, `dotenv`, `class-validator`, `class-transformer` to backend
- Created `src/supabase/` module (service, guard, module, index) — anon + admin Supabase clients
- Created `src/auth/` module — `POST /auth/signup`, `POST /auth/signin`, `GET /auth/me`
- Supabase project: `qonrzmrrgnvbaqqplfbl` (South Korea), pooler host `aws-1-ap-northeast-2.pooler.supabase.com`
- Wired `ConfigModule`, `TypeOrmModule.forRootAsync()`, `SupabaseModule`, `AuthModule` in `app.module.ts`
- Added `javascript.parser.unsafeParameterDecoratorsEnabled: true` in `biome.json`
- Build, lint, test all passing; auth endpoints smoke-tested and working
- Auth flow: signup uses `admin.auth.admin.createUser({ email, password, email_confirm: true })` → signin uses `anon.auth.signInWithPassword({ email, password })` → token + user returned

### Key files
- `apps/backend/src/main.ts` — bootstrap with `ValidationPipe({ whitelist: true, transform: true })`
- `apps/backend/src/supabase/supabase.service.ts` — anon + admin clients, signUp/signIn/getUser
- `apps/backend/src/supabase/supabase.guard.ts` — bearer token verification
- `apps/backend/src/auth/auth.controller.ts` — 3 routes
- `apps/backend/src/auth/dto/signup.dto.ts`, `signin.dto.ts` — validated DTOs
- `apps/backend/src/data-source.ts` — TypeORM CLI DataSource (keep in sync with `TypeOrmModule.forRootAsync`)
- `biome.json` — unsafe parameter decorators enabled
