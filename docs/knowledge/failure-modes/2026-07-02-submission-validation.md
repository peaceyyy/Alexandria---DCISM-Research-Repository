# Failure Mode: Thesis Submission Validation (2026-07-02)

> Historical snapshot: this file records the pre-correction implementation.
> The initial submission path now uses a transactional RPC and a single
> authenticated `FormData` packet with compensating storage cleanup. Remaining
> risks are tracked in `.agent/knowledge/2026-07-02-thesis-submission-validation.md`.

## Context
Validating the MVP implementation of `Alexandria/lib/services/submission-service.ts` and `Alexandria/app/upload/page.tsx` against the `docs/api-contracts.md` and `docs/backend_functions.md`.

## Failure Modes Identified

1. **Compilation Failure (Zod/React Hook Form)**:
   - **Issue**: `npm run build` fails with a type error on `zodResolver(formSchema)`.
   - **Root Cause**: The `z.coerce.number()` on the `year` field in `formSchema` produces a type incompatibility (`year: unknown` vs `year: number`) with `react-hook-form`'s `Resolver`.

2. **Data Integrity / Missing Transactions**:
   - **Issue**: `submitThesis` inserts data into `theses`, `thesis_authors`, and `thesis_tags` sequentially without a transaction block. `updateOwnSubmission` deletes and recreates authors and tags sequentially. 
   - **Root Cause**: The Supabase JS client (`@supabase/supabase-js`) does not support client-side transactions for multiple table inserts. If the `thesis_authors` or `thesis_tags` insertion fails, a partial/orphaned thesis record remains.

3. **Two-Step Submission Flow**:
   - **Issue**: `upload/page.tsx` submits the thesis record to the database first, and *then* uploads the file to storage.
   - **Root Cause**: If the file upload fails, the thesis is left in a `for_review` state without a primary file, which violates the requirement for acceptance and requires the user to "retry from dashboard" (a feature that may not exist, risking scope creep).

4. **Type Spec Contradiction**:
   - **Issue**: `SubmitThesisPayload` defines `authors: ThesisAuthor[]`. `ThesisAuthor` requires an `id` field. However, new thesis submissions do not have an `id` for authors yet.
   - **Root Cause**: The backend blueprint mistakenly uses `ThesisAuthor[]` instead of `ThesisAuthorInput[]` (which omits `id`) for the POST payload.

5. **Test-First Violation**:
   - **Issue**: No unit tests or integration tests exist for the submission flow, violating the Constitution's "Test-First" principle.

## Prevention
- Ensure Zod coercion types are strictly aligned with interface types, or cast appropriately.
- Use Supabase RPC (Remote Procedure Call) functions when inserting into multiple tables to enforce transactions and maintain data integrity.
- File uploads should ideally generate a pre-signed URL or happen *before* the thesis row is finalized, or handled in a single atomic flow to prevent orphaned records.
- Fix API contracts so `SubmitThesisPayload` uses `ThesisAuthorInput[]`.
- Write tests alongside feature implementation.
