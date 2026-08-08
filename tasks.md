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
  - [~] `src/infrastructure/supabase/database.types.ts` now has real, migration-derived types for `missions`/`mission_items`/`mission_events`/`mission_notes`/`users` and minimal joined columns (see T-003) — still not from an actual `supabase gen types typescript` run, and most of the schema (leads, quotes, invoices, payments, ...) is still untyped
  - [x] `.env` populated with real `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` / `VITE_MAPBOX_TOKEN` for the shared Supabase project (from `.input/.env`, gitignored)
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
  - [x] Missions and Clients (both list + detail) are now wired to real data (T-003); only `ContractWizardPage`'s submit is still mock (no `contracts` write repository built yet)

### T-003 — Business modules

- **Status**: In progress — Missions and Clients modules built end-to-end against the real shared Supabase project, both **confirmed showing real data** signed in as an actual admin account. Other 8 modules not started.
- **Priority**: Medium
- **Dependencies**: T-002 Master UI patterns (done).
- **Missions — done (first slice)**:
  - [x] Real domain model (`src/features/missions/domain/mission.types.ts`), repository interface + Supabase implementation, mapper with an explicit anti-corruption layer (`mapLegacyMissionStatus`) translating the DB's French `statut` values to the app's `MissionStatus` — see `src/domain/missionStatus.ts`
  - [x] `database.types.ts` now has real types for `missions`, `mission_items`, `mission_events`, `mission_notes`, plus minimal `routes`/`route_contracts`/`employees`/`equipments`/`contracts`/`clients` columns, hand-derived from `reca-app`'s actual migration files (not guessed) — see file header for the full method and its limits
  - [x] `MissionListPage` and `MissionDetailPage` (and Dashboard's "Missions actives" panel) now query real data via `useMissions()`/`useMission()` (TanStack Query) instead of mocks; `mocks.ts` deleted as dead code
  - [x] `.env` populated with the real Supabase project's `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`/`VITE_MAPBOX_TOKEN` (from `.input/.env`, gitignored, never committed)
  - [x] **Confirmed end-to-end with a real account**: signed in as the real `administrateur` account, saw real data throughout — dashboard ("Bonjour", 1 mission en cours, real active-mission card), missions list (8 real missions, correct status badges: EN COURS/TERMINÉE/TERMINÉE AVEC ANOMALIES/ANNULÉE), mission detail (real residences with real contract numbers and client names), logout works. This closes out the "empty due to RLS" limitation noted after T-004 shipped.
  - [ ] `database.types.ts` is still hand-derived, not from a real `supabase gen types typescript` run (this project's anon key can't introspect schema, and no DB connection string/service_role was available) — see `plans.md`
  - [x] **Mission status transitions + résidence status updates — built and verified live against real data**:
    - `MissionRepository.updateStatus()`/`updateItemStatus()` (`src/features/missions/infrastructure/mission.repository.ts`) mirror `reca-app`'s real `missions.service.ts#updateMissionStatus` pattern exactly: patch `statut` (+ `heure_debut` on start, `heure_fin` on completion) then insert a `mission_events` row logging the transition — not reinvented, cross-checked against the reference app's actual service code
    - `MissionDetailPage` shows the right action buttons per status (Démarrer when `PLANNED`, Terminer/Terminer avec anomalies when `IN_PROGRESS`, nothing on terminal states) and an editable status `<select>` per résidence
    - **"Assign operator/equipment" was scoped out, not built**: `reca-app`'s real `missions.service.ts` has no post-creation reassignment function — operator/equipment are only set at mission creation (`createMission`). Building a fake "Assigner" mutation would have been inventing a capability that doesn't exist in the reference system; the placeholder button from T-002 was removed instead of wired to nothing.
    - Verified live signed in as the real `administrateur` account: changed a real résidence's status via the dropdown (À faire → En cours), confirmed the real write + refetch round-tripped correctly (badge updated, no optimistic-UI trick involved), then reverted it back to leave the data as found. Mission-level `Démarrer` wasn't clicked live — no `PLANIFIÉE` mission currently exists in the shared dev data to test it non-destructively — but the conditional button rendering was confirmed correct for the `EN COURS` state, and the code mirrors the read-path pattern already proven working.
  - [ ] Bundle size warning at build (`671 kB`, `> 500 kB` threshold) — route-level code splitting (`docs/16-Development-Standards.md` §70) not done yet, noted but not blocking
- **Clients — done (first slice)**:
  - [x] Real domain model (`src/features/clients/domain/client.types.ts`), repository interface + Supabase implementation, mapper — `clients` table typed with its full real column set (`telephone`, `courriel`, `code_postal`, `notes`, `statut`, `langue`, `created_at`, per `reca-app`'s migrations including the later `20260719000000_clients_statut_langue.sql`), not just the minimal subset used for Mission joins
  - [x] `src/domain/clientStatus.ts` — real `ClientStatus` (`actif`/`inactif`, no anti-corruption mapping needed, the two DB values read fine as-is) and real `ContractStatus` (`actif`/`en_attente`/`expire`/`annule`)
  - [x] New `ClientListPage` (`/clients`) — this route didn't exist before (T-002 only built the detail page); added to match the Missions module's list+detail pattern
  - [x] `ClientDetailPage` rewritten from T-002 mock data to real data: real contracts tab (from the real `contracts` table, not invoices/payments — see below), notes, contact info
  - [x] **Dropped the fictional "Solde" (balance) stat from T-002's mock**: checked `reca-app`'s real `ClientContractsCard`/`ClientInvoicesCard` and confirmed there is no "solde" concept computed anywhere in the reference app either — it shows a contracts total and a separate invoices total, no combined balance. Since the Invoices module isn't built yet, the client detail now shows a real "Valeur des contrats" stat instead of an invented balance figure.
  - [x] `database.types.ts`: expanded `contracts` with `saison`/`date_signature`/`date_debut`/`date_fin` (needed for the contracts list); money values (`contracts.prix`) are stored as decimal dollars in the DB, converted to `MoneyCents` in the mapper to match this app's `docs/16-Development-Standards.md` §25 money convention
  - [x] Verified live signed in as the real `administrateur` account: 30 real clients listed with real names/phones/cities, opened a real client (Claude Lemire) showing a real address, real contract (CTR-000055, 1 000,00 $, ACTIF) — money conversion confirmed correct
- **Remaining 8 modules**: not yet scoped. Per `docs/00-Vision.md` §33 and §14: Leads, Soumissions, Contrats, Routes, Employés, Équipements, Factures, Paiements, Paramètres — each derived from the Master UI patterns built in T-002, following the same real-schema cross-check process used for Missions and Clients (read `reca-app`'s migrations, don't guess column names).

### T-004 — Auth module

- **Status**: Done (first slice) — real login/logout against Supabase Auth, verified end-to-end in-browser (real `POST /auth/v1/token` requests) and with Playwright (`pnpm exec playwright test --project=chromium`, 2/2 passing).
- **Priority**: High (was blocking real data everywhere — see T-003)
- **Dependencies**: none
- **What's built**:
  - [x] `src/domain/session.ts` — `AppSession`/`Role` matching the **real** simplified model in `reca-app`'s DB (`users.role`: `administrateur` | `employe` | `operateur`, per `supabase/migrations/20260709143631_users.sql` + `20260723010000_users_role_operateur.sql`), not the aspirational full permission-matrix model in `docs/05-Authentication-Roles-Permissions.md` §10–21 (that matrix is explicitly marked "à valider avant production" and isn't backed by any real RLS policy yet — see `memory.md`)
  - [x] `src/app/SessionContext.tsx` — `SessionProvider`/`useSession()`, resolves Supabase Auth state + the matching `public.users` row into an `AppSession`
  - [x] `src/features/auth/` — `LoginPage` (email/password, generic error messages per docs §30, "mot de passe oublié" via `resetPasswordForEmail`), `RequireAuth` route guard (loading/unauthenticated/suspended-account states), `useLogin`/`useLogout`
  - [x] Router: `/login` is public; every other route is nested under `RequireAuth` → `AppShell`
  - [x] `AppShell` topbar shows the signed-in user and a working "Déconnexion" button
  - [x] `database.types.ts` has a real `users` table type + the `update_own_theme` RPC signature
  - [x] `tests/e2e/smoke.spec.ts` rewritten to match reality (was stale from T-002 — asserted on a heading that no longer existed and didn't account for the new login redirect); now tests the real redirect-to-login and the real invalid-credentials error path
- **Explicitly not built yet** (documented, not silently skipped):
  - [ ] No self-registration — matches docs §28/§31 (admin-invite-only model), but there's also no admin-side "invite a user" UI yet, so provisioning real accounts currently requires the Supabase dashboard directly
  - [ ] No real permission-key system (`hasPermission()`, `RequirePermission`) — deferred until the docs' full permission matrix is actually validated and backed by real RLS (see `memory.md`); `canWrite()`/`isOperator()` in `session.ts` cover what's real today
  - [ ] MFA, invitations, password-change-while-logged-in, session-revocation admin UI, security-event audit log — all out of scope for this first slice, per docs §149's own "decisions to confirm before final implementation" list
  - [ ] `mobile-safari` (WebKit) Playwright project can't run in this dev sandbox — missing `msvcp140_1.dll`, a Windows system dependency outside repo control; `chromium` project is the one actually verified

---

## Notes

No feature-module tasks (Leads, Clients, Contracts, Routes, Missions, etc.) are opened yet — per the mandated method (`docs/00-Vision.md` §33), those only start after bootstrap and Master UI are in place. Add them here as they're scoped.
