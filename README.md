# CGM

A monorepo powered by Turborepo, pnpm, and Biome.

## Prerequisites

- **Node.js** ^22
- **pnpm** — install via `npm install -g pnpm` or enable Corepack: `corepack enable`

## Getting Started

```bash
# Install dependencies
pnpm install

# Start both frontend and backend in dev mode
pnpm dev
```

- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:3001

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start frontend + backend in watch mode |
| `pnpm build` | Build both apps for production |
| `pnpm lint` | Check all files with Biome |
| `pnpm format` | Auto-format all files with Biome |
| `pnpm --filter backend test` | Run backend unit tests |

## Project Structure

```
apps/
  frontend/   Next.js 16 + React 19 + Tailwind v4
  backend/    NestJS 11 + Express
```

## Tech Stack

- **Turborepo** — monorepo orchestration
- **Biome** — linting & formatting
- **pnpm** — package management
