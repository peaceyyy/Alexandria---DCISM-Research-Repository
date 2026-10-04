# Alexandria School Hosting and Backend Transition Plan

**Status:** Decision-ready planning document. No infrastructure or application migration has begun.  
**Decision owner:** Alexandria product and technical owners  
**Primary goal:** Publish Alexandria through DCISM-managed hosting while preserving the public repository, authentication, protected PDF access, submitter corrections, staff review, audit history, and administrator controls.

## Executive Recommendation

Do **not** start with a direct Supabase-to-MySQL migration.

The DCISM tutorial confirms that the host provides MySQL and reliable static/PHP
hosting, but it explicitly warns that dynamic Next.js/SSR deployments are not
reliable on its Apache proxy. Alexandria currently depends on dynamic server
behavior for authenticated staff dashboards, server actions, protected PDF
downloads, Supabase SSR sessions, privileged user management, and storage
operations.

The safest first production path is therefore:

```text
DCISM subdomain (static frontend)  ->  Supabase Auth + Postgres + Storage + Edge Functions
```

This keeps the school as Alexandria's public host and domain while retaining
the proven backend controls that make the review and correction workflow safe.
It is a targeted frontend/backend-boundary adaptation, not a data migration.

A complete school-only solution remains feasible, but it is a separate
application-backend rewrite:

```text
DCISM static frontend  ->  PHP application/API + DCISM MySQL + private server storage
```

It should be considered only after the hybrid deployment is stable and the
department confirms the required PHP, file-system, email, backups, and process
support.

## What the DCISM Host Provides

According to the current tutorial:

- A subdomain folder is created through the DCISM admin panel.
- SSH and SFTP access are available on port `22077`.
- MySQL is available locally to applications on `localhost:3306`.
- PHP files run directly from the subdomain folder.
- Node processes can run behind an Apache proxy on ports `51920-51929` and can
  be supervised with PM2.
- The tutorial's Next.js guidance says full SSR/dynamic Next applications were
  not reliable behind that proxy and recommends static exports for
  compatibility.

Sources:

- <https://tutorial.dcism.org/>
- <https://tutorial.dcism.org/databases.html>
- <https://tutorial.dcism.org/php.html>
- <https://tutorial.dcism.org/node.html>
- <https://tutorial.dcism.org/vitenext.html>

## Alexandria's Current Backend Contract

Supabase is not only a database in the current implementation.

| Current capability | Supabase responsibility | Why it matters to Alexandria |
| --- | --- | --- |
| Identity | Supabase Auth and SSR cookies | Login, active-account checks, role identity, session refresh |
| Authorization | RLS plus authenticated SQL RPCs | Member ownership, moderator/admin permissions, protected state transitions |
| Review workflow | PostgreSQL functions and transactions | Comments, corrections, resubmission, review status, audit records |
| Private files | Supabase Storage and guarded server routes | Thesis PDFs, correction uploads, staff-only file access |
| Privileged actions | Server-only service-role client and server actions | User management, protected storage writes, administrator controls |
| Search and dashboards | Postgres indexes and RPCs | Staff queue filtering, research-area search, metrics, audit activity |

The user-visible review loop that must survive either path is:

```text
Member submits -> Staff reviews/comments -> Staff flags
  -> Member corrects -> Member resubmits -> Staff reviews again
  -> Accepted or flagged again
```

Administrators also require protected metadata edits, trash/restore, and user
management. These must never be implemented as unguarded browser-to-database
operations.

## Options Considered

### Option A: School-hosted static frontend with Supabase retained

**Recommendation for first deployment.**

The DCISM subdomain serves an exported static frontend. Supabase remains the
backend of record for Auth, Postgres, storage, RLS, and protected operations.
Server-only tasks move to Supabase Edge Functions or carefully designed
authenticated RPCs.

**Advantages**

- Preserves the working database, audits, review comments, and uploaded files.
- Avoids an account/password migration.
- Preserves row-level security and existing role/ownership rules.
- Keeps private PDF delivery and privileged actions out of the browser.
- Fits the DCISM tutorial's static-hosting recommendation.
- Supports a staged rollback: the current deployment remains usable until the
  static frontend is proven.

**Required adaptation**

- Replace Next server actions with authenticated Supabase Edge Function calls
  where server secrets or privileged behavior are required.
- Replace Next API routes used for protected files/teasers with Edge Functions
  that validate the caller and stream or sign the permitted file.
- Replace Supabase SSR cookie handling and server-page role guards with a
  client session provider plus protected-route guards. Security remains enforced
  in RLS/RPC/Edge Functions, never solely in the frontend.
- Convert dynamic Next pages that require runtime data into client-fetching
  views, while retaining static public shell pages where practical.
- Use `output: "export"` only after all runtime-only Next features have been
  removed from the frontend build.

**Important limitation**

The frontend would be school-hosted, but Supabase remains an external managed
backend. This is deliberate: it preserves functionality with the lowest data
and security risk.

### Option B: Fully school-hosted backend using PHP and MySQL

**Feasible, but a separate rewrite project.**

The frontend becomes a static application and the DCISM host runs a PHP API
backed by DCISM MySQL. Private PDFs are stored outside the public web root and
are served only through an authenticated download endpoint.

**What must be rebuilt**

1. Authentication, password reset, email verification, session rotation, and
   account deactivation.
2. Role and ownership authorization previously expressed through RLS and
   `auth.uid()` checks.
3. Every existing Postgres RPC as a PHP service plus a MySQL transaction,
   including submit, comment, correct, resubmit, status change, trash/restore,
   search, dashboard metrics, and user management.
4. Private file upload, validation, replacement, access checks, and download
   streaming.
5. Audit logging and reviewer revision evidence.
6. Data export/import and a cutover procedure.

**Key migration risk: passwords**

Supabase Auth password hashes should not be exported or reused as application
passwords. A full replacement must use one of these explicit account plans:

- require each user to set a new password through an invitation/reset flow;
- keep Supabase Auth temporarily while MySQL becomes the data store; or
- use an approved campus SSO provider, if one exists and can be integrated.

**Framework recommendation**

Do not rebuild this as scattered PHP scripts. If department provisioning
supports an appropriate PHP version, Composer, secure environment variables,
and a non-public writable storage directory, use a maintained PHP framework
such as Laravel. If those requirements are unavailable, the school-only path
is not ready to begin safely.

### Option C: Run Alexandria's current dynamic Next.js app directly on DCISM

**Not recommended without a successful platform proof.**

It might be technically possible to run `next start` behind PM2 and Apache,
but the DCISM tutorial says dynamic Next.js/SSR has produced `503` failures.
Alexandria relies on those dynamic behaviors. Treat this as unsupported unless
the hosting administrators provide a supported Node runtime and a successful
proof for this exact application shape.

## Recommended Plan: Option A First

### Phase 0: Hosting capability confirmation

Before changing application code, capture answers from DCISM hosting support or
the platform owner.

- Can a subdomain point to an external managed host through DNS, CNAME, or a
  supported reverse proxy? If yes, this is even lower risk than static export:
  deploy the current Next app on a suitable runtime while presenting a DCISM
  domain.
- What PHP version, Composer support, storage quota, and writable directories
  are available?
- Is there a directory outside the public web root for private PDFs?
- Are outbound SMTP, cron jobs, backups, database restore, and log access
  available?
- What are the Node version, memory/process quotas, PM2 restart policy, and
  support commitment for dynamic Next applications?
- What MySQL version, character set, transaction isolation, and backup/restore
  facilities are supplied?
- Are there department requirements for data residency, student records, and
  third-party services that would force a full backend migration?

**Decision gate:** If external hosting behind a DCISM domain is permitted,
deploy the unchanged server-rendered app there first. If it is not permitted,
continue with Option A's static-frontend adaptation. Do not choose Option B
until the PHP/MySQL capability answers are documented.

### Phase 1: Freeze and make the current Supabase baseline reproducible

1. Convert the currently applied SQL scripts into ordered, forward-only
   migrations under `supabase/migrations/`.
2. Produce an inventory of live tables, functions, grants, storage buckets,
   RLS policies, indexes, and environment variables.
3. Export a tested database backup and record the storage-object inventory with
   checksums, paths, MIME types, and thesis IDs.
4. Create a staging Supabase project or isolated staging dataset.
5. Record an end-to-end review fixture: member, moderator, administrator,
   accepted thesis, flagged thesis with comments, and an uploaded PDF.

**Exit criterion:** The project can be restored into staging without relying on
manual SQL-editor history.

### Phase 2: Define a provider-neutral application boundary

Create interfaces around services currently coupled to Supabase:

- `AuthGateway`: session, role, active account, password/identity lifecycle.
- `ThesisRepository`: public browse/detail, owner submissions, staff queue.
- `ReviewWorkflow`: comments, field-revision evidence, statuses, audits.
- `FileStore`: upload validation, private access, replace/delete, signed or
  streamed delivery.
- `StaffAdministration`: users, roles, deactivation, restore/trash actions.

This phase should move application policy out of direct component calls without
changing behavior. It gives either Edge Functions or a future PHP API a stable
contract to implement.

**Exit criterion:** UI calls application services, not raw provider clients or
raw table operations.

### Phase 3: Static-host compatibility adaptation

1. Classify each route as static-public, client-authenticated, or privileged.
2. Move all secret-bearing and privileged operations to Edge Functions:
   - administrator user management;
   - protected PDF download/preview;
   - file upload finalization and cleanup;
   - any action needing a service-role key.
3. Keep review-state authorization in RPCs and Edge Functions, with the caller
   JWT validated on every mutation.
4. Replace server actions and Next route handlers with typed client calls to
   those protected endpoints.
5. Replace server-page session dependence with a browser session provider and
   loading/unauthenticated states. The UI may hide controls; the backend remains
   the source of authorization truth.
6. Add static-export configuration only after the runtime-only boundaries are
   gone.

**Exit criterion:** A production build has no server actions, Route Handlers,
server-only Supabase client, `next/headers` cookie usage, or dynamic server
render requirement.

### Phase 4: DCISM staging deployment

1. Create a dedicated staging subdomain, not the final public name.
2. Deploy the static export through SFTP or Git-over-SSH.
3. Configure production Supabase redirect URLs and allowed origins for the
   staging subdomain before authentication testing.
4. Store only browser-safe Supabase environment variables in the static build;
   service-role secrets remain exclusively inside Edge Functions.
5. Run a manual role matrix:
   - guest browse and accepted-PDF behavior;
   - member submission, flagged correction, PDF replacement, resubmission;
   - moderator comments, flag, accept, and no trash visibility;
   - administrator user management, metadata edits, trash, restore;
   - audit history and search/filter behavior.

**Exit criterion:** The entire review loop works on the staging subdomain with
no privileged browser secret and no Next server dependency.

### Phase 5: Production cutover and operations

1. Publish a short maintenance/rollback runbook.
2. Create a production subdomain and add it to Supabase Auth redirect/allowed
   URL configuration.
3. Deploy the already-tested static artifact.
4. Monitor authentication failures, Edge Function errors, storage access
   denials, and staff workflow failures for the first review cycle.
5. Keep the old deployment available as a rollback target until two review
   cycles complete successfully.

## Deferred Plan: Option B Full MySQL/PHP Migration

Begin only if institutional requirements prohibit Supabase after Option A is
stable, or if Phase 0 confirms a supported PHP application environment.

### B1. Design the target system before copying data

- Define PHP API route contracts from the provider-neutral interfaces.
- Translate the Postgres schema deliberately, including UUID handling,
  timestamps, foreign keys, compound indexes, full-text/search behavior, and
  audit data.
- Translate every state transition into an explicit application service with
  transaction boundaries.
- Design session and identity strategy before migrating users.
- Design private filesystem layout and the backup/restore procedure before
  importing PDFs.

### B2. Build in parallel

- Keep Supabase production read/write as the source of truth.
- Build the PHP/MySQL backend in staging.
- Import a scrubbed snapshot and file copy into staging.
- Verify all role-matrix scenarios against the same expected outcomes.

### B3. One-time cutover

- Announce maintenance mode.
- Stop mutations on the Supabase version.
- Export the final database rows and storage manifest.
- Import into MySQL/filesystem and validate counts, checksums, ownership,
  comments, audits, and review statuses.
- Enable the new backend only after the complete role matrix passes.
- Preserve a read-only Supabase backup and rollback window.

## Non-Negotiable Security Rules

- Never put Supabase `service_role`, MySQL credentials, SMTP credentials, or
  private storage paths in a static frontend build.
- Never rely on a hidden button or client route guard as authorization.
- Keep all review status transitions and ownership checks on the server side.
- Store thesis PDFs outside the publicly served directory for a school-only
  backend; stream them after permission checks.
- Validate PDFs by MIME type, size, and server-side inspection, not only file
  extension.
- Retain auditable status changes, comment authorship, and field-revision
  timestamps through any migration.
- Test restore from backup before production cutover.

## First Decision Required

Choose the operational target:

1. **DCISM-branded/domain-hosted Alexandria with Supabase retained**
   (recommended first): preserve the backend and adapt the frontend for static
   DCISM hosting, or map the subdomain to a supported external Next runtime if
   the department permits it.
2. **Fully DCISM-hosted Alexandria with no Supabase dependency**: approve a
   separately scoped PHP/MySQL/auth/file-storage rewrite after Phase 0 confirms
   the platform can safely support it.

The first choice minimizes risk and gets Alexandria deployed sooner. The second
choice maximizes institutional ownership but should be budgeted as a new
backend project, not a deployment task.
