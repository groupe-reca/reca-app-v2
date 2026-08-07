# memory.md

Purpose: confirmed, durable project decisions only (per `docs/16-Development-Standards.md` §154). No hypotheses, no unvalidated ideas, no temporary details, no conversation history. Unconfirmed decisions belong in `plans.md`; work items belong in `tasks.md`.

Read this file (along with `tasks.md`, `plans.md`, `file-index.md`, and `CLAUDE.md`) before any significant work, and update it whenever a durable decision is confirmed.

---

## Status

The `src/` scaffold, tooling (TypeScript strict, ESLint, Prettier, Vitest, Playwright), and CI pipeline exist and are green (`pnpm check` passes). **PostGIS is explicitly deferred, not decided** — see `docs/adr/ADR-003-postgis.md`. Vendor/infra choices with no docs default (monitoring, analytics, feature flags tooling, Storybook, deployment platform) remain open and are tracked in `plans.md` per `docs/16-Development-Standards.md` §195. `src/infrastructure/supabase/database.types.ts` is currently a hand-written placeholder, not yet generated from the real shared schema — see `tasks.md` T-001.

## Bootstrap decisions

- **Package manager**: pnpm. `docs/adr/ADR-001-package-manager.md`.
- **Operator-contract / database strategy**: `reca-app-v2` uses the **same Supabase database/project as `reca-app`** — confirmed directly by the project owner ("tout est géré par Supabase, on utilise la même base de donnée que reca-app"). There is no separate `@reca/contracts` package and no cross-repo type-generation pipeline; the shared Postgres schema (tables, RPCs, migrations) _is_ the integration contract with `reca-operateur`. Legacy/foreign fields still go through the anti-corruption layer per `docs/03-Application-Architecture.md` §52. `docs/adr/ADR-002-operator-contracts.md`.
- **DB type generation**: Supabase CLI (`supabase gen types typescript`), output committed to `src/infrastructure/supabase/database.types.ts`, never hand-edited (per `docs/16-Development-Standards.md` §82).
- **Branded types**: adopt lightweight nominal typing for IDs (`MissionId`, `ContractId`, etc.) per `docs/16-Development-Standards.md` §20 — reversible, low-risk TypeScript ergonomics choice, no ambiguity in the docs.
- **Git conventions**: adopted as proposed in `docs/16-Development-Standards.md` §139–141 — branch prefixes `feature/*`, `fix/*`, `migration/*`, `docs/*`, `hotfix/*`; commit messages in the `type(scope): summary` style shown there.
- **Test coverage policy**: risk-based priority (critical business rules, transactions, permissions, mappers, sync, finance) rather than a blanket numeric coverage threshold, per `docs/16-Development-Standards.md` §132.
- **i18n scope**: fr-CA is the only shipped language initially; string/translation keys are structured from the start so en-CA can be added later without rework, per `docs/16-Development-Standards.md` §121.
- **PostGIS**: NOT decided — deferred. Default behavior until revisited: geometry stored as GeoJSON/JSONB. See `docs/adr/ADR-003-postgis.md`. Do not treat this as settled.
- **CI provider**: GitHub Actions (`.github/workflows/ci.yml`), running `format:check`, `lint`, `typecheck`, `test`, `build` on push to `main` and on pull requests. Adopted because the repo is already hosted on GitHub — this uses infrastructure already in place, not a new vendor commitment, so it wasn't treated as needing the same owner sign-off as monitoring/analytics/deployment choices. Deployment platform (where the built app actually runs) is a separate, still-open decision.
- **Exact tool versions** (locked via `pnpm-lock.yaml`): React 19, Vite 8, **TypeScript 5.9** (not 7 — `typescript-eslint` 8.66 doesn't support TS 7.0 yet, so installing `typescript@latest` breaks lint; pin to `^5` until that changes), Tailwind CSS 4, TanStack Query 5, React Router 7, Zod 4, React Hook Form 7, Vitest 4, `@playwright/test` 1.62.
- **ESLint/Prettier configuration**: `eslint.config.js` (flat config) using `typescript-eslint` strict + stylistic type-checked rules, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react-refresh`; explicit rules for `no-explicit-any: error`, `no-non-null-assertion: error`, `no-floating-promises: error`, `consistent-type-imports: error`, and a `no-restricted-imports` rule blocking `createClient` from `@supabase/supabase-js` everywhere except `src/infrastructure/supabase/client.ts`. Prettier config (`.prettierrc.json`): no semicolons, single quotes, trailing commas, 90 print width, `prettier-plugin-tailwindcss` for class sorting.
- **Repo structure**: adopted as documented (`docs/03-Application-Architecture.md` §9, `docs/16-Development-Standards.md` §7–8) — `src/{app,config,domain,features,infrastructure,routes,styles,test}`, `supabase/{functions,migrations,seed,tests}`, `tests/{e2e,integration,fixtures}`, `docs/adr/`. Subfolders are created only when they represent a real responsibility, not pre-scaffolded wholesale.

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
