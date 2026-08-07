# file-index.md

Purpose: important files, their role, owner, links, and status (per `docs/16-Development-Standards.md` §153). Update as files are added, moved, or retired. No `src/` entries yet — the repo has no application code.

---

## Root

| File | Role | Status |
|---|---|---|
| `CLAUDE.md` | Instructions for Claude Code operating in this repo: project status, repo boundaries, memory workflow, architecture rules, hard non-negotiables | Active |
| `tasks.md` | Work items, status, priority, dependencies, acceptance criteria | Active |
| `plans.md` | Active plans and unconfirmed proposed decisions | Active |
| `memory.md` | Confirmed, durable project decisions only | Active |
| `file-index.md` | This file | Active |

## `docs/` — official specification (source of truth)

| File | Role | Status |
|---|---|---|
| `00-Vision.md` | Official product vision: goals, business chain, three-app relationship, non-negotiable principles, source-of-truth hierarchy | Official |
| `01-Design-System.md` | Visual system: tokens, principles, component direction, shared identity with RECA Opérateur | Official |
| `02-Information-Architecture.md` | Navigation structure, screen inventory, IA principles | Official |
| `03-Application-Architecture.md` | Technical architecture: layering, module boundaries, stack, state management, Supabase integration | Official |
| `04-Data-Architecture.md` | Data model / schema direction | Official |
| `05-Authentication-Roles-Permissions.md` | Auth, roles, permission model | Official |
| `06-Operations-Center-Dashboard.md` | Dashboard module spec | Official |
| `07-Leads-Quotes-Clients.md` | Leads/Quotes/Clients module spec | Official |
| `08-Contracts-and-Measurement.md` | Contracts module and measurement tool spec | Official |
| `09-Routes-Missions-and-Dispatch.md` | Routes/Missions/Dispatch module spec | Official |
| `10-Employees-and-Equipment.md` | Employees/Equipment module spec | Official |
| `11-Finance-and-Payments.md` | Invoices/Payments module spec | Official |
| `12-Operator-Integration-and-Synchronization.md` | Integration contract and sync design with RECA Opérateur | Official |
| `13-Mobile-and-Responsive-Experience.md` | Mobile/tablet/responsive experience spec | Official |
| `14-Search-Notifications-and-History.md` | Global search, notifications, activity/history spec | Official |
| `15-Migration-Strategy.md` | Migration plan from legacy `reca-app` | Official |
| `16-Development-Standards.md` | Mandatory coding, testing, security, review, and workflow standards | Official |
| `17-Roadmap.md` | Roadmap / sprint sequencing | Official |

## Visual references (not specifications)

| Path | Role | Status |
|---|---|---|
| `claude-code-design-mockup/` | Early desktop/mobile "Centre des opérations" HTML mockups | Reference only |
| `maquettes-visuelles/` | Visual mockup images | Reference only |

## `src/`, `supabase/`, `tests/`

Not yet created. Will be populated per `docs/03-Application-Architecture.md` §9 and `docs/16-Development-Standards.md` §7–8 during technical bootstrap (see `tasks.md` T-001). This index should be updated as those directories come into existence.
