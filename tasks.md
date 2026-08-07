# tasks.md

Purpose: work to be done, status, priority, dependencies, acceptance criteria (per `docs/16-Development-Standards.md` §151). Update status as work progresses; don't let this file go stale.

---

## Open tasks

### T-001 — Technical bootstrap of `reca-app-v2`

- **Status**: In progress — core scaffold done, a few items remain
- **Priority**: High (blocks all feature work)
- **Dependencies**: Vendor/infra items still open in `plans.md` (monitoring, analytics, feature flags, Storybook, deployment platform) don't block the items below, but must be resolved before deploying to a real environment.
- **Acceptance criteria**:
  - [x] All decisions listed in `plans.md` are confirmed and recorded in `memory.md` (and as ADRs where architecturally significant, per `docs/16-Development-Standards.md` §162) — vendor/infra-only ones remain intentionally open, see `plans.md`
  - [x] Repo initialized with the agreed package manager (pnpm) and lockfile committed
  - [x] `package.json` scripts exist for `dev`, `build`, `lint`, `lint:fix`, `typecheck`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `format`, `format:check`, `check` (per `docs/16-Development-Standards.md` §6)
  - [x] Base `src/` structure created per `docs/03-Application-Architecture.md` §9 and `docs/16-Development-Standards.md` §7–8 (`app/`, `config/`, `domain/`, `features/`, `infrastructure/`, `routes/`, `styles/`, `test/` — populated as needed, not all subfolders pre-created)
  - [x] TypeScript strict mode enabled with the flags listed in `docs/16-Development-Standards.md` §15 (`tsconfig.app.json` / `tsconfig.node.json`)
  - [x] Supabase client wired up in `src/infrastructure/supabase/client.ts`; ESLint rule blocks `createClient` imports from anywhere else
  - [x] CI pipeline (`.github/workflows/ci.yml`, GitHub Actions) runs format/lint/typecheck/tests/build on push and PR — provider choice noted in `memory.md`, not left silently assumed
  - [ ] `src/infrastructure/supabase/database.types.ts` is currently a hand-written placeholder — must be replaced by running `supabase gen types typescript` once real project credentials are available (see note in that file)
  - [ ] `.env` populated with real `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` for the shared Supabase project so the app can actually talk to data (currently only `.env.example` exists)
  - [ ] Remaining open vendor/infra decisions in `plans.md` (monitoring, analytics, feature flags, Storybook, deployment platform) resolved

### T-002 — Master UI screens

- **Status**: Done (first pass) — all six patterns exist, verified in-browser (desktop). Mobile viewport not device-confirmed (sandbox couldn't resize the browser window), but the mobile shell uses the same `hidden`/breakpoint mechanism already confirmed working elsewhere (e.g. the missions table's responsive columns).
- **Priority**: High
- **Dependencies**: T-001 core scaffold (done)
- **Acceptance criteria**: the six Master UI models exist and are used as the pattern source for derived modules (`docs/00-Vision.md` §34):
  - [x] Centre des opérations — `src/features/dashboard/pages/DashboardPage.tsx` (`/operations`): status banner, stat tiles, active missions, à traiter panel, recent activity, map placeholder
  - [x] Liste d'entités — `src/features/missions/pages/MissionListPage.tsx` (`/missions`): search, filter chips, responsive table
  - [x] Fiche commerciale — `src/features/clients/pages/ClientDetailPage.tsx` (`/clients/:clientId`): header, stat banner, tabs, notes panel
  - [x] Fiche opérationnelle — `src/features/missions/pages/MissionDetailPage.tsx` (`/missions/:missionId`): status/progress, assignment, item list, problem banner, history
  - [x] Formulaire complexe — `src/features/contracts/pages/ContractWizardPage.tsx` (`/contracts/new`): 3-step wizard, React Hook Form + Zod validation per step, step navigation
  - [x] Expérience mobile — `AppShell` (`src/layouts/AppShell.tsx`) renders a distinct bottom-nav + compact layout below the `lg` breakpoint instead of the desktop sidebar, per `docs/01-Design-System.md` mobile nav spec
  - [x] Design tokens implemented in `src/styles/index.css` per `docs/01-Design-System.md` (colors, typography scale, radius, shadows, dark/light themes with a working toggle)
  - [x] Core UI primitives: `Button`, `StatusBadge`, `Card`/`CardHeader`, `StatTile`, `ProgressBar`, `EmptyState` in `src/components/ui/`
  - [ ] Real icon system — not decided yet, nav/UI currently text-only (no invented icon set)
  - [ ] Real Mapbox integration for the two map placeholders in Dashboard/Mission detail — deferred, needs a Mapbox token decision
  - [ ] All data is mock data (`src/features/*/mocks.ts`) — not wired to the real shared Supabase schema yet (depends on `database.types.ts` being regenerated, see T-001)

### T-003 — Business modules

- **Status**: In progress — Missions module built end-to-end against the real shared Supabase project (verified in-browser: real network calls to `https://ynsuxctqsvusbgcudcno.supabase.co`, 200 responses). Other 9 modules not started.
- **Priority**: Medium
- **Dependencies**: T-002 Master UI patterns (done).
- **Missions — done (first slice)**:
  - [x] Real domain model (`src/features/missions/domain/mission.types.ts`), repository interface + Supabase implementation, mapper with an explicit anti-corruption layer (`mapLegacyMissionStatus`) translating the DB's French `statut` values to the app's `MissionStatus` — see `src/domain/missionStatus.ts`
  - [x] `database.types.ts` now has real types for `missions`, `mission_items`, `mission_events`, `mission_notes`, plus minimal `routes`/`route_contracts`/`employees`/`equipments`/`contracts`/`clients` columns, hand-derived from `reca-app`'s actual migration files (not guessed) — see file header for the full method and its limits
  - [x] `MissionListPage` and `MissionDetailPage` (and Dashboard's "Missions actives" panel) now query real data via `useMissions()`/`useMission()` (TanStack Query) instead of mocks; `mocks.ts` deleted as dead code
  - [x] `.env` populated with the real Supabase project's `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`/`VITE_MAPBOX_TOKEN` (from `.input/.env`, gitignored, never committed)
  - **Known limitation, not a bug**: all Missions RLS policies in `reca-app`'s migrations are `for select to authenticated` only — the anon key can never see rows, by design, until real Supabase Auth sign-in exists. Confirmed via real network requests returning `200` with empty arrays (not errors). The UI's empty states say this explicitly rather than looking broken. **Building a real auth/login flow is the next real blocker for seeing actual data**, not something wrong with the Missions wiring.
  - [ ] `database.types.ts` is still hand-derived, not from a real `supabase gen types typescript` run (this project's anon key can't introspect schema, and no DB connection string/service_role was available) — see `plans.md`
  - [ ] Mission creation/assignment/status-change mutations not built yet — read-only so far
  - [ ] Bundle size warning at build (`654 kB`, `> 500 kB` threshold) — route-level code splitting (`docs/16-Development-Standards.md` §70) not done yet, noted but not blocking
- **Remaining 9 modules**: not yet scoped. Per `docs/00-Vision.md` §33 and §14: Leads, Soumissions, Clients, Contrats, Routes, Employés, Équipements, Factures, Paiements, Paramètres — each derived from the Master UI patterns built in T-002, following the same real-schema cross-check process used for Missions (read `reca-app`'s migrations, don't guess column names).

---

## Notes

No feature-module tasks (Leads, Clients, Contracts, Routes, Missions, etc.) are opened yet — per the mandated method (`docs/00-Vision.md` §33), those only start after bootstrap and Master UI are in place. Add them here as they're scoped.
