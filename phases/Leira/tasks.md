# Leira Task Board

Role: Frontend Person 1

Primary responsibility: Public repository browsing, search/filter/sort UI, thesis cards, thesis detail page, and responsive public layout.

## Phase 1: Project Contracts and Team Workflow

Status: Not Started

Tasks:

- Review the PRD sections for repository browsing, search, filtering, detail view, PDF access, and related theses.
- Review Homer's mock/API payload shapes before designing components around them.
- Identify public-page component needs: search bar, filters, sort control, thesis card, result list, detail sections, related thesis card, PDF access prompt.
- Note any UI data gaps before backend/database work begins.

Handoff:

- Give Homer any missing frontend data requirements.

## Phase 2: Supabase Foundation

Status: Not Started

Tasks:

- Use seed/mock data from Shane and Homer to validate public UI assumptions.
- Check whether seeded records include long titles, multiple authors, tags, recommendations, and lessons.
- Flag sample-data issues that make the UI hard to test.

Handoff:

- Give Shane and Homer sample-data requests for better public UI coverage.

## Phase 3: Auth and Role Enforcement

Status: Not Started

Tasks:

- Define public-page states for anonymous vs authenticated users.
- Ensure thesis detail PDF section can show login prompt, loading, error, and success states.
- Coordinate with Ethan so auth UI language and public PDF prompts feel consistent.

Handoff:

- Give Homer/Ethan any UI state requirements for auth-aware public pages.

## Phase 4: Public Repository Backend

Status: Not Started

Tasks:

- Review live or draft public API contract.
- Verify it contains every field needed by thesis cards and detail pages.
- Test frontend mock payloads against backend response shape.
- Report response-shape drift immediately.

Handoff:

- Confirm public frontend can proceed without contract blockers.

## Phase 5: Public Repository Frontend

Status: Not Started

Tasks:

- Build the main repository browse/search page as the first usable screen.
- Build thesis card components.
- Build search, filter, and sort controls.
- Build thesis detail page with metadata, abstract, authors, tags, adviser, department, research area, recommendations, lessons, related theses, and PDF access state.
- Add loading, empty, error, unauthorized, and responsive states.

Handoff:

- Give Homer a public frontend review checklist and any backend issues found during integration.

## Phase 6: Admin Backend Workflows

Status: Not Started

Tasks:

- Light support only: review admin payload naming for consistency with public components.
- Confirm public UI still hides draft and archived records after admin backend changes.

Handoff:

- Report public-regression risks to Homer and Ethan.

## Phase 7: Admin Frontend Workflows

Status: Not Started

Tasks:

- Help Ethan keep admin UI visually consistent with the public repository.
- Review admin layouts for readability, responsive behavior, and clear validation states.
- Help design reusable display components where public/admin overlap, such as tags, status labels, and thesis summaries.

Handoff:

- Give Ethan UI consistency feedback before Phase 8.

## Phase 8: Integration QA and Demo Polish

Status: Not Started

Tasks:

- QA public browse/search/detail on desktop and mobile.
- Verify long content does not overflow.
- Verify recommendations and lessons are readable and visually distinct.
- Polish empty, loading, error, and login-required states.

Handoff:

- Give Homer final public UI QA notes.
