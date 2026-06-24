# Alexandria Team Roadmap

Generated: 2026-06-24

This is the human/team-facing roadmap. Agent-facing detailed plans live in `.agent/plans/`. Role-specific work boards live in:

- `phases/Homer/tasks.md`
- `phases/Leira/tasks.md`
- `phases/Ethan/tasks.md`
- `phases/Shane/tasks.md`

## Team Roles

| Person | Role | Primary Ownership |
| --- | --- | --- |
| Homer | Backend / Project Manager | API contracts, Supabase integration, route handlers, validation gates, documentation, review coordination |
| Leira | Frontend 1 | Public repository browse/search/detail experience and responsive public UI |
| Ethan | Frontend 2 / Light Backend | Auth screens, admin dashboard/editor UI, PDF/admin states, light backend route support |
| Shane | Database Engineer | Supabase schema, RLS, storage policies, indexes, seed data, query support |

## Phase Summary

| Phase | Name | Team Outcome | Lead | Main Reviewers |
| --- | --- | --- | --- | --- |
| 1 | Project Contracts and Team Workflow | Everyone knows the contracts, folders, and task ownership | Homer | All |
| 2 | Supabase Foundation | Schema, RLS, storage, indexes, and seed data exist | Shane | Homer |
| 3 | Auth and Role Enforcement | Login/signup and role checks work | Homer | Ethan, Shane |
| 4 | Public Repository Backend | Public APIs return searchable thesis data and protected PDF URLs | Homer | Leira, Shane |
| 5 | Public Repository Frontend | Students can browse, search, inspect, and request PDF access | Leira | Homer, Ethan |
| 6 | Admin Backend Workflows | Draft/edit/upload/publish/archive routes work | Homer | Shane, Ethan |
| 7 | Admin Frontend Workflows | Admin dashboard and editor are usable | Ethan | Homer, Leira |
| 8 | Integration QA and Demo Polish | End-to-end demo is stable and documented | Homer | All |

## Working Agreement

- Homer is the integration checkpoint for product decisions, API contracts, and merge readiness.
- Shane reviews all schema/RLS/storage changes with Homer before frontend depends on them.
- Leira and Ethan can use mock payloads while backend/database work is underway, but mock fields must match the agreed contracts.
- Product decision changes must be logged in `docs/design-decision-log.md`.
- Every phase should end with a runnable or reviewable demo state.

## Phase 1: Project Contracts and Team Workflow

Goal: Convert the PRD into stable implementation contracts and role task boards.

Deliverables:

- Team roadmap and role task boards.
- Initial API/mock payload agreement.
- Environment variable expectations.
- Review flow and ownership model.

Exit Criteria:

- Role task boards are complete.
- Everyone knows what they own in Phase 2 and Phase 3.
- Frontend can start against mock data.

## Phase 2: Supabase Foundation

Goal: Establish database, RLS, private PDF storage, indexes, and seeds.

Deliverables:

- Core tables and relationships.
- `profiles.role` support for `admin`, `contributor`, and `student_visitor`.
- `draft`, `published`, and `archived` thesis statuses.
- Private/authenticated `thesis-pdfs` bucket.
- Seed data for public, draft, and archived records.

Exit Criteria:

- Anonymous users cannot read draft/archived data.
- Anonymous users cannot access PDFs.
- Seed data is enough for public and admin UI work.

## Phase 3: Auth and Role Enforcement

Goal: Connect Supabase Auth and enforce role-aware app behavior.

Deliverables:

- Supabase client helpers.
- Auth pages and callback flow.
- `usc.edu.ph` student visitor signup rule.
- `/api/me` contract.
- Role guard helpers.

Exit Criteria:

- Anonymous, Student visitor, Contributor, and Admin states are testable.
- Admin routes reject students and anonymous users.

## Phase 4: Public Repository Backend

Goal: Provide frontend-ready repository data.

Deliverables:

- Thesis list endpoint with search, filters, sort, pagination.
- Thesis detail endpoint with metadata, recommendations, lessons, and related theses.
- Authenticated PDF URL endpoint.
- Structured error responses.

Exit Criteria:

- Public endpoints return only published records.
- Authenticated PDF access works for Student visitors.
- Frontend can connect without reading raw Supabase joins.

## Phase 5: Public Repository Frontend

Goal: Build the student-facing discovery experience.

Deliverables:

- Browse/search page.
- Thesis cards.
- Filter and sort controls.
- Thesis detail page.
- Auth-aware PDF preview/download controls.

Exit Criteria:

- A student can find and inspect relevant thesis metadata quickly.
- Anonymous users see login prompts for PDFs.
- Mobile and desktop layouts are usable.

## Phase 6: Admin Backend Workflows

Goal: Implement server-side workflows for maintaining records.

Deliverables:

- Admin thesis list.
- Draft create/update.
- PDF metadata register/replace.
- Publish validation.
- Archive/unpublish and internal soft delete.

Exit Criteria:

- Incomplete records cannot be published.
- Archive hides records from public discovery.
- PDF replacement preserves old metadata.

## Phase 7: Admin Frontend Workflows

Goal: Build the admin dashboard and editor.

Deliverables:

- Protected admin dashboard.
- Thesis editor.
- Ordered authors, recommendations, and lessons UI.
- PDF upload/replacement panel.
- Publish readiness and archive actions.

Exit Criteria:

- Admin can create, complete, publish, and archive a thesis through the UI.
- Validation clearly separates missing recommendations from missing lessons.

## Phase 8: Integration QA and Demo Polish

Goal: Stabilize the MVP for presentation and handoff.

Deliverables:

- Role-based QA checklist.
- Final seed/demo data.
- Setup and demo notes.
- Known-limits list.

Exit Criteria:

- Lint/build checks pass or known failures are documented.
- Core role flows pass manual QA.
- Demo path is clear enough for the whole team.
