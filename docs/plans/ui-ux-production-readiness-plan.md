# Plan: Alexandria UI/UX Production Readiness

**Status:** Proposed documentation only. No application, SQL, deployment, data-cleanup, or verification work is included in this plan.

**Scope:** Make the existing university-facing submission, staff workspace, and self-registration experience safe and understandable for real use. This plan is intentionally separate from database cleanup and the capstone deployment/teaser-thumbnail work in `docs/plans/capstone-deployment-and-teaser-workflow-plan.md`.

## Audit summary

The present implementation has five production-readiness gaps:

1. The upload page exposes a staff-only **Sample fields** control. It is hidden for members, but the sample metadata is embedded in the client and the server does not reject a sample-origin request.
2. A staff member's role implicitly determines the outcome. `submitThesis` currently chooses direct publication for both administrators and moderators, while the confirmation dialog explains the difference only in general prose.
3. The staff review list does not expose a file-integrity state. A missing primary-file record, invalid file metadata, or unlinked storage object is discovered only when the PDF route is opened.
4. The shared `/admin` layout admits moderators and administrators. The sidebar correctly hides **User Management** for moderators, but a direct request to `/admin/users` still reaches the page and can end as **Accounts unavailable** after the service refuses access.
5. The existing `@usc.edu.ph` registration flow validates the domain and collects affiliation, but it does not explain the default member role, submission ownership, review lifecycle, or how corrections work.

## Product decisions to approve before implementation

### 1. Staff intake is an explicit choice

Replace role-implied publication with an **Intake mode** chosen by a staff member on the final upload step.

| Actor | Available intake modes | Default | Result |
| --- | --- | --- | --- |
| Member | Review submission only | Review submission | Creates `for_review`; the record is not public. |
| Moderator | Review submission; Direct publication | Review submission | Review mode creates `for_review`; direct publication requires a deliberate confirmation and creates `accepted`. |
| Administrator | Review submission; Direct publication | Review submission | Same lifecycle as moderator, with existing administrator-only editing/replacement permissions remaining separate. |

The default must be **Review submission** for every role. Direct publication must be named as a publication action, use the accepted/public status language, and require a final acknowledgement that the staff user is authorized to publish the record. The UI must not offer a role picker; authorization remains server-owned.

**Server contract:** send a narrow `intake_mode` value such as `review` or `direct_publish`. The server must force members to `review`, reject an unknown mode, and authorize `direct_publish` only for active staff. The RPC choice must follow that validated mode rather than infer publication from the role. This preserves a secure server boundary and prevents a crafted client request from publishing as a member.

### 2. Production never accepts template/sample submissions

Remove the current **Sample fields** control from production. If retaining it for local development remains useful, place its data and UI behind a development-only boundary and do not include the control in the production experience.

Every development seed should carry one reserved, machine-readable source marker (for example, `development_sample`) in the submission input. The server must reject that marker before any storage upload or database/RPC call. It should return a plain validation error such as: **“Sample data cannot be submitted. Replace the template fields with the real thesis details.”**

This is deliberately a server rule, not only a hidden button. The client warning can help a staff user, but it is not an authorization or data-quality control.

### 3. File integrity is a visible staff state

Introduce a derived, read-only integrity state on every staff review row and review-detail header. It is operational information, not a new review status and must not change `for_review`, `flagged`, `accepted`, or `trashed` by itself.

| Integrity state | Definition | Staff presentation | Permitted next step |
| --- | --- | --- | --- |
| `ready` | Exactly one usable primary PDF record with a path that resolves to an object in `thesis_files_bucket`. | Quiet “PDF ready” label; do not draw attention away from review status. | Open/preview normally. |
| `missing_primary_record` | No primary-file record, no path, or non-PDF primary metadata. | Visible warning: “PDF attachment missing.” | Administrator repairs/replaces the primary PDF; moderator can report/flag but cannot repair. |
| `unlinked_storage_object` | Primary record exists but its referenced object is absent from the configured bucket. | Visible warning: “PDF file is no longer linked to storage.” | Administrator repairs/replaces; retain the review record and audit context. |
| `ambiguous_primary_file` | More than one primary record is returned for one thesis. | Visible warning: “PDF attachment needs administrator review.” | Administrator resolves the attachment state through the approved repair workflow. |

The staff list should expose the state before a reviewer opens a PDF. The detail page should repeat it near the attachment section, describe the restriction in text rather than color alone, and keep **Open PDF** unavailable when the state is not `ready`.

The implementation should obtain the state in one bounded, server-side batch for the current review page: inspect primary-file metadata and check the exact `storage.objects` reference with server credentials. Do not make a signed-URL request per visible row and do not expose storage paths to the browser. No cleanup or automatic deletion belongs to this feature.

### 4. Account management is administrator-only at both navigation and route layers

Keep **User Management** absent from moderator navigation. Add an early server-side role gate on `/admin/users` (and the `/admin/moderators` redirect path) before any account-list query is issued.

For a moderator who manually enters the route, render a clear restricted-access state within the staff shell: **“Account management is available to administrators only.”** Include a safe return action to the dashboard. This is preferable to allowing the route to reach account services and misrepresenting authorization denial as an availability failure.

The existing service-layer administrator check remains mandatory as defense in depth. The route-level response improves clarity; it is not the security boundary by itself.

### 5. Self-registration explains the contract before an account is created

Add a compact onboarding disclosure to the sign-up page, above the primary action and linked from the first authenticated upload entry point. Keep the existing `@usc.edu.ph` validation and affiliation fields.

Suggested copy:

> **Your Alexandria account**  
> Sign up with your `@usc.edu.ph` email to create a member account. Member accounts can submit theses they are authorized to represent; staff roles are assigned separately by an administrator.
>
> **What happens after you submit**  
> Your submission enters **Under review** and is not published yet. If a reviewer requests changes, it becomes **Needs revision**. Update the requested fields, address the feedback, and resubmit; it returns to **Under review** and editing locks again. A study becomes public only after it is approved for publication.
>
> **Your responsibility**  
> Submit accurate metadata and the correct thesis PDF. Only submit work you are authorized to represent, and keep author and adviser details accurate. Use the correction workflow for reviewer-requested changes instead of creating a duplicate submission.

Use the existing member-facing labels where they already map to canonical statuses: **Under review** = `for_review`, **Needs revision** = `flagged`, and **Published** = `accepted`. Do not expose `trashed` as a member workflow state.

## Planned implementation slices

### Slice A — Submission safety and staff-intake clarity

**Primary surfaces**

- `Alexandria/app/upload/page.tsx`
- `Alexandria/app/upload/_components/submit-confirm-dialog.tsx`
- `Alexandria/app/upload/actions.ts`
- `Alexandria/lib/services/submission-service.ts`
- `Alexandria/lib/services/types.ts`
- the upload schema and focused tests that define the payload contract

**Work**

1. Remove the production sample helper and its embedded production seed, or isolate it into a development-only module with a reserved source marker.
2. Add an accessible Intake mode control for staff on the final review step. It must use a visible label, explanatory text, keyboard-operable choices, and a short consequence summary that changes with the selected mode.
3. Make the confirmation dialog state the selected outcome, not a generic role-dependent rule:
   - **Send for review**: “This thesis will be submitted for staff review and will not be public yet.”
   - **Publish now**: “This thesis will be published immediately after submission.”
4. Validate `intake_mode` and reject the development sample marker in `submitThesis` before file storage or RPC calls.
5. Use the validated mode for the database operation. Preserve the existing canonical status vocabulary and audit trail.

**Acceptance criteria**

- A member has one possible outcome: `for_review`.
- A staff user sees the two named outcomes, defaults to review, and must deliberately choose direct publication.
- A direct-publication request from a member is rejected on the server.
- A request marked as a development sample is rejected on the server before it creates storage or database records.
- Production UI contains no sample-data control or prefilled sample content.

### Slice B — Staff attachment-integrity awareness

**Primary surfaces**

- `Alexandria/lib/services/review-service.ts`
- `Alexandria/lib/services/types.ts`
- `Alexandria/app/admin/_components/admin-dashboard-view.tsx`
- `Alexandria/app/admin/review/[id]/review-detail-client.tsx`
- `Alexandria/app/api/theses/[id]/file/route.ts`
- a dedicated server-side integrity query/helper and focused tests

**Work**

1. Define an `AttachmentIntegrityState` DTO distinct from review status.
2. Batch-resolve primary-file metadata and storage linkage for the visible review queue and selected detail record.
3. Add textual state badges and a short recovery explanation to the queue and detail header.
4. Preserve the guarded file route as the final authorization boundary. Improve its error response only if needed to remain consistent with the preflight state; do not reveal bucket paths or internal storage details.
5. Limit repairs to the current administrator PDF-replacement capability. Moderators receive a clear restriction and can continue their normal review/flagging workflow.

**Acceptance criteria**

- Staff can identify every unavailable attachment without opening a PDF.
- The UI distinguishes no attachment record from an unlinked storage object.
- Review status and integrity state appear together without overwriting each other.
- No browser payload contains a raw storage path.
- No automatic file cleanup, storage mutation, or review-status transition is introduced.

### Slice C — Administrator route ownership

**Primary surfaces**

- `Alexandria/app/admin/users/page.tsx`
- `Alexandria/app/admin/moderators/page.tsx`
- `Alexandria/app/admin/_components/admin-sidebar.tsx`
- `Alexandria/lib/services/user-service.ts`

**Work**

1. Retain the existing role-filtered navigation.
2. Gate account routes before their data fetches and render an explicit moderator denial state.
3. Ensure the legacy moderator redirect cannot bypass that gate.
4. Leave account mutation authorization in the service layer unchanged or strengthen it if the route audit exposes a gap.

**Acceptance criteria**

- Moderators do not see account-management navigation.
- A direct moderator visit does not call account-list services and does not show **Accounts unavailable**.
- Administrators retain existing account-management behavior.

### Slice D — Registration and member-lifecycle onboarding

**Primary surfaces**

- `Alexandria/app/(auth)/_components/sign-up-form.tsx`
- existing auth field/component styles
- the first member upload/onboarding surface, if the copy needs a follow-up reminder
- `docs/DESIGN.md` only if a reusable disclosure pattern needs to be recorded

**Work**

1. Add the approved onboarding disclosure without adding a role selector or weakening the email-domain rule.
2. Use plain, stable language that accurately describes default member status, ownership, review states, and corrections.
3. Link users to the member correction view or help content once a concrete support destination is approved; do not invent a support channel in the UI.
4. Ensure the disclosure is readable on small screens, uses semantic headings and lists, and does not rely on color for workflow meaning.

**Acceptance criteria**

- A new user learns that self-registration creates a member account.
- The lifecycle explains review, revision, resubmission, relocking, and publication accurately.
- The copy does not imply that every `@usc.edu.ph` user is staff or can publish immediately.

## UI and accessibility constraints

- Preserve Alexandria’s existing design tokens and canonical status-chip meanings in `docs/DESIGN.md`; do not introduce a competing status color system.
- Every intake option needs a visible label, a focus indicator, a 44px-or-larger practical target, and outcome text adjacent to the control.
- Integrity messages must contain the state and recovery path in text. Color/iconography may reinforce, but cannot be the sole signal.
- Loading and mutation states must prevent duplicate submission and explain the active operation.
- Maintain at least 4.5:1 text contrast, logical tab order, and responsive behavior at the project’s existing mobile and desktop breakpoints.
- Keep review information concise. A file-integrity warning should be prominent enough to prevent a dead-end PDF action, but should not visually eclipse the thesis’s review status or reviewer feedback.

## Explicit non-goals

- Database cleanup, bulk repair, deletion, or migration of existing records.
- Automatic re-linking, deletion, or replacement of PDF objects.
- Capstone deployment link or teaser-thumbnail work, including its UI and storage workflow.
- A new staff role, role-selection during self-registration, or a new public moderation model.
- Replacing the guarded PDF route, exposing storage paths, or loosening authorization rules.
- Verification, test execution, builds, browser checks, or deployment. These require separate approval after implementation review.

## Review and verification gate

Implementation should be reviewed slice by slice. After code changes are presented, do not run tests, linting, type checks, builds, browser automation, or deployment checks until the user explicitly says:

> Human review approved; run verification.

Browser and end-to-end checks still require separate explicit approval after that gate.
