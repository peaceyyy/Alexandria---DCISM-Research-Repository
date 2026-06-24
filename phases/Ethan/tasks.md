# Ethan Task Board

Role: Frontend Person 2 / Light Backend Support

Primary responsibility: Auth screens, admin dashboard/editor UI, PDF preview/download states, and basic admin-dashboard backend support when needed.

## Phase 1: Project Contracts and Team Workflow

Status: Not Started

Tasks:

- Review PRD sections for auth, roles, PDF access, admin workflow, publish validation, archive, and PDF replacement.
- Review Homer's auth/admin contracts and flag missing UI needs.
- Identify admin components needed: dashboard table/list, status filters, editor form, ordered-list editor, file upload panel, publish readiness panel, archive action.

Handoff:

- Give Homer a list of admin/auth UI data requirements.

## Phase 2: Supabase Foundation

Status: Not Started

Tasks:

- Confirm seed data includes Admin, Contributor, and Student visitor examples.
- Check that draft, published, and archived records exist for dashboard testing.
- Coordinate with Shane/Homer on any admin list fields needed for UI.

Handoff:

- Give Shane/Homer admin seed-data requests.

## Phase 3: Auth and Role Enforcement

Status: Not Started

Tasks:

- Build or support login, signup, auth callback/error, and logout UI.
- Make `usc.edu.ph` student signup rule clear in the form.
- Build basic protected admin shell/navigation if needed.
- Help Homer test Admin, Contributor, Student visitor, and anonymous states.

Handoff:

- Give Leira the agreed auth UI language and reusable auth-state patterns.

## Phase 4: Public Repository Backend

Status: Not Started

Tasks:

- Support PDF preview/download state integration if Leira needs help.
- Confirm PDF URL endpoint returns enough state for UI feedback.
- Help test authenticated vs anonymous PDF access.

Handoff:

- Give Homer any PDF endpoint issues found during UI testing.

## Phase 5: Public Repository Frontend

Status: Not Started

Tasks:

- Support Leira on auth-aware PDF controls.
- Review detail page behavior for authenticated PDF preview/download.
- Help with shared components if they overlap with admin views.

Handoff:

- Confirm auth/PDF UI behavior is ready for admin work.

## Phase 6: Admin Backend Workflows

Status: Not Started

Tasks:

- Review admin backend contracts before building UI.
- Help Homer with simple route wiring or dashboard-specific endpoint shaping if needed.
- Provide concrete validation response needs for publish readiness.

Handoff:

- Confirm admin frontend can proceed without contract blockers.

## Phase 7: Admin Frontend Workflows

Status: Not Started

Tasks:

- Build protected admin dashboard with status filters/search and quick actions.
- Build thesis editor for metadata, authors, tags, recommendations, lessons, and optional links.
- Build PDF upload/replacement panel.
- Build publish readiness panel using backend validation errors.
- Build archive/unpublish action with confirmation.
- Add loading, empty, error, unauthorized, validation, and success states.

Handoff:

- Give Homer final admin UI integration notes and any backend issues.

## Phase 8: Integration QA and Demo Polish

Status: Not Started

Tasks:

- QA auth and admin workflows on desktop and mobile.
- Verify Student visitor cannot reach admin dashboard.
- Verify Contributor limitations match Homer's role rules.
- Polish validation messages and success/error states.

Handoff:

- Give Homer final auth/admin QA notes.
