> [!TIP]
> **Plan Status: HUMAN REVIEW** — implementation is drafted in the isolated worktree. No migration or verification command has been run.

# Admin Dashboard Backend Integration

## Goal

Replace the `/admin` mock data with guarded Supabase reads, role changes, and reversible account deactivation while preserving the completed frontend and the hardened thesis-submission flow.

## Frozen Choices

- **Dashboard metrics (Option A):** total research and department counts use every non-trashed thesis; registered users counts active accounts across all roles; pending docs means `for_review`.
- **Department expansion:** group by `theses.department`; `DCISM` appears now and future departments appear without a contract change.
- **Recent activity:** audit-only from `thesis_audits`; do not synthesize events that lack an audit row.
- **Account lifecycle:** admins may deactivate/reactivate member or moderator accounts. Preserve Supabase Auth and `public.users`; hard deletion and browser-exposed Auth Admin credentials remain out of scope.
- **PDF access:** keep Storage private. Accepted PDFs may be embedded inline for guests; active members may explicitly download them. Private object access is mediated by a server route with a server-only service-role client.
- **Storage migration:** `thesis_files.storage_path` becomes canonical. Preserve nullable `file_url` temporarily for rollback and migrate the existing row without deleting users, theses, or Storage objects.

## Current Baseline

- Public repository navigation now uses `/home`, not `/theses`.
- `submitThesis(FormData)` now authenticates through `requireSession()`, validates one PDF, uploads to Supabase Storage, and calls `submit_thesis_transaction`; dashboard work must not rewrite this pipeline.
- `auth-contract.ts` already re-exports canonical service contracts; no duplicate-contract consolidation task remains.
- Admin pages and co-located `app/admin/_components/DataTable` remain mock-backed; `admin-dashboard-service.ts` and `user-service.ts` still do not exist.
- Current SQL references live under `docs/sql/`, but repository SQL still cannot prove the deployed RLS, deactivation, Storage-policy, or RPC posture.
- The current `docs/sql/submit_thesis_transaction.sql` trusts payload ownership despite the canonical `auth.uid()` contract; database readiness must restore the secured definition before deployment.
- Next.js 16.2.9 uses `proxy.ts`, but no proxy currently refreshes Supabase SSR sessions.

## Tasks

- [x] 1. Freeze metric, activity, DTO, role-transition, and reversible-deactivation semantics in `.agent/changes/phases/Homer/admin-dashboard/backend-integration/contract-freeze.md`.
- [x] 2. Reconcile the plan against current routes, auth flow, submission RPC/Storage flow, canonical types, docs, and working-tree changes in `current-codebase-audit.md`.
- [ ] 3. Reconcile the inspected live Supabase schema and prepare reviewed SQL for deactivation fields, storage paths, guarded RPCs, least-privilege policies/grants, bucket constraints, and active-account checks without applying it. → Verify after approval: direct PostgREST, Storage, and `SECURITY DEFINER` callers cannot bypass authorization.
- [ ] 4. Align `types.ts`, `api-contracts.md`, `backend_functions.md`, `backend-readiness-plan.md`, and the database reference with dashboard/account DTOs, `DbThesisAudit.updated_at`, deactivation functions, and `/home`. → Verify: executable types and canonical docs tell one story.
- [ ] 5. Add the Next.js 16 `proxy.ts` refresh path, memoize the active principal, add a server-only Supabase admin client, and enforce PDF preview/download authorization through `/api/theses/:id/file`. → Verify after approval: layouts, actions, submissions, and file access share the active-user boundary.
- [ ] 6. Implement guarded `admin-dashboard-service.ts`, `user-service.ts`, and Server Actions for role changes plus deactivate/reactivate; revalidate all three admin routes after successful writes. → Verify: services use `ServiceResult`, explicit column selection, stable ordering, and no raw privileged fields.
- [ ] 7. Convert `/admin/dashboard` to server-owned loading and pass one serializable snapshot into its client view. → Verify: metrics, recent uploads, audit activity, and department counts have no runtime mock dependency.
- [ ] 8. Bind unified `/admin/users` role tabs to server pagination, preserve `/admin/members` and `/admin/moderators` as redirects, show account status, and keep administrator rows read-only. → Verify: real members, moderators, and administrators load from Supabase; hard-delete/add-account/admin-mutation controls are absent.
- [ ] 9. Write focused adjacent tests without executing them, then stop and present every changed file for human review. Only `Human review approved; run verification.` unlocks non-browser checks; E2E/browser work requires separate approval.

## Done When

- [ ] Live data replaces mocks on all three admin pages with loading, empty, and error states.
- [ ] Role and status changes persist to `public.users` and re-render after route revalidation.
- [ ] Deactivated users are denied by service guards, RLS, privileged RPCs, and Storage policies until reactivated.
- [ ] `/home`, the transactional submission pipeline, and current auth contract ownership remain intact.
- [ ] Human review and the separate verification/E2E gates are respected.

## Execution

Use `.agent/changes/phases/Homer/admin-dashboard/backend-integration/breakdown.yaml` as the coding-agent orchestrator and `current-codebase-audit.md` as its baseline. Re-run a read-only status/diff audit immediately before implementation because unrelated work may continue to land.
