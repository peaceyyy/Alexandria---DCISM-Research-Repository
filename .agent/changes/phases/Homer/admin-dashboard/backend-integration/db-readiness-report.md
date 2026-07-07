# Admin Dashboard Database Readiness

Status: Drafted for human review; not applied  
Artifact: `docs/sql/admin_dashboard_backend.sql`

## What The SQL Adds

- Reversible account-state columns and supporting indexes.
- Active-account and role helper checks.
- A frontend-safe dashboard snapshot RPC.
- Guarded role, deactivate, and reactivate RPCs.
- Least-privilege grants plus active-account read policies.
- Private, owner-scoped Storage upload/delete policies and bucket limits.
- A secured thesis-submission RPC that derives the submitter from `auth.uid()`.
- Canonical `thesis_files.storage_path` with checked legacy-URL backfill.
- Nullable USC IDs and a hardened auth-profile trigger.

## Inspected Live State

- RLS is enabled on all relevant public tables and `storage.objects`.
- Only the authenticated self-profile policy exists on public tables.
- Storage previously allowed bucket-wide authenticated inserts and public reads.
- The original `SECURITY DEFINER` submission RPC accepted payload ownership and
  was executable by `anon`; anonymous execution has been revoked manually.
- The private bucket has no MIME or size limit before this migration.
- Live data contains four users, three theses, one file row, one ownerless
  thesis, and eight Storage objects. Existing rows and objects are preserved.
- The single file row stores a public-style URL; the migration extracts and
  validates its matching object path before committing.

## Deployment Order

1. Add `SUPABASE_SERVICE_ROLE_KEY` to the Next.js server environment only.
2. Review and apply `admin_dashboard_backend.sql` once.
3. Deploy the matching application code.
4. Verify active/deactivated service behavior, submission, preview, download,
   PostgREST denial, and Storage cleanup.
5. Review the seven likely orphan Storage objects separately; do not delete them
   as part of this migration.

All five steps remain behind the human review and verification gates.
