# file-index.md

Purpose: important files, their role, owner, links, and status (per `docs/16-Development-Standards.md` §153). Update as files are added, moved, or retired.

---

## Root

| File            | Role                                                                                                                                            | Status |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `CLAUDE.md`     | Instructions for Claude Code operating in this repo: project status, repo boundaries, memory workflow, architecture rules, hard non-negotiables | Active |
| `tasks.md`      | Work items, status, priority, dependencies, acceptance criteria                                                                                 | Active |
| `plans.md`      | Active plans and unconfirmed proposed decisions                                                                                                 | Active |
| `memory.md`     | Confirmed, durable project decisions only                                                                                                       | Active |
| `file-index.md` | This file                                                                                                                                       | Active |

## `docs/` — official specification (source of truth)

| File                                             | Role                                                                                                                         | Status   |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| `00-Vision.md`                                   | Official product vision: goals, business chain, three-app relationship, non-negotiable principles, source-of-truth hierarchy | Official |
| `01-Design-System.md`                            | Visual system: tokens, principles, component direction, shared identity with RECA Opérateur                                  | Official |
| `02-Information-Architecture.md`                 | Navigation structure, screen inventory, IA principles                                                                        | Official |
| `03-Application-Architecture.md`                 | Technical architecture: layering, module boundaries, stack, state management, Supabase integration                           | Official |
| `04-Data-Architecture.md`                        | Data model / schema direction                                                                                                | Official |
| `05-Authentication-Roles-Permissions.md`         | Auth, roles, permission model                                                                                                | Official |
| `06-Operations-Center-Dashboard.md`              | Dashboard module spec                                                                                                        | Official |
| `07-Leads-Quotes-Clients.md`                     | Leads/Quotes/Clients module spec                                                                                             | Official |
| `08-Contracts-and-Measurement.md`                | Contracts module and measurement tool spec                                                                                   | Official |
| `09-Routes-Missions-and-Dispatch.md`             | Routes/Missions/Dispatch module spec                                                                                         | Official |
| `10-Employees-and-Equipment.md`                  | Employees/Equipment module spec                                                                                              | Official |
| `11-Finance-and-Payments.md`                     | Invoices/Payments module spec                                                                                                | Official |
| `12-Operator-Integration-and-Synchronization.md` | Integration contract and sync design with RECA Opérateur                                                                     | Official |
| `13-Mobile-and-Responsive-Experience.md`         | Mobile/tablet/responsive experience spec                                                                                     | Official |
| `14-Search-Notifications-and-History.md`         | Global search, notifications, activity/history spec                                                                          | Official |
| `15-Migration-Strategy.md`                       | Migration plan from legacy `reca-app`                                                                                        | Official |
| `16-Development-Standards.md`                    | Mandatory coding, testing, security, review, and workflow standards                                                          | Official |
| `17-Roadmap.md`                                  | Roadmap / sprint sequencing                                                                                                  | Official |

## Visual references (not specifications)

| Path                         | Role                                                      | Status         |
| ---------------------------- | --------------------------------------------------------- | -------------- |
| `claude-code-design-mockup/` | Early desktop/mobile "Centre des opérations" HTML mockups | Reference only |
| `maquettes-visuelles/`       | Visual mockup images                                      | Reference only |

## Tooling / config (root)

| File                                                         | Role                                                                                                                                          | Status |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `package.json`                                               | Scripts (`dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`, `format`, `check`) and dependencies. pnpm-managed.                          | Active |
| `pnpm-lock.yaml`                                             | Locked dependency versions                                                                                                                    | Active |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | TypeScript strict-mode project references; `@/*` → `src/*` alias                                                                              | Active |
| `vite.config.ts`                                             | Vite + React + Tailwind plugin config                                                                                                         | Active |
| `vitest.config.ts`                                           | Unit/component test config (jsdom, coverage, `src/**/*.test.{ts,tsx}` only)                                                                   | Active |
| `playwright.config.ts`                                       | E2E config (`tests/e2e/`, chromium + mobile-safari projects)                                                                                  | Active |
| `eslint.config.js`                                           | Flat ESLint config: typescript-eslint strict+stylistic, react-hooks, jsx-a11y, react-refresh, `no-restricted-imports` guarding `createClient` | Active |
| `.prettierrc.json` / `.prettierignore`                       | Formatting rules (no semicolons, single quotes, Tailwind class sorting)                                                                       | Active |
| `.env.example`                                               | Template for `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (shared Supabase project, see `docs/adr/ADR-002`)                                 | Active |
| `.github/workflows/ci.yml`                                   | GitHub Actions: format/lint/typecheck/test/build on push and PR                                                                               | Active |

## `docs/adr/` — Architecture Decision Records

| File                            | Decision                                                                                            | Status                            |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------- |
| `ADR-001-package-manager.md`    | pnpm                                                                                                | Accepted                          |
| `ADR-002-operator-contracts.md` | Shared Supabase database with `reca-app` is the integration contract, no separate contracts package | Accepted                          |
| `ADR-003-postgis.md`            | PostGIS adoption timing                                                                             | Deferred (explicitly not decided) |

## `src/` — application source

| Path                                                                            | Role                                                                                                                                                           | Status                            |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `src/main.tsx`                                                                  | Entry point, mounts `<App />` into `#root`                                                                                                                     | Active                            |
| `src/app/App.tsx`, `AppProviders.tsx`, `AppErrorBoundary.tsx`, `queryClient.ts` | Root composition: error boundary, TanStack Query provider, router mount. No business rules live here (per `docs/03-Application-Architecture.md` §10).          | Active                            |
| `src/app/useTheme.ts`                                                           | `ThemePreference` (`system`/`dark`/`light`) hook, persisted to `localStorage`, toggles `data-theme` on `<html>` (per `docs/01-Design-System.md` §5.3)          | Active                            |
| `src/config/env.ts`                                                             | Zod-validated environment variables, parsed from `import.meta.env` at startup                                                                                  | Active                            |
| `src/domain/money.ts` (+ `.test.ts`)                                            | Example pure domain module: `MoneyCents` as integer cents, `addMoney`, `formatMoneyCAD` — proves the domain layer is testable without React/Supabase           | Active, minimal (pattern example) |
| `src/domain/missionStatus.ts`                                                   | `MissionStatus` union + `missionStatusMeta` (label/tone) — status-as-contract pattern per `docs/03-Application-Architecture.md` §18                            | Active, pattern example           |
| `src/components/ui/`                                                            | Design-system primitives: `Button`, `StatusBadge`, `Card`/`CardHeader`, `StatTile`, `ProgressBar`, `EmptyState` — implement `docs/01-Design-System.md` tokens  | Active                            |
| `src/layouts/AppShell.tsx`, `navigation.ts`                                     | App shell: desktop sidebar (`navSections`) + topbar + mobile bottom nav (`mobileNavItems`), responsive at the `lg` breakpoint. Used by every route.            | Active                            |
| `src/features/dashboard/pages/DashboardPage.tsx`                                | Master UI 1 — Centre des opérations (`/operations`): status banner, stat tiles, active missions, à traiter, activity, map placeholder                          | Active, mock data                 |
| `src/features/missions/pages/MissionListPage.tsx`                               | Master UI 2 — entity list (`/missions`): search, filter chips, responsive table                                                                                | Active, mock data                 |
| `src/features/missions/pages/MissionDetailPage.tsx`                             | Master UI 4 — operational record (`/missions/:missionId`): status/progress, assignment, item list, problem banner, history                                     | Active, mock data                 |
| `src/features/clients/pages/ClientDetailPage.tsx`                               | Master UI 3 — commercial record (`/clients/:clientId`): header, stat banner, tabs, notes                                                                       | Active, mock data                 |
| `src/features/contracts/pages/ContractWizardPage.tsx`, `schemas.ts`             | Master UI 5 — complex form (`/contracts/new`): 3-step wizard, React Hook Form + Zod per-step validation                                                        | Active, mock submit               |
| `src/features/{missions,clients}/mocks.ts`                                      | Placeholder mock data, explicitly marked not-wired-to-Supabase — see file header comments                                                                      | Placeholder, needs real data      |
| `src/features/misc/pages/NotFoundPage.tsx`                                      | Catch-all 404 route                                                                                                                                            | Active                            |
| `src/infrastructure/supabase/client.ts`                                         | The only file allowed to call `createClient()` (enforced by ESLint)                                                                                            | Active                            |
| `src/infrastructure/supabase/database.types.ts`                                 | **Hand-written placeholder** — must be replaced by `supabase gen types typescript` against the real shared project (see file header comment, `tasks.md` T-001) | Placeholder, needs regeneration   |
| `src/routes/router.tsx`                                                         | `createBrowserRouter`, all routes nested under `AppShell`                                                                                                      | Active                            |
| `src/styles/index.css`                                                          | Design tokens (`@theme`): brand/status colors, typography scale, radius, shadows; `[data-theme]` dark/light variable sets per `docs/01-Design-System.md`       | Active                            |
| `src/test/setup.ts`                                                             | Vitest setup — `@testing-library/jest-dom` matchers                                                                                                            | Active                            |

`src/hooks/`, `src/types/`, and most `src/features/*` beyond `dashboard`/`missions`/`clients`/`contracts` (Leads, Quotes, Routes, Employees, Equipments, Invoices, Payments, Settings, Auth) are **not created yet** — created only when a real responsibility lands there (`tasks.md` T-003), per `docs/03-Application-Architecture.md` §9's own guidance not to pre-scaffold empty folders. No icon system or Mapbox integration yet (see `tasks.md` T-002 open items).

## `supabase/`, `tests/`

| Path                                          | Role                                                                                                                 | Status            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `supabase/{functions,migrations,seed,tests}/` | Scaffolded empty (`.gitkeep`), no migrations written yet — schema is the existing shared `reca-app` Supabase project | Scaffolded, empty |
| `tests/e2e/smoke.spec.ts`                     | Playwright smoke test: dashboard shell renders                                                                       | Active            |
| `tests/{integration,fixtures}/`               | Scaffolded empty (`.gitkeep`)                                                                                        | Scaffolded, empty |
