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

**Decisions to confirm before initialization** (per `docs/16-Development-Standards.md` §98 and §195 — none of these are decided yet):
- Package manager (recommendation in the standards doc: pnpm) and exact tool versions (React, Vite, TypeScript, etc.)
- ESLint / Prettier configuration
- Exact repo structure (confirm vs. adapt the recommended structure)
- Branded types strategy (use or skip nominal typing for IDs)
- Shared Operator-contract strategy: dedicated package (`@reca/contracts`) vs. generated types (`docs/03-Application-Architecture.md` §51)
- Monitoring / observability provider
- Analytics provider
- Feature flag tooling
- Storybook: adopt or not
- i18n strategy (initial language fr-CA; en-CA structure to keep open)
- PostGIS: adopt now or defer
- Method of DB type generation from Supabase
- CI provider/pipeline
- Deployment platform
- Test coverage policy
- Git branching/commit conventions (proposed: `feature/*`, `fix/*`, `migration/*`, `docs/*`, `hotfix/*` per `docs/16-Development-Standards.md` §141 — needs confirmation, not yet adopted)

**Risks**:
- Starting code before these are confirmed risks rework and inconsistency across modules.
- Undecided Operator-contract strategy risks silent divergence between `reca-app-v2` and `reca-operateur` payload shapes.

**Validation**: each confirmed decision should be recorded in `memory.md` and, where architecturally significant, as an ADR under `docs/adr/` per `docs/16-Development-Standards.md` §162–163.
