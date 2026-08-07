# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

**This repository currently contains only documentation and design mockups — no application code has been written yet.** The `docs/` folder (00 through 17) is the complete specification for RECA App V2 and is the authoritative source for everything about this project: vision, design system, information architecture, application architecture, data architecture, auth/roles/permissions, each business module, mobile experience, search/notifications, migration strategy, development standards, and the roadmap.

Before writing any code, read the relevant numbered doc(s) in `docs/` in full — they are detailed (100–200 sections each) and contain concrete rules, not just prose. Key ones to know:

- `docs/00-Vision.md` — product vision, business chain, non-negotiable principles
- `docs/01-Design-System.md` — visual system shared with RECA Opérateur
- `docs/03-Application-Architecture.md` — layering, module boundaries, tech stack
- `docs/04-Data-Architecture.md` — data model
- `docs/05-Authentication-Roles-Permissions.md` — auth/roles
- `docs/15-Migration-Strategy.md` — migration from the legacy app
- `docs/16-Development-Standards.md` — mandatory coding/testing/PR standards (this is the most operationally important doc for day-to-day work)

Because no `package.json`, source tree, or test suite exists yet, there are no build/lint/test commands to run. Once the repo is bootstrapped, the intended scripts (per `docs/16-Development-Standards.md`) are:

```
pnpm dev              # vite dev server
pnpm build            # tsc -b && vite build
pnpm lint / lint:fix   # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest run
pnpm test:e2e         # playwright test
pnpm check            # lint + typecheck + test + build
```

Use pnpm (not npm/yarn) once the repo is initialized — a single package manager and lockfile is mandated.

## The three RECA repositories

This work spans three separate repos with strict boundaries:

- **`reca-app-v2`** (this repo) — the new application being built. The new source of truth for the frontend.
- **`reca-app`** — the current/legacy production app. A read-only functional reference (business rules, existing schema, migrations). **Never modify it** without an explicit user request.
- **`reca-operateur`** — the field/operator app (GPS, offline mode, mission execution, sync). **Never modify it** without an explicit user request. `reca-app-v2` must never import its code directly — the two apps communicate only through versioned data contracts (types, RPC, events).

`reca-app-v2` must never import runtime code from `reca-app` or `reca-operateur`. When a change touches missions, mission items, statuses, geometry, or sync, inspect `reca-operateur`'s contracts first — don't invent the shape.

## Required memory files

The project mandates four living files at the repo root (per `docs/00-Vision.md` §28.10 and `docs/16-Development-Standards.md` §150–154). Create them if they don't exist and keep them current:

- `tasks.md` — work to do, status, priority, dependencies, acceptance criteria
- `plans.md` — active plans, proposed decisions, sequencing, risks (unconfirmed decisions live here, not in memory.md)
- `file-index.md` — important files, their role, owner, links, status
- `memory.md` — only **confirmed, durable** decisions (package manager version, Supabase env strategy, etc.) — no hypotheses or temporary details

Mandatory workflow before any significant change: read `CLAUDE.md` → read the four memory files → read the relevant docs → inspect the real code (including `reca-app`/`reca-operateur` if relevant) → propose a plan → implement within a limited scope → test → update docs and memory files. Don't declare a task done without this loop.

## Architecture (once code exists)

The mandated direction is **Métier (business) → Cas d'utilisation → Contrats applicatifs → Infrastructure → Interface** — the business domain drives the architecture, not React pages, DB tables, or endpoints.

Layering, strictly enforced, dependencies point one way (`Presentation → Application → Domain`, with `Infrastructure` implementing interfaces the layers above define):

```
Presentation    pages, layouts, components, forms
Application     use cases, commands/queries, orchestration, permissions
Domain          entities, value objects, invariants, pure business functions/calculations
Infrastructure  Supabase, repositories, realtime, storage, geocoding, maps, PDF
```

The Domain layer must never import React, React Router, TanStack Query, Supabase, Mapbox, Tailwind, or anything browser-specific — it must be testable with no browser and no Supabase.

**Feature-first structure**: each business module (`src/features/{dashboard,leads,quotes,clients,contracts,routes,missions,employees,equipments,invoices,payments,search,activity,notifications,settings,auth}`) owns its own `domain/`, `application/`, `infrastructure/`, `components/`, `pages/`, `hooks/`, `schemas/`, `types/`, `tests/` as needed (not all subfolders are required — only create ones that represent a real responsibility). Modules expose a public surface only through `index.ts`; deep imports into another feature's internals (`@/features/contracts/components/internal/...`) are forbidden — use the public export or a shared contract instead.

Module dependency direction follows the business chain: `Leads → Quotes → Clients → Contracts → Routes → Missions`. Downstream modules may reference upstream IDs/public contracts, not upstream internals.

Truly cross-cutting concepts (ids, money, address, geo point, geometry, organization, user, role, pagination, `Result<T,E>`) live in a small `src/domain/` — keep it small; it's not a dumping ground.

### Stack (recommended, to be locked at bootstrap)

React + Vite + TypeScript strict + React Router + TanStack Query + React Hook Form + Zod + Tailwind CSS, backed by Supabase (Postgres, Auth, Storage, Realtime, Edge Functions, PostGIS when needed). Mapping via Mapbox GL JS + Turf.js. Tests via Vitest + Testing Library + Playwright.

### Hard rules (from docs/16-Development-Standards.md — non-negotiable)

- **Never call `supabase.from(...)` directly from a component/page.** All Supabase access goes through repositories in `src/infrastructure/supabase/`, which convert rows → domain models via mappers and validate with Zod at the boundary.
- **`any` is forbidden** without a justified, scoped, documented exception.
- **Money** is stored as integer cents (`MoneyCents`), never floats.
- **Statuses are contracts**, not free strings — defined once (e.g. `MissionStatus`), with label/tone/transitions/permissions documented, never invented ad hoc in a component.
- **Critical multi-step mutations must be transactional** (Postgres RPC / server transaction / Edge Function with DB transaction) — never simulated as a sequence of independent client-side mutations. Examples: `CreateMissionFromRoute`, `RecordPayment`, `ConvertQuoteToClient`, `ReorderRouteItems`, `SaveContractGeometry`, `AssignMissionResources`, `ApplyOperatorSyncBatch`.
- **RLS is mandatory** for sensitive business tables (organization + role + assignment scoped), and permissions must be enforced at four layers: UI, route guard, use case, and RLS — hiding a button is never a security boundary.
- **Soft delete** (`deleted_at`/`archived_at`/`status`) for important business entities, not hard deletes.
- **Migrations are additive** (expand → migrate → switch → contract), never destructive without an explicit recovery strategy.
- **Realtime is an accelerator, never the sole source of truth** — always resolve through: realtime event → identify affected query → invalidate → refetch authoritative state.
- **Optimistic updates are only for simple, reversible actions** — never for payments, geometry changes, mission creation, critical assignment, status transitions, or cancellation.
- Legacy-referencing code (old statuses, old field names from `reca-app`) must go through an explicit anti-corruption mapper (e.g. `LegacyContractMapper`), never leak into the rest of the app.
- Don't invalidate the whole query cache (`invalidateQueries()` with no filter) — invalidate only the affected keys.
- Every Promise must be awaited, returned, handled, or explicitly ignored with a stated reason — no silent empty `catch {}`.

## Design system

RECA App V2 shares brand DNA with RECA Opérateur (RECA red, navy blue navigation surfaces, functional color semantics: red = brand/critical/destructive, green = success/active, blue = info/navigation, amber = attention, gray = secondary/inactive) but is a distinct composition — a data + map command center (multi-mission, desktop/tablet/mobile) vs. the operator app's map-first, single-mission, in-vehicle experience. Don't copy operator screens; share the underlying system instead. See `docs/01-Design-System.md` for full detail.

Core UX principle: every important screen must answer three questions — _What's happening now? What needs my attention? What's the next action?_ Desktop is a dense professional tool, not a stretched mobile view; mobile is purpose-built (bottom sheets, sticky actions, one-handed use), not a stack of desktop cards.

## Business domain model

The canonical chain: `Lead → Quote (Soumission) → Client → Contract → Snow removal zone → Route → Mission → MissionItem → Execution (via RECA Opérateur) → History → Invoicing/stats`.

Key distinctions to preserve:

- A **Contract** is a permanent commercial engagement; it is not a Mission.
- A **Route** is a permanent, reusable ordered template of contracts; it is not a Mission.
- A **Mission** is a real execution for a specific event (storm, de-icing, callback); it owns MissionItems, assignments, progress, problems.
- A **MissionItem** is an operational _snapshot_ of a site for one mission — it must preserve history and must never be silently rewritten by a later contract edit. Historical data (geometry used, assigned operator/equipment, price, clauses at the time) must stay frozen.

RECA App V2 prepares/distributes/supervises data for RECA Opérateur and receives back statuses, timing, problems, notes, and sync state from it — treat "last known data" vs "live data" vs "operator offline" as distinct, explicit UI states; never imply real-time precision when data is stale.

## Source-of-truth hierarchy (for resolving contradictions)

1. Explicit recent decision from the project owner
2. Official RECA App V2 documentation (`docs/`)
3. `memory.md`
4. `plans.md`
5. RECA App V2 code and tests
6. `reca-operateur` documentation
7. Confirmed behavior of the legacy `reca-app`
8. Legacy app memory
9. Old mockups
10. Developer assumption (last resort — should be rare and flagged)

Do not blindly copy the legacy app's visual structure, navigation-by-module, or accumulated technical debt — it's a functional reference, not a template to replicate.
