# Alexandria SQL ledger

This directory is a historical and operational record for the Alexandria
Supabase backend. It is **not** an automatically runnable migration chain.

The live Supabase project is the current operational baseline. A read-only
preflight on 2026-07-23 confirmed that the private 10 MiB PDF bucket, the
`on_auth_user_created` trigger, and every RPC called by the checked-out app
were present. Future work must still inspect the live project before changing
database objects.

## Directory rules

| Location | Meaning | May be run as a fresh setup? |
| --- | --- | --- |
| `changes/` | Reviewed, manually applied change sets from the project's existing history. | No. Read the file's preconditions and run a matching preflight first. |
| `checks/preflight/` | Read-only queries that establish the required live baseline. | Yes; read-only only. |
| `checks/postflight/` | Read-only queries that verify a named historical change set. | Yes; read-only only. |
| `archive/snapshots/` | Schema reference snapshots. | No. |
| `archive/superseded/` | Replaced or duplicate scripts retained for traceability. | No, unless an explicit incident-recovery plan calls for one. |

## Current change-set records

These files document the changes represented in the live project. They are
not a chronological bootstrap sequence and must not be replayed together.

| File | Role | Notes |
| --- | --- | --- |
| `changes/admin-dashboard-backend.sql` | Dashboard, access-control, submission, and Storage baseline update. | Absorbs the role-update hotfix. |
| `changes/review-feedback-backend.sql` | Review comments and member-correction backend. | Later review files override selected functions and policies. |
| `changes/review-corrections.sql` | Focused review-comment and PDF-replacement correction. | Follows the review-feedback backend. |
| `changes/research-area-normalization.sql` | Research-area normalization and review-search v2. | Includes a data normalization update. |
| `changes/review-staff-access.sql` | Staff access refinement for review search and comments. | Replaces the v2 review-search definition. |
| `changes/review-status-transitions.sql` | Review lifecycle transition refinement. | Requires its paired preflight. |
| `changes/admin-activity-context.sql` | Dashboard activity preview and full activity feed. | Replaces the dashboard snapshot definition. |
| `changes/staff-submission-attribution.sql` | Staff-published thesis attribution correction. | Replaces the earlier staff direct-publish ownership behavior. |

## Archived records

| Previous purpose | Current location | Why it is archived |
| --- | --- | --- |
| General database schema snapshot | `archive/snapshots/db-schema.sql` | Reference-only snapshot; its header says not to run it. |
| Earlier reviewed target-schema snapshot | `archive/snapshots/updated-db-fields.sql` | Reference-only snapshot; it does not include every later change. |
| Role-update keyword ambiguity hotfix | `archive/superseded/admin-update-user-role-hotfix.sql` | The corrected function is already included in the dashboard change set. |
| Review search v1 | `archive/superseded/review-submission-search-v1.sql` | The app calls review-search v2. |
| Original staff direct-publish behavior | `archive/superseded/staff-direct-publish-backend.sql` | Replaced by the staff-submission attribution change set. |
| Standalone thesis-submission RPC definition | `archive/superseded/submit-thesis-transaction-standalone.sql` | Duplicated by the dashboard change set; retained only for history. |

## Rules for future database changes

1. Do not add new executable SQL under `docs/sql/changes/`.
2. After a fresh-environment baseline is deliberately reconstructed and tested,
   add forward-only migrations under `supabase/migrations/`.
3. Pair every modifying migration with a narrow read-only preflight and
   postflight check.
4. Never rely on a local SQL file to prove the live schema. Inspect the target
   Supabase project first.

Historical reports may still mention the former flat `docs/sql/<name>.sql`
paths. Use this ledger to resolve those references to their current location.
