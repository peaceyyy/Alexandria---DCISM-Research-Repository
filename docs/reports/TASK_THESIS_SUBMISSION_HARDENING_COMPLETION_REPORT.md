# Task THESIS-SUBMISSION-HARDENING Completion Report

## Task Context

- **Current Phase:** Thesis submission implementation hardening and contract alignment
- **Task ID:** `THESIS-SUBMISSION-HARDENING`
- **Build Status:** Partial — implementation and documentation are committed; verification is pending human approval
- **Tests Run:** None during this task. The repository review gate prohibited lint, type-checking, builds, unit tests, servers, and browser/E2E testing.

## Executive Summary

The thesis submission flow now sends metadata and one PDF as a single
`FormData` packet to an authenticated Next.js server action. The server
validates the packet, uploads the PDF to Supabase Storage, calls a transactional
Postgres RPC, and removes the uploaded object when the RPC reports failure.

The RPC derives submission ownership from `auth.uid()` rather than accepting an
owner identifier from the client. Publication date is required, the stored
`year` is derived from it, and future dates are rejected. Initial uploads accept
PDF only with a 10 MiB maximum.

Repository and API route names were separated:

- `/home` — public repository UI
- `/upload` — authenticated submission UI
- `submitThesis(FormData)` — current executable submission boundary
- `/api/theses` — reserved namespace for future HTTP Route Handlers

The API contracts, PRD, backend readiness material, database reference,
project specification, roadmap, plans, decision log, handoff, and validation
records were updated to match the implementation.

## Commits

| Commit | Description |
| --- | --- |
| `19b510dd` | `fix(styles): remove incompatible Tailwind v4 plugin directive` |
| `2883ae90` | `feat(database): add secure transactional thesis submission RPC` |
| `b7bbc006` | `feat(submission): implement validated single-packet thesis uploads` |
| `a03ee2b7` | `docs(contracts): align submission, storage, and API route contracts` |
| `45079a98` | `docs(validation): record thesis submission review and handoff` |
| `93c6226e` | `fix(routes): complete repository migration to /home` |

## Key Files

### Submission implementation

- `Alexandria/app/upload/page.tsx`
- `Alexandria/lib/services/submission-service.ts`
- `Alexandria/lib/services/types.ts`
- `Alexandria/lib/upload/file-validation.ts`
- `Alexandria/lib/upload/storage-helper.ts`
- `Alexandria/next.config.ts`
- `Alexandria/package.json`
- `Alexandria/package-lock.json`

### Database and storage setup

- `docs/submit_thesis_rpc.sql`
- `docs/configure_thesis_storage.sql`
- `docs/updated_db_fields.sql`

### Route migration

- `Alexandria/app/home/page.tsx`
- `Alexandria/lib/auth/auth-routing.ts`
- `Alexandria/lib/auth/auth-routing.test.ts`
- `Alexandria/components/layout/app-header.tsx`
- `Alexandria/components/layout/minimal-header.tsx`
- `Alexandria/components/admin/admin-sidebar.tsx`
- `Alexandria/components/profile/profile-page.tsx`

### Contracts and handoff material

- `docs/api-contracts.md`
- `docs/backend_functions.md`
- `docs/backend-readiness-plan.md`
- `docs/database-engineer-reference.md`
- `docs/design-decision-log.md`
- `docs/page_backend_mapping.md`
- `docs/Alexandria PRD.md`
- `.agent/project_specification.md`
- `.agent/roadmap.md`
- `.agent/knowledge/2026-07-02-thesis-submission-validation.md`
- `docs/handoffs/2026-07-02-upload-page-logic.md`

## Locked Decisions

1. Submission ownership is derived inside the RPC from `auth.uid()`.
   Client payloads cannot select or override `submitted_by_user_id`.
2. The upload page sends metadata and the PDF together to
   `submitThesis(FormData)`.
3. Authentication and server validation occur before the storage write.
4. An RPC failure triggers removal of the newly uploaded storage object.
5. `publication_date` is required and cannot exceed the current
   `Asia/Manila` calendar date.
6. The frontend does not collect `year`; the server derives it from
   `publication_date`.
7. The RPC requires the stored `year` to match the publication date's calendar
   year.
8. Initial submission accepts PDF only, with a maximum size of 10 MiB.
9. PDF validation checks extension, supplied MIME metadata, non-empty size,
   maximum size, and the `%PDF-` signature.
10. The Supabase `thesis_files_bucket` is the MVP file provider. Accepted thesis
    PDFs are public, while thesis DTOs expose `file_access.download_path`
    instead of raw storage URLs.
11. `/home` is the repository UI, `/upload` remains the submission UI, and
    `/api/theses` is reserved for future HTTP resources.
12. `POST /upload/theses` is not part of the current or future route contract.

## Integration Interface

### Current server action

```ts
submitThesis(submissionPacket: FormData): Promise<ServiceResult<{ id: number }>>
```

The packet requires:

- `payload` — serialized `SubmitThesisInput` JSON
- `file` — one PDF `File`

`SubmitThesisInput` excludes server-owned fields:

- `year`
- `file_url`
- `file_type`

The server derives or creates those fields before calling the RPC.

### Database RPC

```sql
public.submit_thesis_transaction(payload jsonb) returns int
```

Responsibilities:

- Resolve the owner from `auth.uid()`.
- Confirm the linked `public.users` profile exists.
- Validate publication date, derived year, and PDF metadata.
- Insert `theses`, `thesis_authors`, `thesis_tags`, and `thesis_files` in one
  database transaction.
- Create the thesis with `review_status = 'for_review'`.

Execution is revoked from `PUBLIC` and `anon`, then granted to
`authenticated`.

### Storage helpers

```ts
validateThesisPdf(file: File): Promise<string | null>
uploadThesisFileToStorage(file: File, userId: string): Promise<StoredThesisFile>
removeThesisFileFromStorage(filePath: string): Promise<string | null>
```

Storage object keys follow:

```text
uploads/{userId}/{randomUuid}/{safeFileName}
```

### Configuration

No new environment variables were added. Existing Supabase configuration is
still required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Next.js Server Actions allow an 11 MB request body so a 10 MiB PDF plus
multipart metadata can pass through. Application validation still enforces the
exact 10 MiB file limit.

### Dependencies

Added runtime dependencies:

- `react-hook-form`
- `@hookform/resolvers`
- `zod`

## Required Manual Integration

These SQL files have not been applied to the live Supabase project by this task:

1. Review and apply `docs/configure_thesis_storage.sql`.
2. Review and apply `docs/submit_thesis_rpc.sql`.
3. Confirm the bucket id is exactly `thesis_files_bucket`.
4. Confirm authenticated users can insert and delete objects under their
   permitted paths.
5. Confirm the storage DELETE policy permits compensating cleanup after an RPC
   failure.
6. Audit existing `theses.publication_date` values before changing the live
   column to `NOT NULL` or adding a matching-year database constraint.

The SQL files currently live under `docs/`; converting them into ordered
Supabase migrations remains a follow-up task.

## Validation Checklist

### Implemented through static review

- [x] RPC ownership comes from `auth.uid()`.
- [x] RPC execution is restricted to authenticated callers.
- [x] Submission metadata and file use one server-action packet.
- [x] Authentication occurs before storage upload.
- [x] Reported RPC failure attempts storage cleanup.
- [x] Publication date is required and future dates are rejected.
- [x] Stored year is server-derived from publication date.
- [x] PDF extension, MIME metadata, size, and signature are checked.
- [x] Initial PDF maximum is 10 MiB.
- [x] Repository UI route moved from `/theses` to `/home`.
- [x] Submission and storage contracts were reconciled with the implementation.

### Pending verification

- [ ] TypeScript compilation/build succeeds.
- [ ] ESLint succeeds.
- [ ] Unit tests pass.
- [ ] Auth-routing test passes with `/home`.
- [ ] Live Supabase RPC accepts a valid authenticated submission.
- [ ] Anonymous RPC invocation is rejected.
- [ ] A forged `submitted_by_user_id` is ignored.
- [ ] Forced RPC failure removes the uploaded storage object.
- [ ] Valid PDFs at or below 10 MiB are accepted.
- [ ] Empty, oversized, renamed non-PDF, and invalid-signature files are rejected.
- [ ] Missing and future publication dates are rejected.
- [ ] Browser/E2E submission flow is verified separately.

## Testing Instructions

Do not run these until the user explicitly says:

```text
Human review approved; run verification.
```

From `Alexandria/`:

```powershell
npm.cmd run lint
npm.cmd run test:run
npm.cmd run build
```

Expected result:

- Each command exits with code `0`.
- Vitest reports no failing tests.
- Next.js completes a production build without TypeScript or route errors.

After the SQL is applied to the intended Supabase environment, verify:

1. Submit a valid PDF smaller than 10 MiB while authenticated.
   - Expected: one storage object, one `for_review` thesis, related author/tag
     rows, and one primary `thesis_files` row.
2. Invoke the RPC anonymously.
   - Expected: permission/authentication failure and no rows created.
3. Include a forged `submitted_by_user_id` in a direct authenticated RPC call.
   - Expected: stored ownership still equals `auth.uid()`.
4. Force the RPC to reject the metadata after storage upload.
   - Expected: the uploaded object is removed; cleanup errors, if any, are
     returned in `error.details.storage_cleanup_error`.
5. Try an empty file, an oversized PDF, a renamed non-PDF, and a file without
   the `%PDF-` signature.
   - Expected: `VALIDATION_FAILED` before storage.
6. Try a missing or future publication date.
   - Expected: client/server validation failure and no storage or database
     writes.

Browser automation or Playwright requires separate explicit E2E approval.

## Known Limitations and Remaining Risks

The following smaller risks were intentionally left for later sequential work:

1. Change the form's `contribution_role` validation from a general string to
   the `"author" | "adviser"` enum.
2. Require at least one person whose role is actually `author`, not merely one
   person row.
3. Normalize author/adviser `sort_order` values before submission.
4. Reconcile and harden `registerThesisFile()` authorization, MIME persistence,
   and transactional primary-file replacement.
5. Add the partial unique index that guarantees one primary file per thesis.
6. Convert SQL documentation scripts into tracked Supabase migrations.
7. Implement the future `GET /api/theses/:id/file` route.
8. Audit existing nullable or mismatched publication dates before applying
   stronger live schema constraints.

A server crash in the narrow interval between storage upload and RPC execution
can still leave an orphaned object. This was accepted as an MVP-scale risk.

## Handoff

The major submission risks identified during validation have been corrected in
code and documentation but are not yet verified. The next agent should not
begin styling or additional submission features until:

1. Human review is approved.
2. Static/unit verification passes.
3. The SQL scripts are reviewed and applied to the intended Supabase project.
4. The authenticated submission flow and cleanup behavior are manually
   confirmed.

After that gate, address the remaining risks one at a time, starting with the
author/adviser enum and actual-author requirement.
