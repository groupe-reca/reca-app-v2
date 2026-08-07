# plans.md

Purpose: active plans, proposed (unconfirmed) decisions, sequencing, risks, and validations (per `docs/16-Development-Standards.md` §152). Once a decision here is actually confirmed, move it to `memory.md` and remove it from this file. Do not treat anything in this file as settled.

---

## Active plan: Technical bootstrap of `reca-app-v2`

**Status**: Not started. Documentation phase (`docs/00`–`17`) is complete; per the official method (`docs/00-Vision.md` §33), technical bootstrap is the next phase before any feature implementation.

**Sequence** (per `docs/00-Vision.md` §33 and `docs/16-Development-Standards.md` §198):
1. Confirm the open decisions below.
2. Initialize repo tooling (package manager, TypeScript, Vite, ESLint, Prettier, Vitest, Playwright configs).
3. Establish base folder structure (`src/app`, `src/features`, `src/domain`, `src/infrastructure`, `src/components`, `src/routes`, `supabase/`, `tests/`) per `docs/03-Application-Architecture.md` §9 and `docs/16-Development-Standards.md` §7–8.
4. Build Master UI screens (Centre des opérations, entity list, commercial record, operational record, complex form, mobile experience) per `docs/00-Vision.md` §34 before deriving individual modules.
5. Proceed to roadmap/sprints per `docs/17-Roadmap.md`.

**Decisions to confirm before initialization** — updated 2026-08-07. See `memory.md` for what's now confirmed and `docs/adr/` for the three decisions significant enough to warrant an ADR.

### Resolved (moved to `memory.md` / `docs/adr/`)

- ~~Package manager~~ → pnpm. `docs/adr/ADR-001-package-manager.md`.
- ~~Shared Operator-contract strategy~~ → same Supabase database/schema as `reca-app` (no separate package). `docs/adr/ADR-002-operator-contracts.md`.
- ~~Method of DB type generation~~ → Supabase CLI, committed to repo.
- ~~Branded types strategy~~ → adopt (per `docs/16-Development-Standards.md` §20, already documented as the recommended pattern).
- ~~Git branching/commit conventions~~ → adopted as literally proposed in `docs/16-Development-Standards.md` §139–141.
- ~~Test coverage policy~~ → risk-based priority (critical rules, transactions, permissions, mappers, sync, finance), not a blanket numeric threshold, per `docs/16-Development-Standards.md` §132 (already the documented policy — just confirmed as adopted).
- ~~i18n strategy~~ → fr-CA is the only shipped language initially; string keys structured for en-CA later, per `docs/16-Development-Standards.md` §121.

### Still open — deferred, not owner-decided (see `docs/adr/ADR-003-postgis.md`)

- **PostGIS**: owner wasn't sure what it is; default for now is GeoJSON/JSONB geometry storage, no PostGIS columns yet. Revisit when a concrete spatial-query need appears. Do not silently mark this "Accepted."

### Still open — vendor/infra choices, no docs default, need owner input

Non-blocking for scaffolding `src/`; needed before the CI/deploy portion of T-001:

- Monitoring / observability provider
- Analytics provider
- Feature flag tooling
- Storybook: adopt or not
- CI provider/pipeline
- Deployment platform
- Exact tool versions (React, Vite, TypeScript, etc.) and ESLint/Prettier configuration — can be pinned during scaffolding itself rather than pre-decided in the abstract
- Exact repo structure — confirm vs. adapt the recommended structure once scaffolding starts

**Risks**:
- Starting code before the remaining vendor/infra items are confirmed is fine for `src/` scaffolding, but CI/deploy work must not proceed on guesses.
- PostGIS being left undecided means early migrations must be written so a later JSONB → geometry conversion is additive, not a rewrite.

**Validation**: each confirmed decision is recorded in `memory.md` and, where architecturally significant, as an ADR under `docs/adr/` per `docs/16-Development-Standards.md` §162–163.
