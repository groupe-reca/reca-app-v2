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

- **Status**: Not started
- **Priority**: High
- **Dependencies**: T-001 complete
- **Acceptance criteria**: the six Master UI models exist and are used as the pattern source for derived modules — Centre des opérations, entity list, commercial record (fiche commerciale), operational record (fiche opérationnelle), complex form, mobile experience (`docs/00-Vision.md` §34).

---

## Notes

No feature-module tasks (Leads, Clients, Contracts, Routes, Missions, etc.) are opened yet — per the mandated method (`docs/00-Vision.md` §33), those only start after bootstrap and Master UI are in place. Add them here as they're scoped.
