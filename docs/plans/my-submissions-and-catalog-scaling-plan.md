# My Submissions Status Filter and Catalog Scaling Plan

> [!TIP]
> **Plan Status: READY** — member-facing statuses and navigation-state behaviour are confirmed.

## Goal

Make My Submissions more useful without reintroducing public-repository facets that its backend does not support, then add sorting and pagination only when repository growth justifies them.

**Confirmed status set:** `All`, `Under review`, `Needs revision`, and `Published`.

`Trashed` remains an administrative removal state and is deliberately absent from My Submissions. It is not the same as `Flagged`, which is the member-facing revise-and-resubmit workflow. Exposing trashed records would require a separate, intentional owner-notification and support/recovery design.

## Tasks

- [x] Extend the Home URL parser with `status`, accepted only with `mine=1`; preserve it through search, clear-search, and detail return. The My Submissions sidebar link remains a clean default entry point. → Verification is pending human review.
- [x] Pass `status` to `listOwnSubmissions` and retain its existing owner-only, non-trashed default for `All`. → Verification is pending human review.
- [x] Add one compact **Status** disclosure beside the My Submissions search, with no research-area, program, type, year, or tag facets. → Verification is pending human review.
- [x] Update My Submissions result/empty-state copy so it distinguishes an empty account from an unmatched status, search, or combination. → Verification is pending human review.
- [x] Update the discovery audit and design guide with the owner-scope filter contract. → Verification is pending human review.

## Catalog-growth gate — intentionally deferred

Do not add a sort selector or pagination UI in the status-filter change. The current public query service is already paged, while the screen deliberately requests up to 100 results and My Submissions loads the owner’s full active list.

Start the catalog-scaling work when either condition is true:

- Published results can exceed 100 records; or
- a real review finds loading, scrolling, or result scanning uncomfortable at the current list size.

When the gate is met:

- [ ] Pass parsed `page` to public `getTheses` with a deliberate page size and expose accessible Previous/Next controls plus total-result context. → Verify: page links preserve search/facets and a detail-page return restores the same page.
- [ ] Extend `OwnSubmissionListParams` and `listOwnSubmissions` with page, limit, and total count before rendering pagination in My Submissions. → Verify: the query remains owner-scoped and returns stable `updated_at DESC, id DESC` pages.
- [ ] Decide whether a sort control solves a demonstrated need. Keep public default `year DESC` and My Submissions default `updated_at DESC`; do not add sort choices without a user scenario. → Verify: each approved sort is server-side, URL-backed, and documented.

## Done When

- [ ] My Submissions has one truthful, URL-backed status filter and title search.
- [ ] Public repository filters remain separate from owner-workflow status.
- [ ] Pagination and sorting remain deferred until the catalog-growth gate is met.
- [ ] Human review is complete before any verification is run.
