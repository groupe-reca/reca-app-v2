# memory.md

Purpose: confirmed, durable project decisions only (per `docs/16-Development-Standards.md` §154). No hypotheses, no unvalidated ideas, no temporary details, no conversation history. Unconfirmed decisions belong in `plans.md`; work items belong in `tasks.md`.

Read this file (along with `tasks.md`, `plans.md`, `file-index.md`, and `CLAUDE.md`) before any significant work, and update it whenever a durable decision is confirmed.

---

## Status

**No technical bootstrap decisions have been confirmed yet.** The list of decisions to confirm before initializing the repo (package manager, exact versions, ESLint/Prettier config, shared Operator-contract strategy, monitoring, feature flags, PostGIS, DB type generation, CI/deploy platform, i18n strategy, coverage policy, Git conventions) is tracked in `plans.md` per `docs/16-Development-Standards.md` §195, and moves here only once actually decided.

## Confirmed decisions (from official documentation)

- **Product name**: RECA — Centre des opérations. Technical project name: RECA App V2. (`docs/00-Vision.md` §2)
- **Repository name**: `reca-app-v2`. (`docs/00-Vision.md` §2)
- **Three-repository boundary** (non-negotiable):
  - `reca-app-v2` — new application, new source of truth for the frontend.
  - `reca-app` — legacy app, functional/schema reference only, never modified without explicit request, never a runtime dependency of `reca-app-v2`.
  - `reca-operateur` — field/operator app, never modified without explicit request, never imported directly by `reca-app-v2`; the two communicate only via versioned data contracts.
  (`docs/00-Vision.md` §6, `docs/03-Application-Architecture.md` §4)
- **Data source of truth**: the existing Supabase database may be retained and adapted; a second database must not be created merely to avoid understanding the existing one. Changes must be documented, migratable, additive where possible, RLS-secured, and tested. (`docs/00-Vision.md` §20.1)
- **Recommended (not yet locked) tech stack**: React, Vite, TypeScript strict, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS on the frontend; Supabase (Postgres, Auth, Storage, Realtime, Edge Functions, PostGIS as needed) on the backend; Mapbox GL JS + Turf.js for mapping; Vitest, Testing Library, Playwright for testing. Exact versions to be locked at bootstrap. (`docs/03-Application-Architecture.md` §7, `docs/16-Development-Standards.md` §3)
- **Architecture style**: feature-first modules with internal Domain → Application → Infrastructure → Presentation layering; dependencies point toward the domain only. (`docs/03-Application-Architecture.md` §5–6, `docs/16-Development-Standards.md` §9–11)
- **Method of construction**: Vision → Design System → Information Architecture → Application Architecture → Data Architecture → Business modules → Master UI → Roadmap → Sprints → Implementation → Tests → Migration. Code must not begin before the required foundations are defined. (`docs/00-Vision.md` §33)

## Source-of-truth hierarchy (in case of contradiction)

1. Explicit recent decision from the project owner
2. Official RECA App V2 documentation (`docs/`)
3. `memory.md` (this file)
4. `plans.md`
5. RECA App V2 code and tests
6. `reca-operateur` documentation
7. Confirmed behavior of the legacy `reca-app`
8. Legacy app memory
9. Old mockups
10. Developer assumption

(`docs/00-Vision.md` §29)
