# Admin Dashboard Backend Integration Completion Report

## Task Context

- **Current Phase:** Admin dashboard backend integration and Supabase live-data wiring
- **Primary Scope:** Replace static admin-dashboard placeholders with live Supabase-backed reads and mutations
- **Build Status:** Partial — implementation and SQL artifacts are in the repo; final verification is pending the human review gate
- **Tests Run in Final Integration Pass:** None. The active `AGENTS.md` gate prohibits tests, lint, type-check, builds, servers, and browser/E2E until explicitly approved.
- **Supabase SQL Status:** `docs/sql/admin_dashboard_backend.sql` was reported by the user as successfully applied. The later role-update hotfix file still needs to be applied in Supabase.

## Executive Summary

The admin dashboard frontend has been connected to live Supabase-backed service
logic. The old placeholder-driven dashboard and mock moderators table were
replaced with server-side data loading, guarded admin/moderator access, and
administrator-only user management.

The work also added the database/RLS/function layer needed for dashboard
metrics, active-account enforcement, reversible account deactivation, private
Storage-backed thesis file access, and transactional submission hardening.

During live role-management debugging, we found a PostgreSQL naming collision:
the `admin_update_user_role` function used a PL/pgSQL variable named
`current_role`, which can collide with PostgreSQL's special `CURRENT_ROLE`
identifier. That made a valid `member -> moderator` update appear to the
function as an invalid transition. A focused hotfix now renames the variable to
`target_current_role`.

## Major Outcomes

### 1. Admin dashboard now uses live backend data

- Dashboard metrics are loaded from Supabase through service-layer calls.
- Recent uploads are derived from real `theses` and `thesis_authors` data.
- Recent activity is derived from `thesis_audits`.
- Department counts use `theses.department` and exclude trashed records.
- The old admin mock-data dependency was removed.

### 2. Unified user management replaced separate placeholder pages

- Added the unified `/admin/users` experience.
- Replaced separate `Members` and `Moderators` sidebar entries with `User Management`.
- Added role tabs for:
  - Members
  - Moderators
  - Administrators
- Admin accounts are visible for transparency but protected from dashboard mutation.
- Existing `/admin/members` and `/admin/moderators` routes now redirect into `/admin/users`.

### 3. Account lifecycle was implemented

- Added reversible account deactivation fields:
  - `users.deactivated_at`
  - `users.deactivation_reason`
  - `users.deactivated_by_user_id`
- Added active-account enforcement in auth/service guards.
- Added user-management actions for:
  - Promote member to moderator
  - Demote moderator to member
  - Deactivate account
  - Reactivate account
- Deactivated users are blocked from authenticated flows while preserving their profile and thesis credit.

### 4. Supabase SQL/RLS was hardened

- Added dashboard/account-management RPCs:
  - `get_admin_dashboard_snapshot()`
  - `admin_update_user_role(uuid, text)`
  - `admin_deactivate_user(uuid, text)`
  - `admin_reactivate_user(uuid)`
- Added active-account helper:
  - `current_user_is_active(text[])`
- Preserved RLS as the public-table boundary.
- Added least-privilege grants for browser roles.
- Restricted account mutation RPCs to authenticated users, with admin checks inside the functions.

### 5. Thesis file access was aligned with private Supabase Storage

- Added `thesis_files.storage_path`.
- Kept `thesis_files.file_url` temporarily for legacy compatibility.
- Private bucket behavior is now the target contract.
- Members can download through authenticated server-side routes.
- Guests can preview embedded accepted PDFs but should not receive raw private storage paths.

### 6. Submission flow remained compatible with admin/dashboard work

- The dashboard integration preserves the earlier thesis submission model:
  - Supabase Auth remains the identity source.
  - `theses.submitted_by_user_id` is nullable for admin-assisted or legacy/imported submissions.
  - `thesis_authors.user_id` remains nullable because not all authors have Alexandria accounts.
  - `thesis_authors.display_name` remains the required fallback for author display/networking.

## Live Supabase Debugging Notes

### What failed

Clicking a role-change action logged:

```txt
[admin:user-management] Supabase mutation failed {
  code: '22023',
  message: 'That role transition is not allowed'
}
```

The request itself was reaching the server action:

```txt
changeUserRoleAction(
  "1214249d-b0f9-4e28-920c-6d641a42c784",
  "moderator"
)
```

### What we confirmed

- Supabase was reachable from the local environment.
- `SUPABASE_SERVICE_ROLE_KEY` was present in `.env`.
- The target user row existed.
- The target user role was exactly `member`, with no whitespace or capitalization issue.
- The deployed function contained the expected `current_role = new_role` no-op check.
- The RPC existed and was callable through PostgREST.

### Root cause

The SQL function used this variable:

```sql
current_role text;
```

`CURRENT_ROLE` is also a PostgreSQL special identifier. Inside the PL/pgSQL
checks, that ambiguity caused the function to evaluate the active database role
instead of the selected user's role in the transition guard.

### Fix

The function variable was renamed:

```sql
target_current_role text;
```

The full migration script was updated, and a focused hotfix was added:

- `docs/sql/admin_dashboard_backend.sql`
- `docs/sql/admin_update_user_role_hotfix.sql`

## Key Files

### Admin app routes and views

- `Alexandria/app/admin/dashboard/page.tsx`
- `Alexandria/app/admin/users/page.tsx`
- `Alexandria/app/admin/users/layout.tsx`
- `Alexandria/app/admin/members/page.tsx`
- `Alexandria/app/admin/moderators/page.tsx`
- `Alexandria/app/admin/actions.ts`
- `Alexandria/app/admin/loading.tsx`

### Admin components

- `Alexandria/app/admin/_components/admin-dashboard-view.tsx`
- `Alexandria/app/admin/_components/admin-data-state.tsx`
- `Alexandria/app/admin/_components/user-management-view.tsx`
- `Alexandria/app/admin/_components/admin-sidebar.tsx`
- `Alexandria/app/admin/_components/data-table.tsx`
- `Alexandria/app/admin/_components/status-badge.tsx`
- `Alexandria/app/admin/_components/status-badge.module.css`
- `Alexandria/app/admin/_components/row-actions.module.css`

### Services and Supabase helpers

- `Alexandria/lib/services/admin-dashboard-service.ts`
- `Alexandria/lib/services/user-service.ts`
- `Alexandria/lib/services/auth-service.ts`
- `Alexandria/lib/services/_guards.ts`
- `Alexandria/lib/services/result.ts`
- `Alexandria/lib/services/types.ts`
- `Alexandria/lib/supabase/server.ts`
- `Alexandria/lib/supabase/admin.ts`
- `Alexandria/lib/supabase/proxy.ts`
- `Alexandria/proxy.ts`

### File access and submission-adjacent work

- `Alexandria/app/api/theses/[id]/file/route.ts`
- `Alexandria/lib/services/submission-service.ts`
- `Alexandria/lib/upload/storage-helper.ts`

### Tests written, not run in the final gated pass

- `Alexandria/lib/services/admin-dashboard-service.test.ts`
- `Alexandria/lib/services/user-service.test.ts`
- `Alexandria/lib/services/_guards.test.ts`
- `Alexandria/app/api/theses/[id]/file/route.test.ts`

### SQL and documentation

- `docs/sql/admin_dashboard_backend.sql`
- `docs/sql/admin_update_user_role_hotfix.sql`
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

## SQL To Run in Supabase

The main dashboard migration was already reported as applied successfully:

```txt
docs/sql/admin_dashboard_backend.sql
```

The role-update bug fix still needs to be applied:

```txt
docs/sql/admin_update_user_role_hotfix.sql
```

After applying the hotfix, test one member-to-moderator promotion and one
moderator-to-member demotion from the UI.

## Verification History

Earlier in the implementation stream, after explicit human approval, these
non-browser checks were run against the then-current worktree:

- Focused backend Vitest files passed.
- Full Vitest suite passed.
- Production build passed.
- Lint failed due pre-existing/baseline issues outside the final admin-dashboard delta.

Important caveat: additional user-management integration and the SQL hotfix
were added after that verification pass. Therefore the current active checkout
must still be treated as **verification pending**.

## Pending Human-Gated Verification

Run only after the explicit instruction:

```txt
Human review approved; run verification.
```

Recommended non-browser verification:

1. Run the focused admin/user service tests.
2. Run the full Vitest suite.
3. Run the production build.
4. Re-check lint and distinguish baseline issues from new regressions.

Browser/E2E testing still requires separate explicit approval.

## Manual User Tests Recommended

After applying `docs/sql/admin_update_user_role_hotfix.sql` and restarting the
dev server:

1. Log in as an administrator.
2. Open `/admin/dashboard`.
3. Confirm dashboard metrics load from real Supabase data.
4. Open `/admin/users?role=member`.
5. Promote a member to moderator.
6. Confirm the user disappears from Members and appears under Moderators.
7. Demote that moderator back to member.
8. Deactivate a non-admin account with a reason.
9. Confirm the deactivated account cannot use authenticated routes.
10. Reactivate the account.
11. Open `/admin/users?role=admin`.
12. Confirm administrators are visible but not editable.

## Known Non-Goals / Boundaries

- The dashboard does not create new administrator accounts.
- Admin accounts are intentionally protected from dashboard mutation.
- Moderators can access the admin dashboard but cannot access user management.
- The report does not claim final completion of verification.
- Existing unrelated untracked `.agent` workflow/skill files were not part of this admin-dashboard work.

## Final State

The admin dashboard backend integration is implemented at the code and SQL
artifact level, with one Supabase hotfix pending application. Once the hotfix is
run and the gated verification/user checks pass, this workstream can be treated
as functionally complete for the MVP/POC admin-dashboard backend linkage.
