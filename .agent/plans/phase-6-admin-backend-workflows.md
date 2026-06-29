# Phase 6: Admin Backend Workflows

**Phase Goal**: Implement backend workflows for draft creation, editing, PDF upload/replacement, publish validation, archive, and soft delete.

## Phase Metadata

**Phase Type**: Feature
**Estimated Complexity**: High
**Estimated Time**: 5-7 hours
**Prerequisites**: Phase 3, Phase 4
**Primary Systems Affected**: Backend integration, Database, Storage, Admin workflows
**Dependencies**: Auth role helpers, Supabase schema, storage bucket, RLS policies

## Feature Description

This phase gives Admins and Contributors a controlled way to maintain the repository. Homer leads endpoint and validation work. Shane verifies database operations and RLS. Ethan consumes these contracts for the admin dashboard/editor.

## User Impact

**User Story**:
As an admin, I want to create, edit, upload, validate, publish, and archive thesis records, so that the repository stays accurate and controlled.

**Value Delivered**:

- Records start as drafts.
- Incomplete records cannot be published.
- Archive/unpublish removes records from public discovery without hard deletion.
- PDF replacements retain old metadata.

## Context References

| Document | Sections | Why Read |
| --- | --- | --- |
| `.agent/project_specification.md` | Admin/Contributor Contracts, Required Publish Fields | Backend workflow requirements |
| `docs/Alexandria PRD.md` | Admin Publishing Workflow, Archive, PDF Replacement | Product behavior |
| `docs/database-engineer-reference.md` | Backend Contract Notes | DB/API boundary |

## Implementation Tasks

### Task 1: Implement Admin Thesis List

**Action**: Build `GET /api/admin/theses` with status filtering, search, pagination, and last-updated data.
**Files**: Admin route handler and query helper.
**Why**: Dashboard needs a manageable record list.
**Verification**: Admin/Contributor can see authorized draft, published, and archived records; students cannot.

### Task 2: Implement Draft Create and Update

**Action**: Build `POST /api/admin/theses` and `PATCH /api/admin/theses/:id` for metadata, authors, tags, recommendations, and lessons.
**Files**: Admin route handlers, validation helpers.
**Why**: Admin UI must maintain records without direct DB editing.
**Verification**: Drafts save nested data consistently.

### Task 3: Implement File Register and Replace

**Action**: Build file metadata registration and replacement logic after Supabase Storage upload.
**Files**: Admin file route handlers and storage helper.
**Why**: Actual PDFs live in storage, while metadata lives in the database.
**Verification**: Replacement marks new file primary and preserves old file metadata.

### Task 4: Implement Publish Validation

**Action**: Centralize validation for required publish fields.
**Files**: Recommended: `Alexandria/app/lib/theses/publish-validation.ts`
**Why**: UI and API should agree on what makes a thesis publishable.
**Verification**: Publish fails with structured errors when title, authors, year, adviser, department, research area, abstract, tags, primary PDF, recommendation, or lesson is missing.

### Task 5: Implement Archive and Soft Delete

**Action**: Build archive/unpublish route and internal soft-delete operation.
**Files**: Admin route handlers.
**Why**: Normal UI should avoid hard deletion.
**Verification**: Archived or soft-deleted records disappear from public endpoints.

## Exit Criteria

- [ ] Admin/Contributor endpoints enforce role checks.
- [ ] Draft create/update works with nested metadata.
- [ ] Publish validation blocks incomplete records.
- [ ] Archive/unpublish hides records publicly.
- [ ] PDF replacement preserves history.

## What You Will Learn

**Technical Skills**:

- Transaction-like nested update handling.
- Server-side validation and authorization.

**Conceptual Understanding**:

- Draft-to-publish data quality control.
- Recoverable administrative deletion.

**Tools and Patterns**:

- Centralized publish validation.
- Storage metadata synchronization.

## Notes and Gotchas

**Common Issues**:

- Do not let contributors manage roles.
- Do not hard delete records through ordinary UI routes.
- Do not publish when either recommendations or lessons are missing.

**Dependencies**:

- Role helpers from Phase 3.
- Storage and schema from Phase 2.
