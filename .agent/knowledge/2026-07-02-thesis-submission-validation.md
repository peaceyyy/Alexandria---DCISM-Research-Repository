# Thesis Submission Validation Failure — 2026-07-02

## Verdict

Original verdict: FAIL — static review found blocking integrity, authorization,
and contract discrepancies.

Current status: the five blocking findings were corrected sequentially and are
awaiting approved verification. Additional concrete risks below remain open.
Verification commands were not run because the repository's human review gate
forbids tests, lint, type-checking, builds, servers, and browser automation
until explicitly approved.

## Resolution Tracking

The five blocking failure modes below were addressed sequentially on
2026-07-02 and are awaiting approved verification. Remaining items under
"Additional Concrete Risks" have not all been addressed.

## Blocking Failure Modes (Original Findings)

1. `submit_thesis_transaction(jsonb)` is `SECURITY DEFINER` but trusts
   `payload.submitted_by_user_id`. The repository script does not derive the
   owner from `auth.uid()`, pin `search_path`, qualify table names, or show
   `REVOKE`/`GRANT` statements. A direct RPC caller may be able to bypass the
   service-layer owner assignment unless the live database has compensating
   privileges not represented in this repository.
2. The browser uploads the file before the server action authenticates and
   commits metadata. If authentication or the RPC fails, the storage object is
   orphaned. The helper returns only a public URL, so the failure path does not
   retain the object key needed for cleanup.
3. Date integrity is frontend-only and incomplete. `year` is limited to the
   arbitrary fixed range 2000–2030, while the RPC and schema accept any integer.
   `publication_date` has no documented relationship to `year` and no
   current/future-date rule. Contract examples currently pair `year: 2026` with
   `publication_date: 2025-05-14`, so the intended semantics are unclear.
4. The upload form accepts PDF, DOC, DOCX, and ZIP files and displays a 50 MB
   limit without enforcing it. The acceptance contract requires a primary PDF,
   but the current flow can register a non-PDF as the primary file.
5. The implemented payload and documented payload disagree. Runtime
   `SubmitThesisPayload` requires `file_url` and accepts `file_type`; the
   `POST /upload/theses` example omits both. The backend blueprint still uses
   `ThesisAuthor[]` instead of `ThesisAuthorInput[]` and omits the file fields.
   Page mappings still describe a separate `registerThesisFile()` call, while
   the upload page now sends file metadata through `submitThesis()`.

## Additional Concrete Risks

- `contribution_role` is inferred as a general string in the form schema but is
  a `"author" | "adviser"` union in the canonical service contract. Under the
  strict TypeScript configuration this is a static compatibility risk.
- The form requires one person, not one row whose role is `author`; an
  adviser-only submission passes the client/service count checks.
- Removing and adding people can leave duplicate or stale `sort_order` values.
- `registerThesisFile()` no longer persists `file_type`, rejects
  admin/moderator registration for theses they do not own despite the endpoint
  contract, and clears the current primary before a non-transactional insert.
- The required one-primary-file partial unique index is documented but is not
  present in the repository SQL.
- The RPC exists only as a documentation SQL script, not a tracked migration;
  repository state therefore cannot prove that the live function matches the
  application call.
- No `app/**/route.ts` implements the documented HTTP routes. The actual flow is
  browser Supabase Storage call → Next server action → Supabase RPC. The API
  contract does say route names may be intent-only, but the submission section
  does not document this actual handoff.

## Documentation Drift

- `docs/knowledge/failure-modes/2026-07-02-submission-validation.md` describes
  the old sequential inserts and database-first upload order, both of which
  have already changed.
- `docs/handoffs/2026-07-02-upload-page-logic.md` points to the wrong storage
  helper path and describes a three-step flow that does not match the current
  implementation.
- Storage documentation alternates between Supabase Storage and school-server
  URLs. The implementation uses a Supabase bucket and stores `getPublicUrl()`.
- `docs/updated_db_fields.sql` contains `publication_link text,nt`, so the
  claimed schema snapshot is not executable as written.

## Required Correction Order

1. Secure and deploy the RPC as a real migration: derive ownership from
   `auth.uid()`, constrain execution privileges, pin `search_path`, qualify
   tables, validate payload fields, and use `bigint` for the returned identity.
2. Make storage handoff recoverable and authenticated before upload; retain the
   bucket/object path and delete the object when metadata commit fails.
3. Freeze date semantics and enforce the same rules in form validation, RPC,
   and database constraints.
4. Enforce PDF MIME/extension and the real size limit before upload and in the
   server-side boundary.
5. Reconcile `types.ts`, API contracts, backend function blueprint, page map,
   handoff, and failure-mode documentation with the implemented one-call
   submission flow.
