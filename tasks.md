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

- **Status**: In progress — Missions, Clients, Routes, and Contrats modules built end-to-end against the real shared Supabase project, all **confirmed showing real data** signed in as an actual admin account. Other 6 modules not started.
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
  - [x] **Bundle size warning resolved (T-005, below)**
- **Clients — done (first slice)**:
  - [x] Real domain model (`src/features/clients/domain/client.types.ts`), repository interface + Supabase implementation, mapper — `clients` table typed with its full real column set (`telephone`, `courriel`, `code_postal`, `notes`, `statut`, `langue`, `created_at`, per `reca-app`'s migrations including the later `20260719000000_clients_statut_langue.sql`), not just the minimal subset used for Mission joins
  - [x] `src/domain/clientStatus.ts` — real `ClientStatus` (`actif`/`inactif`, no anti-corruption mapping needed, the two DB values read fine as-is) and real `ContractStatus` (`actif`/`en_attente`/`expire`/`annule`)
  - [x] New `ClientListPage` (`/clients`) — this route didn't exist before (T-002 only built the detail page); added to match the Missions module's list+detail pattern
  - [x] `ClientDetailPage` rewritten from T-002 mock data to real data: real contracts tab (from the real `contracts` table, not invoices/payments — see below), notes, contact info
  - [x] **Dropped the fictional "Solde" (balance) stat from T-002's mock**: checked `reca-app`'s real `ClientContractsCard`/`ClientInvoicesCard` and confirmed there is no "solde" concept computed anywhere in the reference app either — it shows a contracts total and a separate invoices total, no combined balance. Since the Invoices module isn't built yet, the client detail now shows a real "Valeur des contrats" stat instead of an invented balance figure.
  - [x] `database.types.ts`: expanded `contracts` with `saison`/`date_signature`/`date_debut`/`date_fin` (needed for the contracts list); money values (`contracts.prix`) are stored as decimal dollars in the DB, converted to `MoneyCents` in the mapper to match this app's `docs/16-Development-Standards.md` §25 money convention
  - [x] Verified live signed in as the real `administrateur` account: 30 real clients listed with real names/phones/cities, opened a real client (Claude Lemire) showing a real address, real contract (CTR-000055, 1 000,00 $, ACTIF) — money conversion confirmed correct
- **Routes — done (first slice, read-only)**:
  - [x] Real domain model (`src/features/routes/domain/route.types.ts`), repository interface + Supabase implementation, mapper — `RouteSummary` (name, colour, operator, equipment, contract count) and `RouteDetail` (ordered `route_contracts` joined to `contracts` for numero/address/status)
  - [x] `database.types.ts`: added `contracts.adresse_geocodee` (needed to show each stop's address in route order) — cross-checked against `reca-app`'s real `routeContracts.service.ts`, which selects exactly that column for the same purpose
  - [x] New `RouteListPage` (`/routes`) and `RouteDetailPage` (`/routes/:routeId`) — neither existed before; `routes` was already a nav link with no page behind it
  - [x] Confirmed RLS matches Missions' non-operator write pattern, not Clients': `routes`/`route_contracts` writes are `administrateur`-only with no operator exception (`reca-app/supabase/migrations/20260722020000_routes_v2.sql`) — relevant for when write mutations are built here later
  - [x] **No write mutations built** (create/reorder/assign/transfer contract) — `reca-app`'s real implementation is meaningfully more complex here: `assignContractToRoute` first soft-removes any existing active `route_contracts` row for that contract (a contract can only be on one route at a time) before inserting, and `reorderRouteContract` calls a dedicated `reorder_route_contract` Postgres RPC rather than a plain `UPDATE`. Scoped out to keep this slice read-only and correct rather than rushing a shallower, buggier version of real multi-step logic; a real next step, not a gap papered over.
  - [x] Verified live signed in as the real `administrateur` account: 3 real routes (LaSalle, LaSalle 2, St-Jérôme) with real operator/equipment/contract-count, opened LaSalle showing its 3 real contracts in real visit order with real geocoded addresses (including CTR-000055, the same contract seen on the Clients module test — cross-module consistency confirmed)
- **Contrats — done (first slice, read-only)**:
  - [x] Real domain model (`src/features/contracts/domain/contract.types.ts`), repository interface + Supabase implementation, mapper — `ContractSummary`/`ContractDetail` joined to `clients` for the client's display name, same dollars→cents money conversion pattern as the Clients module
  - [x] `database.types.ts`: added `contracts.notes`/`created_at` (needed for the detail page)
  - [x] New `ContractListPage` (`/contracts`) and `ContractDetailPage` (`/contracts/:contractId`) — `/contracts` previously 404'd (only `/contracts/new`, the wizard, existed); "Contrats" is already a nav link
  - [x] Cross-linked contract numbers from `ClientDetailPage`'s and `RouteDetailPage`'s contract rows to the new `/contracts/:id`, and the contract detail page links back to its client — verified the round trip live (Contract → Client → same contract shown again)
  - [x] **Deliberately did not touch `ContractWizardPage`'s mock creation flow**: checked `reca-app`'s real `contracts.service.ts` first and found real contract creation is genuinely large — satellite property/zone capture, generated legal clauses, wizard-default settings lookup, automatic invoice-schedule generation, soft-delete/upsert zone syncing. Wiring the existing 3-step mock wizard to a real `insert` would produce a contract missing everything the real system requires (zones, clauses, pricing basis) — worse than leaving it clearly marked as a mock. Real contract creation needs to be scoped as its own task once Zones/Invoices exist, not bolted onto this pass.
  - [x] Verified live signed in as the real `administrateur` account: 34 real contracts listed with real client names and prices, opened CTR-000055 (the same contract already verified via Clients and Routes) showing real dates/address/status, followed the client link successfully
- **Leads — done (first slice, full CRUD)**:
  - [x] Real domain model (`src/features/leads/domain/lead.types.ts`), repository interface + Supabase implementation (`SupabaseLeadRepository`), mapper — `leads` table typed with full real columns from `reca-app/supabase/migrations/20260709143637_leads.sql`
  - [x] `src/domain/leadStatus.ts` — real `LeadStatus` (`nouveau`/`contacte`/`soumission_envoyee`/`converti`/`perdu`), no anti-corruption mapping needed (DB values read fine as-is); labels/tones cross-checked against `reca-app`'s real `LeadStatusBadge.tsx`
  - [x] `createLeadSchema` (`src/features/leads/schemas/lead.schema.ts`) matches `reca-app`'s real `leadSchema` field-for-field
  - [x] New `LeadListPage` (`/leads`, search + status filter chips + responsive table), `LeadDetailPage` (`/leads/:leadId`, contact/service info + status-transition buttons), `LeadCreatePage` (`/leads/new`, full form using `useCreateLead()`) — unlike Contracts/Routes, real Lead creation in `reca-app` is a plain insert with no wizard-default/zone/invoice complexity, so this module went further than "read-only first pass" and shipped real writes immediately
  - [x] Repository implements soft-delete filtering (`deleted_at is null`) on list/get, matching `reca-app`'s real service pattern — confirmed live that both pre-existing leads in the shared DB are soft-deleted (`deleted_at` set), so the list correctly showing "0 leads" before the test insert was genuine real state, not a bug
  - [x] **Verified live signed in as the real `administrateur` account**: created a real test lead ("Test RECA-App-V2 QA", LEAD-000011) via the new form — real `POST` insert confirmed, redirected to its detail page showing all real fields; clicked "Contacté" on the status buttons — real `PATCH` update confirmed (NOUVEAU → CONTACTÉ), detail page and list page both reflected the change on refetch. This test lead intentionally remains in the shared DB (no delete UI built yet); it's clearly labeled as a QA record in its message field and can be soft-deleted via SQL later if desired.
  - [x] Code-split via `src/routes/lazyPages.tsx` (`LeadListPage`/`LeadDetailPage`/`LeadCreatePage`), consistent with T-005
- **Soumissions (Quotes) — done (first slice, full CRUD)**:
  - [x] Real domain model (`src/features/quotes/domain/quote.types.ts`), repository interface + Supabase implementation (`SupabaseQuoteRepository`), mapper — `quotes` table typed with full real columns from `reca-app/supabase/migrations/20260709143643_quotes.sql`
  - [x] `src/domain/quoteStatus.ts` — real `QuoteStatus` (`brouillon`/`envoyee`/`acceptee`/`refusee`/`expiree`), no anti-corruption mapping needed; labels/tones cross-checked against `reca-app`'s real `QuoteStatusBadge.tsx`
  - [x] Money handling: `quotes.montant`/`taxes`/`total` are decimal-dollar columns like `contracts.prix` — same `Math.round(dollars * 100)` conversion pattern at the mapper boundary, `total` recomputed from `montant + taxes` on every write (matches `reca-app`'s real service, which has no DB-level check constraint tying them together)
  - [x] New `QuoteListPage` (`/quotes`, search + status filter chips + table), `QuoteDetailPage` (`/quotes/:quoteId`, amounts, lead-origin link, status-transition buttons, client-linking panel), `QuoteCreatePage` (`/quotes/new`, optional `?leadId=` param for future lead→quote flow)
  - [x] **"Link to client" built matching the real (non-transactional) `reca-app` behavior, not the docs' aspirational `ConvertQuoteToClient`**: `reca-app`'s real `convertQuoteToClient()` is a plain `update({client_id, statut: 'acceptee'})` assuming the client already exists — it does NOT create a client or contract. Building a real multi-step transactional conversion (create client + contract from a quote) would be inventing a capability that doesn't exist in the reference system; `QuoteDetailPage`'s "Lier au client" picker (backed by the real `useClients()` list) mirrors the actual capability and says so explicitly in the UI copy. A real `ConvertQuoteToClient` RPC is a future scope decision, not built here.
  - [x] Repository implements soft-delete filtering (`deleted_at is null`), matching `reca-app`'s real service pattern — confirmed live the one pre-existing quote in the shared DB is soft-deleted, so "0 soumissions" before the test insert was genuine real state
  - [x] **Verified live signed in as the real `administrateur` account**: created a real test quote (SOUM-000008, 1 250,00 $ + 186,63 $ taxes = 1 436,63 $ total — money math confirmed correct) via the new form; updated its status live (BROUILLON → ENVOYÉE); linked it to a real client ("Jean Test") via the picker — confirmed the real write auto-flipped status to ACCEPTÉE and the detail/list pages both reflected it on refetch; confirmed no regression on `ClientDetailPage` (quotes aren't surfaced there yet — out of scope, contracts-only stat panel unaffected)
  - [x] Code-split via `src/routes/lazyPages.tsx`, consistent with T-005
- **Employés — done (first slice, full CRUD)**:
  - [x] Real domain model (`src/features/employees/domain/employee.types.ts`), repository interface + Supabase implementation (`SupabaseEmployeeRepository`), mapper — `employees` table typed with full real columns from `reca-app/supabase/migrations/20260709143634_employees.sql`
  - [x] No status enum — matches `reca-app`'s real model exactly: just a boolean `actif` column (no multi-state status like Equipment/Quotes/Leads). `EmployeeDetailPage`'s "Statut" panel is a single toggle button (`setActive(!active)`), not a status-order list.
  - [x] `role` is free text in the real DB (no CHECK constraint) — `employeeRoles = ['Administrateur', 'Employé']` is a frontend-only suggested list (matches `reca-app`'s real `EMPLOYEE_ROLES` constant), not an enforced enum; the create form uses it as a `<select>` for consistency but the column itself accepts any string.
  - [x] New `EmployeeListPage` (`/employees`, search + actif/inactif filter chips + table), `EmployeeDetailPage` (`/employees/:employeeId`, contact info + active toggle), `EmployeeCreatePage` (`/employees/new`)
  - [x] `employee_equipment` (the M:N assignment join table) was **not** built this pass — `reca-app` has a separate `employeeEquipment.service.ts` for it, but missions/routes already reference employees/equipments directly via `operator_id`/`equipment_id`, so there was no immediate need; scope as its own task if a real "assign equipment to an employee" UI is wanted later.
  - [x] **Verified live signed in as the real `administrateur` account**: `/employees` correctly showed 2 real employees (Thomas Leroux, Test Opérateur); created a real test employee ("Test RECA-App-V2 QA") via the new form, then toggled its status live (ACTIF → INACTIF), confirmed on refetch.
- **Équipements — done (first slice, full CRUD)**:
  - [x] Real domain model (`src/features/equipments/domain/equipment.types.ts`), repository interface + Supabase implementation (`SupabaseEquipmentRepository`), mapper — `equipments` table typed with full real columns from `reca-app/supabase/migrations/20260709143700_equipments.sql`
  - [x] `src/domain/equipmentStatus.ts` — real `EquipmentStatus` (`disponible`/`en_operation`/`entretien`/`brise`) + `equipmentCategories` constant, cross-checked against `reca-app`'s real `EquipmentStatusBadge.tsx` and `EQUIPMENT_CATEGORIES`
  - [x] **`statut` deliberately excluded from the create/edit schema**, matching `reca-app`'s real `equipment.schema.ts` exactly — status is only ever changed via the dedicated status-update action (`updateEquipmentStatus`), never as a field in the create/edit form. New equipment always starts `disponible` (the column's real DB default).
  - [x] New `EquipmentListPage` (`/equipments`, search + status filter chips + table), `EquipmentDetailPage` (`/equipments/:equipmentId`, specs + status-transition buttons + entretien/notes), `EquipmentCreatePage` (`/equipments/new`)
  - [x] **Verified live signed in as the real `administrateur` account**: `/equipments` correctly showed 6 real equipment items (trucks, tractors, all `DISPONIBLE`); created a real test equipment item ("Test RECA-App-V2 QA", EQ-009, Souffleuses) via the new form, then moved its status live (DISPONIBLE → ENTRETIEN), confirmed on refetch.
  - [x] Both modules code-split via `src/routes/lazyPages.tsx`, consistent with T-005
- **Remaining 3 modules**: not yet scoped. Per `docs/00-Vision.md` §33 and §14: Factures, Paiements, Paramètres — each derived from the Master UI patterns built in T-002, following the same real-schema cross-check process used for every module so far (read `reca-app`'s migrations, don't guess column names). Real contract _creation_ (replacing the mock wizard) is tracked here too, blocked on Zones/Invoices scope.

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

### T-005 — Route-level code splitting

- **Status**: Done — build's "chunk larger than 500 kB" warning (had grown to 687 kB) is fully resolved, no warnings at all now. Verified live: every route navigated to (Missions/Routes/Clients/Contrats) loaded its lazy chunk instantly with no visible flash or console error; Playwright's login test (which now exercises the lazy `LoginPage` chunk) still passes.
- **Priority**: Low (perf, not correctness)
- **Dependencies**: none
- **What's built**:
  - [x] `src/routes/lazyPages.tsx` — every feature page (Dashboard, Missions, Routes, Clients, Contracts, the wizard, and `LoginPage`) is `React.lazy()`-loaded. Isolated in its own file rather than inline in `router.tsx` specifically to avoid `react-refresh/only-export-components` warnings (10 of them, checked and fixed rather than left as new lint noise).
  - [x] `AppShell` wraps `<Outlet />` in a `<Suspense>` with a simple "Chargement…" fallback; the public `/login` route (outside `AppShell`, so outside that boundary) gets its own `<Suspense>` in `router.tsx`.
  - [x] `LoginPage` is imported directly from its own file in `lazyPages.tsx`, **not** through `features/auth`'s barrel `index.ts` — the barrel is also imported eagerly (for `RequireAuth`), and importing `LoginPage` through the same barrel let the bundler fold it back into the eager chunk (`INEFFECTIVE_DYNAMIC_IMPORT` build warning caught this). Removed `LoginPage` from that barrel's exports entirely once found.
  - [x] `vite.config.ts`: vendor code split into `react-vendor`/`supabase-vendor`/`query-vendor`/`forms-vendor`/`vendor` chunks via `build.rolldownOptions.output.codeSplitting.groups` — **not** `rollupOptions.output.manualChunks`, which is deprecated/ignored on this project's Vite 8 (it uses the Rolldown bundler, confirmed by reading `vite`'s own type definitions rather than guessing from older Rollup-era docs/tutorials).
  - [x] Result: main entry chunk dropped from 687 kB to ~15 kB; largest chunk is now `react-vendor` at ~309 kB, comfortably under the 500 kB warning threshold.

---

## Notes

No feature-module tasks (Leads, Clients, Contracts, Routes, Missions, etc.) are opened yet — per the mandated method (`docs/00-Vision.md` §33), those only start after bootstrap and Master UI are in place. Add them here as they're scoped.
