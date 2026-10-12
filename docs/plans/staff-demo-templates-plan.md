# Plan: Staff Presentation Demo Templates

**Status:** Draft for human review. This is documentation only. It does not authorize implementation, test execution, Supabase work, Storage access, database work, or deployment.

**Feature branch:** `codex/staff-demo-templates`

## Purpose

Provide administrators and moderators with a safe, polished walkthrough of Alexandria's Thesis and Capstone submission experiences. The walkthrough must resemble the real UI and lead to a sample record preview, but it must never create a thesis record, file, Storage object, audit event, tag, search result, metric, or public URL.

The existing live **Sample fields** convenience helper is retired. It injects realistic metadata into the actual upload flow and can be submitted through the normal staff path, which is unsuitable for a presentation feature.

## Product decision

Create two staff-only, frontend-only templates:

| Template | Demonstrates |
| --- | --- |
| Thesis | Standard thesis metadata and a simulated PDF attachment. |
| Capstone | The same workflow with the capstone-only deployment link and a simulated PDF attachment. |

Staff can edit values during a walkthrough. The final action is **View sample record**, never **Submit** or **Publish**. The preview displays the temporary browser-only values; direct navigation or refresh falls back to its immutable fictional fixture.

## Access and data boundaries

- Entry points and preview routes live under `/admin/demo`, inheriting the existing administrator/moderator guard from `/admin`.
- The route is role-protected, not secret. There is no role selector.
- Demo code must not import `submitThesis`, upload/storage helpers, write-capable actions, Supabase clients, real thesis-detail services, or admin-metrics services.
- No demo data goes into the URL, cookies, server logs, database, Storage, analytics, or public routes.
- The demo does not use `/theses/:id`, a database ID, an accepted/published status, or an actual repository result card.

## Component architecture

Reuse the existing field-step and layout components where their behavior is genuinely shared: stepper, metadata fields, people editor, tags, research-area controls, review summary styling, and design tokens.

Keep the live upload controller and demo controller separate. The live `/upload` page owns real file validation and `submitThesis`; the demo wizard owns only local form state and must never import that service. Do not spread a broad `isDemo` condition through the live page.

### Shared attachment presentation

Extract a small presentational `PdfAttachmentCard` shared by the real review/detail treatment and demo surfaces. The live caller supplies its real file metadata and authorized open action. The demo caller supplies only a simulated descriptor and no action.

The simulated form must match the attachment's visual language—PDF icon, filename, type, size, spacing, metadata hierarchy, and document-card shape—while staying unmistakably non-real:

- a visible **SAMPLE PDF** text badge;
- a concise message: **Not stored or downloadable in presentation mode**;
- a non-interactive document-cover thumbnail with a diagonal **SAMPLE** watermark;
- no `File`, blob, `data:` URL, href, download button, signed URL, or **Open PDF** action.

Do not weaken the live PDF requirement or widen the live review component into a demo-mode controller. It should only use the shared visual card for the existing real-file case.

## Local state and preview

The demo wizard owns editable client state. Immediately before intentional navigation to a preview, it may write a validated, namespaced demo view model to `sessionStorage`. A client-only preview component reads that model after mount and falls back to a cloned immutable fixture when the value is absent or invalid.

The server route remains under `/admin` for access control; it must not try to read browser storage. Restart, Switch template, and Exit clear the namespaced session state.

## UX requirements

- The dashboard has a **Presentation demo** card with **Explore Thesis demo** and **Explore Capstone demo**.
- Every demo screen carries: **Presentation demo — Changes stay in this browser and will not be saved, submitted, or published.** This meaning must be available in text, not color alone.
- The simulated PDF step looks like an attachment stage, not an inactive upload error.
- The preview contains a persistent **Demo only — not a published Alexandria record** label and the same attachment-card treatment.
- Demo actions use **Explore**, **View sample record**, **Restart**, **Switch template**, and **Exit**; never **Submit** or **Publish**.
- A custom exit dialog guards application-controlled Back/Exit navigation. Browser tab close or refresh uses the browser-native `beforeunload` prompt; a web application cannot show a custom dialog for that event.

## Implementation sequence and review gates

1. Retire the live sample helper while preserving normal live upload behavior.
2. Add protected static demo routes, dashboard entry, and deep-cloned fictional fixtures.
3. Build the no-write local wizard, demo banner, browser-leave handling, and shared visual PDF attachment card.
4. Add a client-side local preview with fixture fallback and no data fetch.
5. Add accessibility, copy, boundary, and regression tests.

After every slice, stop for human review. Tests may be authored but must not run until the user explicitly says: **Human review approved; run verification.** Browser and end-to-end checks additionally require separate explicit approval.

## Explicit non-goals

- Fake thesis rows, draft records, fake PDFs, seed data, Storage objects, or demo-specific database fields.
- Changes to staff publication/review policy.
- New roles, secret routes, public demo catalog pages, or changes to real thesis-detail/PDF access.
- Automatic testing, linting, building, browser automation, or deployment.
