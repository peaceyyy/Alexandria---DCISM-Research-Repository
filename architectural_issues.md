Blocking before dashboard work
Dashboard plan lacks authorization gates.
The proposed admin layout only describes UI structure—no requireRole(["admin"]) or moderator boundary. Add authorization to the route-group layout and every mutation. See [breakdown.yaml (line 15)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/.agent/changes/phases/Homer/admin-dashboard/frontend/breakdown.yaml:15).

RLS is promised but not represented in the SQL snapshot.
No CREATE POLICY or ENABLE ROW LEVEL SECURITY statements were found in [updated_db_fields.sql](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/docs/updated_db_fields.sql). The live database may differ, but repository evidence cannot currently prove dashboard data is protected.

The dashboard plan has stale/ambiguous paths.
It targets app/... and features/... without establishing whether its root is the repository or Alexandria/. It also depends on missing docs/PRODUCT.md: [dependencies.yaml (line 11)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/.agent/changes/phases/Homer/admin-dashboard/frontend/sub-phases/01-admin-layout-shell/dependencies.yaml:11).

“Delete member” has no backend contract.
The UI plan includes Edit/Delete actions, but the API defines only user listing and role updates. Do not expose Delete until deletion/deactivation semantics are explicitly designed: [breakdown.yaml (line 52)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/.agent/changes/phases/Homer/admin-dashboard/frontend/breakdown.yaml:52).

High-priority architectural risks
Duplicated auth contracts: CurrentUser, ServiceResult, and ServiceError exist in both [auth-contract.ts (line 4)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/Alexandria/lib/auth/auth-contract.ts:4) and [types.ts (line 12)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/Alexandria/lib/services/types.ts:12). Consolidate these before dashboard DTOs expand.

Role inheritance is display-only: the profile says Admin inherits Moderator/Member, but backend authorization still relies on explicit arrays and ad-hoc comparisons. Introduce a small capability map or shared predicates before adding many dashboard actions.

Repeated session/profile queries: getCurrentUser() is independently called by landing, theses, profile, login, and guards. A dashboard layout plus child page could repeat authentication and profile queries in one request. Use a request-scoped cached principal or resolve once in the protected layout.

Session refresh plumbing is unproven: [server.ts (line 15)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/Alexandria/lib/supabase/server.ts:15) suppresses cookie-write errors assuming middleware refreshes sessions, but no application middleware.ts or proxy.ts exists.

Three separate headers already exist. Landing, theses, and profile have different header structures. A fourth dashboard shell will worsen drift. Extract a modest shared header/account control—not a giant universal layout.

Smaller issues
Profile search submits q, but /theses ignores search parameters and renders mock cards. It currently looks functional without being functional.
[profile/page.tsx (line 20)](/C:/Users/Peace/Documents/vscode/Personal Projects/Alexandria - DCISM Thesis Repository/Alexandria/app/profile/page.tsx:20) redirects every missing-data case to login, including a valid session with a missing profile row. Distinguish unauthenticated from profile corruption.
getCurrentUser() selects \* and logs user identifiers. Select explicit columns and remove debug logging before production.
The disabled Change Password button communicates availability through title, but disabled controls are not reliably focusable. Show visible “Unavailable” text.
~~Docs still say post-auth redirects to /, while implementation now uses /theses.~~ (Resolved: implementation now uses role-based routing: /admin/dashboard for admins, /admin/moderators for mods, /theses for members).
Dashboard metrics are unspecified. Freeze exact definitions and DTOs before creating generic stat cards or mock data.
Recommended order next session
Repair the dashboard breakdown paths and missing source references.
~~Freeze route access: admin-only versus moderator/admin.~~ (Resolved: Layout guards restrict /admin/members and /admin/moderators to Admins only. Moderators can only access /admin/dashboard).
Consolidate the canonical authenticated-user DTO.
Add centralized capabilities, protected layouts, and RLS evidence.
Define DashboardMetrics, RecentUploadRow, and AdminUserRow.
Make mocks satisfy those real DTOs.
Build the dashboard shell and tables.
Keep row actions keyboard-visible and touch-accessible—not hover-only.
Add last-admin/self-demotion safeguards before role management.
The right architecture remains a modular Next.js/Supabase application. Microservices, CQRS, or a heavy RBAC package would be overkill.
