# Restaurant Operations Dashboard

A fullstack restaurant operations dashboard built as a technical assignment.

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | Expo SDK 56 + React Native + Web (expo-router) |
| Backend | Hono on Cloudflare Workers |
| Database | PostgreSQL via Neon serverless |
| ORM | Drizzle ORM + drizzle-kit |
| Validation | Zod (generated via drizzle-zod) |
| API Contract | OpenAPI 3.0 (via @hono/zod-openapi) |
| Client generation | Orval → React Query hooks |
| Data fetching | TanStack React Query v5 |

## Architecture Flow

```
Drizzle schema (schema.ts)
       │
       ▼ drizzle-zod
Zod schemas (insert/select)
       │
       ▼ @hono/zod-openapi
Hono routes + /openapi.json
       │
       ▼ pnpm gen:contract (Orval)
packages/api-client/src/generated/   ← READ-ONLY, never hand-edit
       │
       ▼ import in React Native
apps/dashboard  (typed React Query hooks)
```

## Project Structure

```
restaurant-app/
├── apps/
│   └── dashboard/          # Expo SDK 56 + React Native + Web
├── services/
│   └── backend/            # Hono on Cloudflare Workers
└── packages/
    ├── shared/             # Design tokens, UI components, utilities
    ├── types/              # Non-API helper types only (minimal)
    └── api-client/         # Orval-generated React Query hooks (READ-ONLY)
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 8
- A [Neon](https://neon.tech) PostgreSQL database (free tier)

## Local Development Setup

### 1. Clone and install

```sh
git clone <repo-url>
cd restaurant-app
pnpm install
```

### 2. Configure backend secrets

Create `services/backend/.dev.vars` (never commit this file):

```
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/restaurant?sslmode=require
```

### 3. Run the backend

```sh
pnpm dev:backend
# → Hono server at http://localhost:8787
# → OpenAPI spec at http://localhost:8787/openapi.json
# → Swagger UI at http://localhost:8787/docs
```

### 4. Run the dashboard

```sh
pnpm dev:dashboard
# → Expo dev server
# → Web: press W in the terminal
```

### 5. Generate the API client (after backend routes are implemented)

```sh
pnpm gen:contract
# Reads /openapi.json from the running backend
# Writes to packages/api-client/src/generated/ (READ-ONLY)
```

## Root Scripts

| Script | Description |
|---|---|
| `pnpm dev:dashboard` | Start Expo dashboard (mobile + web) |
| `pnpm dev:backend` | Start Hono backend on Cloudflare Workers (wrangler dev) |
| `pnpm gen:contract` | Regenerate API client + React Query hooks via Orval |
| `pnpm typecheck` | TypeScript check across all packages |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run tests across all packages |
| `pnpm build` | Build all packages |

## Database Commands

Run from `services/backend/`:

```sh
# Generate migration from schema changes
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Seed database
tsx src/db/seed.ts
```

## Important Rules

- ⚠️ **Never hand-edit** `packages/api-client/src/generated/` — always regenerate with `pnpm gen:contract`
- ⚠️ **Never define API DTOs** in `packages/types/` — all API types come from Orval
- ⚠️ **Never commit** `services/backend/.dev.vars` — it contains secrets

## Implementation Status

| Milestone | Status |
|---|---|
| 1. Workspace scaffolding | ✅ Complete |
| 2. Database schema + migrations + seed | 🔜 Next |
| 3. Backend API routes | ⏳ Pending |
| 4. Orval code generation | ⏳ Pending |
| 5. packages/shared (tokens, components, utils) | ⏳ Pending |
| 6. Dashboard: Orders + Menu screens | ⏳ Pending |
| 7. Dashboard: Home, CRM, Settings screens | ⏳ Pending |
| 8. UI Kit route + polish + tests | ⏳ Pending |
