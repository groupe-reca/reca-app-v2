# tasks.md

Purpose: work to be done, status, priority, dependencies, acceptance criteria (per `docs/16-Development-Standards.md` §151). Update status as work progresses; don't let this file go stale.

---

## Open tasks

### T-001 — Technical bootstrap of `reca-app-v2`
- **Status**: In progress
- **Priority**: High (blocks all feature work)
- **Dependencies**: Confirm the open decisions tracked in `plans.md` under "Technical bootstrap of `reca-app-v2`" (package manager, versions, ESLint/Prettier, repo structure, Operator-contract strategy, monitoring, feature flags, PostGIS, DB type generation, CI/deploy, i18n, coverage policy, Git conventions).
- **Acceptance criteria**:
  - [ ] All decisions listed in `plans.md` are confirmed and recorded in `memory.md` (and as ADRs where architecturally significant, per `docs/16-Development-Standards.md` §162)
  - [ ] Repo initialized with the agreed package manager and lockfile committed
  - [ ] `package.json` scripts exist for `dev`, `build`, `lint`, `lint:fix`, `typecheck`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `format`, `format:check`, `check` (per `docs/16-Development-Standards.md` §6)
  - [ ] Base `src/` structure created per `docs/03-Application-Architecture.md` §9 and `docs/16-Development-Standards.md` §7–8
  - [ ] TypeScript strict mode enabled with the flags listed in `docs/16-Development-Standards.md` §15
  - [ ] Supabase client wired up in `src/infrastructure/supabase/`, no direct `supabase.from(...)` calls permitted outside it
  - [ ] CI pipeline runs format/lint/typecheck/tests/build on contributions

### T-002 — Master UI screens
- **Status**: Not started
- **Priority**: High
- **Dependencies**: T-001 complete
- **Acceptance criteria**: the six Master UI models exist and are used as the pattern source for derived modules — Centre des opérations, entity list, commercial record (fiche commerciale), operational record (fiche opérationnelle), complex form, mobile experience (`docs/00-Vision.md` §34).

---

## Notes

No feature-module tasks (Leads, Clients, Contracts, Routes, Missions, etc.) are opened yet — per the mandated method (`docs/00-Vision.md` §33), those only start after bootstrap and Master UI are in place. Add them here as they're scoped.
