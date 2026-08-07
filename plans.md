# plans.md

Purpose: active plans, proposed (unconfirmed) decisions, sequencing, risks, and validations (per `docs/16-Development-Standards.md` §152). Once a decision here is actually confirmed, move it to `memory.md` and remove it from this file. Do not treat anything in this file as settled.

---

## Active plan: Technical bootstrap of `reca-app-v2`

**Status**: In progress. Documentation phase (`docs/00`–`17`) is complete; core repo scaffolding (step 2–3 below) is done. See `tasks.md` T-001 for the exact checklist and what's left.

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
- ~~CI provider/pipeline~~ → GitHub Actions (`.github/workflows/ci.yml`), adopted because the repo is already hosted on GitHub — not a new vendor commitment, just using what's already in place. Runs format/lint/typecheck/test/build on push and PR. Deployment platform is still separate and open below.
- ~~Exact tool versions~~ → pinned as part of scaffolding: React 19, Vite 8, TypeScript 5.9 (see note below — TS 7 was tried first but isn't yet supported by `typescript-eslint`), Tailwind 4, TanStack Query 5, React Router 7, Zod 4, Vitest 4, Playwright 1.62. See `pnpm-lock.yaml` for exact versions.
- ~~ESLint/Prettier configuration~~ → `eslint.config.js` (flat config, typescript-eslint strict+stylistic type-checked, react-hooks, jsx-a11y, react-refresh) and `.prettierrc.json` (no semicolons, single quotes, Tailwind class sorting via `prettier-plugin-tailwindcss`).
- ~~Repo structure~~ → adopted as documented in `docs/03-Application-Architecture.md` §9 / `docs/16-Development-Standards.md` §7–8, with subfolders created only as needed (see `file-index.md`).

### Still open — deferred, not owner-decided (see `docs/adr/ADR-003-postgis.md`)

- **PostGIS**: owner wasn't sure what it is; default for now is GeoJSON/JSONB geometry storage, no PostGIS columns yet. Revisit when a concrete spatial-query need appears. Do not silently mark this "Accepted."

### Still open — vendor/infra choices, no docs default, need owner input

Non-blocking for scaffolding `src/`; needed before the CI/deploy portion of T-001:

- Monitoring / observability provider
- Analytics provider
- Feature flag tooling
- Storybook: adopt or not
- Deployment platform (hosting for the built frontend and the CI deploy step)

**Note on TypeScript 7**: `pnpm add -D typescript` initially installed TypeScript 7.0.2, but `typescript-eslint` 8.66 doesn't support it yet (`typescript-eslint does not support TS 7.0`). Pinned to `typescript@^5` (currently 5.9.3) instead. Revisit once `typescript-eslint` adds TS 7 support — this is a tooling-compatibility fact, not a preference, so it isn't a "decision" per se, but it's worth remembering so nobody re-bumps to TS 7 and silently breaks lint.

**Risks**:

- Starting code before the remaining vendor/infra items are confirmed is fine for `src/` scaffolding, but the actual deploy step must not proceed on guesses.
- PostGIS being left undecided means early migrations must be written so a later JSONB → geometry conversion is additive, not a rewrite.
- `database.types.ts` now has real, migration-derived types for the Missions module's tables (see `tasks.md` T-003), but most of the shared schema (leads, quotes, invoices, payments, users, ...) is still untyped — don't assume the whole file is authoritative yet.

**Validation**: each confirmed decision is recorded in `memory.md` and, where architecturally significant, as an ADR under `docs/adr/` per `docs/16-Development-Standards.md` §162–163.

---

## Active plan: Real database.types.ts generation

**Status**: Partially resolved for the Missions module only (T-003), by hand-deriving types from `reca-app`'s migration files rather than running the actual `supabase gen types typescript` command. This is not the mandated method (`memory.md` says CLI-generated), so it should be replaced when possible.

**What happened**: the shared Supabase project's anon key can query tables (RLS-permitting) but the project blocks both the root OpenAPI introspection endpoint and `OPTIONS`-based column introspection for non-`service_role` keys — the standard no-DB-password ways to run `supabase gen types typescript` don't work here. Probing via the anon key found real table names but not columns (all confirmed tables are empty in this shared dev project). `reca-app`'s migration files (`C:/var/www/html/reca-app/supabase/migrations/`) turned out to have everything needed for the Missions tables specifically.

**Still open**: a real `supabase gen types typescript --db-url <connection-string>` run (or a service_role key, used once locally, never committed) would give complete, authoritative types for the _entire_ schema in one shot, superseding the hand-derived subset. Ask before requesting either — they're more sensitive than the anon key already in `.env`.

**Risk if skipped long-term**: hand-deriving types per-module from migration files (as done for Missions, and now `users` for T-004 Auth) is slower and can drift from reality if a migration is missed or misread. Fine as a bridge, not a long-term substitute for real introspection.
