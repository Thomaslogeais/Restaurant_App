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

Run from the **repo root** (not inside `services/backend/`):

```sh
# Generate migration from schema changes
pnpm --filter @restaurant/backend drizzle-kit generate

# Apply migrations
pnpm --filter @restaurant/backend drizzle-kit migrate

# Seed / re-seed the database
pnpm --filter @restaurant/backend db:seed
```

## 🌱 Customising the Seed Data

Reviewers can replace the demo data entirely with their own restaurant, menu, and customers. The seed script is designed to be safely re-run as many times as needed.

### The one file to edit

```
services/backend/src/db/seed.ts
```

Comments marked `// ← CUSTOMISE` pinpoint every section that is safe to change.

### Step-by-step

**Step 1 — Restaurant**

Edit the `name`, `slug`, `address`, and `phone` values in the first `db.insert(restaurants)` block.  
`slug` must be URL-safe (lowercase letters, hyphens only).

**Step 2 — Menu categories**

Each category needs a unique `name` and a `position` (display order).  
You can add or remove categories freely — just keep the destructured variable names aligned with what you use below (e.g. `const [starters, mains, desserts] = …`).

**Step 3 — Menu items**

Each item requires:

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Displayed on the dashboard |
| `price` | `string` | Decimal, e.g. `"12.50"` |
| `categoryId` | `number` | Use `starters.id`, `mains.id`, etc. |
| `available` | `boolean` | `true` / `false` |
| `description` | `string \| null` | Can be `null` |

After inserting, keep the `byName(…)` lookups aligned with any names you've changed — these local variables are used to build order items.

**Step 4 — Customers**

Each customer requires `name` and `email`. `phone` and `loyaltyPoints` are optional.

**Step 5 — Orders**

Each order requires `status` (one of `pending · accepted · preparing · ready · completed · cancelled`) and `totalAmount` (a string, e.g. `"27.50"`).

> ⚠️ `totalAmount` must equal the **sum of the order items** you insert in Step 6. The seed bypasses the API layer, so it is not auto-calculated.

**Step 6 — Order items**

Each order item links an order to a menu item. Required fields:

| Field | Example |
|---|---|
| `orderId` | `insertedOrders[0].id` |
| `menuItemId` | `canard.id` |
| `quantity` | `1` |
| `unitPrice` | `"24.00"` (must match the item's `price`) |
| `subtotal` | `"24.00"` (`unitPrice × quantity`) |

**Step 7 — Run the seed**

```sh
pnpm --filter @restaurant/backend db:seed
```

The script will:
1. `TRUNCATE … RESTART IDENTITY CASCADE` — wipe all tables **and reset auto-increment sequences to 1**
2. Re-insert everything from scratch

### ✅ Nothing else needs to change

`RESTAURANT_ID = 1` in `apps/dashboard/app/constants.ts` is correct after every re-seed because the sequence always restarts from 1. **Do not change that file.**

## Screen Architecture

| Tab | Screen | Hook(s) used |
|---|---|---|
| Home | `app/(tabs)/index.tsx` | `useQuery + customInstance` → `GET /api/stats/:restaurantId` |
| Orders | `app/(tabs)/orders.tsx` | `useListOrders`, `useCreateOrder`, `useApplyOrderAction` |
| Menu | `app/(tabs)/menu.tsx` | `useListMenuItems`, `useListMenuCategories`, `useCreateMenuItem` |
| CRM | `app/(tabs)/crm.tsx` | `useListCustomers`, `useCreateCustomer` |
| Settings | `app/(tabs)/settings.tsx` | `useQuery + customInstance` → `GET/PATCH /api/settings/:restaurantId` |

> **Note — Orval path-param limitation:** Routes `GET /api/stats/:restaurantId` and
> `GET|PATCH /api/settings/:restaurantId` use Hono path params. Orval generated these
> hooks with the literal URL string `/api/stats/:restaurantId` (never substituted), which
> would result in a 404 at runtime. Screens that use those endpoints call `customInstance`
> directly with the interpolated URL via `useQuery`/`useMutation` — the minimum necessary
> exception. All other endpoints use the generated Orval hooks exclusively.

## Important Rules

- ⚠️ **Never hand-edit** `packages/api-client/src/generated/` — always regenerate with `pnpm gen:contract`
- ⚠️ **Never define API DTOs** in `packages/types/` — all API types come from Orval
- ⚠️ **Never commit** `services/backend/.dev.vars` — it contains secrets

## Tests

| Package | File | What is tested |
|---|---|---|
| `@restaurant/backend` | `src/lib/order-state-machine.test.ts` | All valid transitions, all invalid transitions, terminal states |
| `@restaurant/backend` | `src/lib/order-guards.test.ts` | Unavailable item guard, missing item guard, wrong-restaurant guard |
| `@restaurant/shared` | `src/utils/formatters.test.ts` | `formatCurrency`, `formatDate`, `formatTime`, `formatRelativeTime`, `formatOrderStatus`, `truncate` |

Run all tests: `pnpm test`

## Architecture Decisions

### Drizzle as the single source of truth
All data shapes originate in `services/backend/src/db/schema.ts`. Column names, enums, and nullable flags are declared once and flow downstream — never duplicated in separate type files or Zod schemas.

### drizzle-zod for validation
`drizzle-zod` auto-generates Zod insert/select schemas directly from the Drizzle table definitions. This guarantees that API validation is always aligned with the DB schema. If a column changes, the validator changes automatically at next build.

### Hono + @hono/zod-openapi for the contract
Every route declares its request/response schemas in `createRoute()`. Hono merges these into a single `/openapi.json` at runtime. The backend is therefore self-documenting and produces the contract as a by-product of routing — no separate API specification file to maintain.

### Orval for frontend code generation
Orval reads the live `/openapi.json` and emits typed React Query hooks into `packages/api-client/src/generated/`. Frontend developers import hooks like `useListOrders()` and never write a `fetch()` call or a manual DTO. Generated files are treated as read-only artifacts (`pnpm gen:contract` overwrites them entirely).

### Backend state machine for order status
Order status changes are driven by named *actions* (`accept`, `start_preparing`, `mark_ready`, `complete`, `cancel`) rather than a loose `PATCH { status: "..." }`. The state machine (`order-state-machine.ts`) returns a discriminated union `{ ok: true, nextStatus } | { ok: false, error }`, making invalid transitions impossible to apply silently. This enforces real operational semantics.

### Server-side price calculation
`totalAmount` and `subtotal` per line item are computed in the `POST /api/orders` handler using DB-fetched prices. The client sends only `menuItemId` and `quantity`. This prevents price manipulation and keeps billing logic auditable on the backend.

### Single seeded restaurant (`restaurantId = 1`)
The seed bootstraps one restaurant to simplify local review. The schema and all API routes are already `restaurantId`-scoped, so multi-restaurant support requires no structural changes — only authentication and restaurant-resolution middleware.

---

## Tradeoffs / Known Limitations

- **Single-restaurant demo.** The seed creates one restaurant. The schema and routes are already parameterised by `restaurantId`, so adding multi-tenant authentication is an incremental step, not a rewrite.
- **No authentication.** Auth was deliberately excluded given the timebox. In production, a JWT middleware (e.g. Cloudflare Workers + Clerk/Auth.js) would gate all `/api/*` routes and resolve `restaurantId` from the token claims.
- **No payment or customer-facing checkout.** The ordering system models the kitchen-ops side only. A customer-facing checkout flow with Stripe or similar is out of scope.
- **Web dashboard prioritised over native mobile.** The app runs on both targets, but layout, typography, and interaction patterns are optimised for web. Native readiness (safe areas, haptics, native navigation) was not the focus.
- **`DataList` is a list-table, not a full spreadsheet.** The shared `DataList` component covers the dashboard's tabular needs (recent orders, top items). It supports horizontal scroll and ReactNode cells but not column sorting or pagination — both reasonable additions.
- **Tests are targeted, not exhaustive.** Backend tests cover the state machine and all three order-creation guards (unavailable items, missing items, wrong-restaurant items). Formatter tests cover all 6 utility functions. Route-level integration tests (requiring a live DB) are not included.
- **Orval path-param limitation.** Two routes (`GET /api/stats/:restaurantId`, `GET|PATCH /api/settings/:restaurantId`) were generated with literal URLs that Orval never substitutes. Those screens use `useQuery`/`useMutation` + `customInstance` directly. All other screens use generated hooks.

---

## Implementation Status

| Milestone | Status | Notes |
|---|---|---|
| 1. Workspace scaffolding | ✅ Complete | pnpm workspaces + Turborepo |
| 2. Database schema + migrations + seed | ✅ Complete | Drizzle ORM + Neon |
| 3. Backend API routes | ✅ Complete | Hono + @hono/zod-openapi |
| 4. Orval code generation | ✅ Complete | React Query hooks in packages/api-client |
| 5. packages/shared (tokens, components, utils) | ✅ Complete | Design tokens, 10 components, formatters |
| 6. Dashboard: Orders + Menu screens | ✅ Complete | Full CRUD with modals |
| 7. Dashboard: Home, CRM, Settings + UI Kit | ✅ Complete | See limitation note above |
| Tests | ✅ Complete | 30+ tests across backend + shared |
