# Supabase Security Advisor Baseline — 2026-07-27

**Project:** Alexandria (`fwqeevjyglgynaccdiyz`)  
**Source:** Live Supabase security advisor, run after the teaser-thumbnail submission RPC change.  
**Purpose:** Record known findings separately from the capstone/teaser feature so future hardening work is explicit and auditable.

## Accepted feature-specific state

| Finding | Current interpretation | Guardrail |
| --- | --- | --- |
| `public.thesis_media` has RLS enabled with no policies. | Intentional for phase one. Clients do not create or update media rows directly; guarded RPCs own the write path. | Before granting any direct Data API access or adding a client query, add explicit least-privilege policies and re-run the advisor. |
| `public.submit_thesis_transaction(jsonb)` is a signed-in callable `SECURITY DEFINER` function. | Intentional. Submission requires `auth.uid()`, an active profile, owner-scoped Storage paths, and server validation. | Preserve the fixed search path and authorization checks. Re-check grants and advisor results whenever the function changes. |

## Existing findings to schedule separately

| Finding | Affected live objects | Next action |
| --- | --- | --- |
| Mutable function search path | `public.search_public_theses`, `public.get_tag_suggestions` | Review function bodies and replace them with fixed `search_path` definitions without altering their public contract. |
| Anonymous execution of `SECURITY DEFINER` functions | `public.handle_new_user()`, `public.rls_auto_enable()` | Confirm whether each must be callable through the Data API. Revoke unintended `PUBLIC`/`anon` execution rather than relying on obscurity. |
| Signed-in execution of `SECURITY DEFINER` functions | Multiple existing application RPCs, including review and administration operations. | Audit function-by-function: authorization inside the body, fixed search path, intentional execute grants, and whether the function should be in an exposed schema. Do not blanket-revoke application RPCs. |
| Leaked-password protection disabled | Supabase Auth configuration | Decide with the product owner whether to enable Have I Been Pwned password screening, then record the policy and user-impact communication. |

## Non-conclusions

- This report does not claim that every advisor warning is a vulnerability. Several functions are intentionally callable by authenticated users and enforce authorization internally.
- This report does not authorize security SQL changes. Each remediation needs its own live preflight, reviewed query, and postflight.
- The advisor output is a point-in-time baseline. Re-run it after changes involving Storage, RLS, grants, or `SECURITY DEFINER` functions.

## Exit criteria for the security-hardening task

- Every `SECURITY DEFINER` function has an explicit execution audience and an in-body authorization review.
- Every affected function has a fixed search path.
- `thesis_media` either remains intentionally RPC-only or gains reviewed, least-privilege policies before direct client access is added.
- The Auth password-protection decision is documented and applied.
- A fresh security-advisor run distinguishes resolved findings from accepted, documented exceptions.
