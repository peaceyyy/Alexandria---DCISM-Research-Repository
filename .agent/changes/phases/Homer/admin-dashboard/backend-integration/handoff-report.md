# Admin Dashboard Backend Integration Handoff

Status: Human review required  
Worktree: `C:\tmp\alexandria-admin-dashboard`  
Branch: `codex/admin-dashboard-backend`

## Implemented Draft

- Live dashboard snapshot service and `/admin/dashboard` binding.
- Paginated member/moderator services, pages, role transitions, and reversible
  account status actions.
- Unified Supabase-backed User Management tabs for members, moderators, and
  read-only protected administrator accounts.
- Supabase SSR `proxy.ts`, request-memoized active principal, deactivation
  rejection, login notice, and session clearing.
- Option A submission ownership: the RPC derives the actor from `auth.uid()`;
  authors remain display-name-first with optional account links.
- Reviewable SQL for account fields, guarded RPCs, RLS, Storage restrictions,
  accepted-metadata guest reads, indexes, and the secured submission transaction.
- Canonical DTO and documentation updates.

## Changed Application Files

- `Alexandria/proxy.ts`
- `Alexandria/app/api/theses/[id]/file/route.ts`
- `Alexandria/lib/supabase/admin.ts`
- `Alexandria/lib/supabase/proxy.ts`
- `Alexandria/lib/supabase/server.ts`
- `Alexandria/lib/services/types.ts`
- `Alexandria/lib/services/result.ts`
- `Alexandria/lib/services/_guards.ts`
- `Alexandria/lib/services/auth-service.ts`
- `Alexandria/lib/services/admin-dashboard-service.ts`
- `Alexandria/lib/services/user-service.ts`
- `Alexandria/lib/services/submission-service.ts`
- `Alexandria/lib/upload/storage-helper.ts`
- `Alexandria/lib/auth/actions.ts`
- `Alexandria/lib/auth/auth-gateway.ts`
- `Alexandria/lib/auth/auth-routing.ts`
- `Alexandria/lib/auth/mock-auth-gateway.ts`
- `Alexandria/app/(auth)/login/page.tsx`
- `Alexandria/app/(auth)/_components/login-form.tsx`
- `Alexandria/app/profile/page.tsx`
- `Alexandria/app/admin/actions.ts`
- `Alexandria/app/admin/loading.tsx`
- `Alexandria/app/admin/layout.tsx`
- `Alexandria/app/admin/dashboard/page.tsx`
- `Alexandria/app/admin/members/layout.tsx`
- `Alexandria/app/admin/members/page.tsx`
- `Alexandria/app/admin/moderators/layout.tsx`
- `Alexandria/app/admin/moderators/page.tsx`
- `Alexandria/app/admin/users/layout.tsx`
- `Alexandria/app/admin/users/page.tsx`
- `Alexandria/app/admin/_components/admin-sidebar.tsx`
- `Alexandria/app/admin/_components/admin-dashboard-view.tsx`
- `Alexandria/app/admin/_components/admin-data-state.tsx`
- `Alexandria/app/admin/_components/data-table.tsx`
- `Alexandria/app/admin/_components/mock-data.ts` (removed)
- `Alexandria/app/admin/_components/members-management-view.tsx`
- `Alexandria/app/admin/_components/moderators-management-view.tsx`
- `Alexandria/app/admin/_components/user-management-view.tsx`
- `Alexandria/app/admin/_components/status-badge.tsx`
- `Alexandria/app/admin/_components/status-badge.module.css`
- `Alexandria/app/admin/_components/row-actions.module.css`

## Tests Written Or Changed

- `Alexandria/lib/auth/auth-routing.test.ts`
- `Alexandria/lib/services/_guards.test.ts`
- `Alexandria/lib/services/admin-dashboard-service.test.ts`
- `Alexandria/lib/services/user-service.test.ts`
- `Alexandria/app/api/theses/[id]/file/route.test.ts`

## SQL And Documentation

- `docs/sql/admin_dashboard_backend.sql`
- `docs/sql/submit_thesis_transaction.sql`
- `docs/sql/updated_db_fields.sql`
- `docs/api-contracts.md`
- `docs/backend_functions.md`
- `docs/backend-readiness-plan.md`
- `docs/database-engineer-reference.md`
- `docs/design-decision-log.md`
- `admin-dashboard-backend-integration.md`
- `.agent/changes/phases/Homer/admin-dashboard/backend-integration/breakdown.yaml`
- `.agent/changes/phases/Homer/admin-dashboard/backend-integration/contract-freeze.md`
- `.agent/changes/phases/Homer/admin-dashboard/backend-integration/current-codebase-audit.md`
- `.agent/changes/phases/Homer/admin-dashboard/backend-integration/db-readiness-report.md`
- `.agent/changes/phases/Homer/admin-dashboard/backend-integration/handoff-report.md`

## Review Risks

1. The inspected live Supabase state has been reconciled into the SQL, but the
   migration is not applied. Its path backfill intentionally aborts if the
   existing file URL does not map to a real Storage object.
2. The account-state and storage-path columns must be deployed before the updated principal and
   user services can query them.
3. `submission-service.ts` has a deliberately small overlap with the separate
   submission-page work: it removes client-shaped ownership and debug logging
   only. Reconcile that file carefully when merging.
4. `SUPABASE_SERVICE_ROLE_KEY` is required in the server environment for the
   guarded PDF route and must never use a `NEXT_PUBLIC_*` name.
5. Seven likely orphan Storage objects remain intentionally untouched.
6. Runtime, type, lint, build, migration, and browser behavior remain
   unverified until explicitly approved.

## Verification Record

- Focused backend tests passed before the final test-only narrowing correction:
  5 files and 14 tests.
- The complete Vitest suite passed before that correction: 7 files and 21 tests.
- The production build passed, including application TypeScript and generation
  of `/api/theses/[id]/file`.
- Standalone TypeScript found one missing `ServiceResult` narrowing assertion in
  `user-service.test.ts`. That test-only correction is written but not rerun
  because any code change resets the human-review gate.
- Full lint remains blocked by existing baseline issues. The integration
  worktree reported 13 errors and 2 warnings; the untouched main checkout
  reported 14 errors and 6 warnings, including every file still failing in the
  worktree.
- The unified User Management tabs, administrator listing/count tests, route
  redirects, and mock-data removal were added after those checks and have not
  been verified under the renewed human-review gate.
- No E2E test, browser automation, smoke test, or development server was run.
