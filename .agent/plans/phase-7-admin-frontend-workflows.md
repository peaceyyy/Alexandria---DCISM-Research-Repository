# Phase 7: Admin Frontend Workflows

**Phase Goal**: Build the admin dashboard and editor screens for maintaining thesis records.

## Phase Metadata

**Phase Type**: Feature
**Estimated Complexity**: High
**Estimated Time**: 5-7 hours
**Prerequisites**: Phase 3, Phase 6 contract draft
**Primary Systems Affected**: Frontend, Admin UX, Auth-aware UI
**Dependencies**: Admin backend contracts, auth role helpers, file upload strategy

## Feature Description

This is Ethan's primary build, with Leira helping maintain visual consistency and Homer owning backend contract alignment. Admin screens should be efficient and work-focused: list records, edit metadata, manage ordered items, upload/replace PDFs, validate readiness, publish, and archive.

## User Impact

**User Story**:
As an admin or contributor, I want a clear dashboard and editor, so that I can maintain repository records without touching the database directly.

**Value Delivered**:

- Admins can prepare complete records.
- Contributors can help maintain content.
- Publish readiness is visible before attempting publish.

## Context References

| Document | Sections | Why Read |
| --- | --- | --- |
| `.agent/project_specification.md` | Admin Pages, Admin Contracts, UI States | Admin scope |
| `docs/Alexandria PRD.md` | Admin Publishing Workflow | Required workflow |
| `frontend/AGENTS.md` | All | Next.js version warning before coding |

## Implementation Tasks

### Task 1: Build Admin Dashboard

**Action**: Build a protected dashboard with thesis list, status tabs/filters, search, and quick actions.
**Files**: Admin route and components under `frontend/app`.
**Why**: Admins need a control center for repository records.
**Verification**: Admin/Contributor sees records by status; Student visitor is denied.

### Task 2: Build Thesis Editor

**Action**: Build create/edit form for title, year, adviser, department, research area, abstract, authors, tags, links, recommendations, and lessons.
**Files**: Editor route and components.
**Why**: Thesis metadata is manually entered and required before publish.
**Verification**: Ordered authors, recommendations, and lessons can be added, reordered if supported, edited, and removed.

### Task 3: Build PDF Upload and Replacement Panel

**Action**: Add file selection/upload UI, current file display, replacement action, and upload errors.
**Files**: Editor file panel.
**Why**: Admin workflow requires PDF upload plus metadata entry.
**Verification**: Upload/replacement calls backend contract and updates current primary file state.

### Task 4: Build Publish Readiness UI

**Action**: Display missing required fields and block publish until backend validation passes.
**Files**: Editor publish panel.
**Why**: Admins should see why a draft is not publishable.
**Verification**: Missing recommendations and missing lessons are shown separately.

### Task 5: Build Archive/Unpublish UI

**Action**: Add archive action with confirmation and post-action state update.
**Files**: Dashboard/editor actions.
**Why**: Normal removal should be archive/unpublish.
**Verification**: Archived record leaves public repository after action.

## Exit Criteria

- [ ] Admin dashboard is protected and usable.
- [ ] Thesis editor supports required metadata.
- [ ] PDF upload/replacement UI works with backend.
- [ ] Publish readiness is clear.
- [ ] Archive/unpublish flow is implemented.

## What You Will Learn

**Technical Skills**:

- Protected admin UI in Next.js.
- Complex form state and nested ordered data.

**Conceptual Understanding**:

- Editorial workflow design.
- Validation-driven publishing.

**Tools and Patterns**:

- Role-aware rendering.
- Form-level and server-level validation display.

## Notes and Gotchas

**Common Issues**:

- Admin UI should be compact and operational, not a marketing layout.
- Do not let the frontend decide publish success alone; backend validation remains final.
- Keep recommendations and lessons distinct in labels and validation.

**Dependencies**:

- Admin backend contracts from Phase 6.
- Auth routes from Phase 3.
