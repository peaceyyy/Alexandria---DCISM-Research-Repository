# Homer Task Board

Role: Backend / Project Manager

Primary responsibility: Keep Alexandria integrated. Own API contracts, backend route/action logic, Supabase integration patterns, validation gates, documentation consistency, and team review flow.

## Phase 1: Project Contracts and Team Workflow

Status: Not Started

Tasks:

- Maintain `.agent/project_specification.md`, `.agent/roadmap.md`, and `phases/general/roadmap.md`.
- Define initial API response shapes for thesis cards, thesis detail, `/api/me`, admin rows, and publish validation errors.
- Decide where mock payloads will live for Leira and Ethan.
- Create or request `frontend/.env.example` with Supabase variables and `ALEXANDRIA_ALLOWED_EMAIL_DOMAINS=usc.edu.ph`.
- Confirm review flow with Shane, Leira, and Ethan.

Handoff:

- Give Leira and Ethan stable mock payloads.
- Give Shane reviewed schema priorities and required query patterns.

## Phase 2: Supabase Foundation

Status: Not Started

Tasks:

- Review Shane's ERD, migrations, RLS, storage policy, and seed-data draft.
- Confirm schema supports all backend contracts before UI depends on it.
- Check that public metadata and protected PDFs have separate access boundaries.
- Confirm seed data includes recommendations and lessons with distinct meanings.

Handoff:

- Approve schema/query baseline for Phase 3 and Phase 4.

## Phase 3: Auth and Role Enforcement

Status: Not Started

Tasks:

- Install and configure Supabase client libraries when implementation starts.
- Build server/browser Supabase helpers.
- Implement middleware session handling.
- Implement `/api/me`.
- Implement role helpers for Admin, Contributor, and Student visitor.
- Enforce `usc.edu.ph` student visitor signup.

Handoff:

- Give Ethan role-aware auth/admin shell behavior.
- Give Leira public UI auth-state contract.

## Phase 4: Public Repository Backend

Status: Not Started

Tasks:

- Implement `GET /api/theses` with keyword search, filters, sort, and pagination.
- Implement thesis detail route with metadata, recommendations, lessons, related theses, and PDF access state.
- Implement authenticated PDF URL endpoint.
- Add structured error responses.
- Review query performance with Shane.

Handoff:

- Give Leira live public endpoints or exact mock-equivalent contracts.

## Phase 5: Public Repository Frontend

Status: Not Started

Tasks:

- Support Leira with endpoint integration and bug fixes.
- Keep API contract changes explicit and documented.
- Verify anonymous users cannot obtain PDF URLs from the UI or API.
- Review public detail page for required metadata and knowledge-transfer sections.

Handoff:

- Sign off that student-facing repository behavior matches the PRD.

## Phase 6: Admin Backend Workflows

Status: Not Started

Tasks:

- Implement admin thesis list, create, update, file register/replace, publish, archive, and soft-delete routes.
- Centralize publish validation.
- Ensure publish requires at least one recommendation and one lesson learned.
- Preserve old PDF metadata when replacing files.
- Keep service-role behavior server-only if it is used.

Handoff:

- Give Ethan admin backend contracts and validation response examples.

## Phase 7: Admin Frontend Workflows

Status: Not Started

Tasks:

- Support Ethan with admin route integration.
- Review editor payloads for nested authors, tags, recommendations, and lessons.
- Verify contributor/admin authorization behavior.
- Confirm archive/unpublish removes records from public endpoints.

Handoff:

- Sign off that the admin UI follows backend validation and role rules.

## Phase 8: Integration QA and Demo Polish

Status: Not Started

Tasks:

- Coordinate QA checklist and final issue triage.
- Run or delegate lint/build checks.
- Verify anonymous, Student visitor, Contributor, and Admin flows.
- Prepare final setup notes, demo script, and known-limits list.
- Update docs if implementation differs from the plan.

Handoff:

- Deliver final MVP status and demo readiness summary.
