# Repository Discovery Search Plan

> [!TIP]
> **Plan Status: READY** — This plan uses a submit-to-search model, immediate facet updates, and AND matching across selected tags.

## Goal

Make Alexandria's repository discovery one shareable, server-backed search experience: a prominent submitted query, immediate metadata facets, and useful tag discovery.

## Product contract

- The query field appears above the result list on desktop; Enter or its search button submits it. It searches title, abstract, authors, and tags.
- Search and facets share a single **control zone** above repository results. The desktop sidebar is public navigation; on mobile, filters open in a dedicated sheet.
- Selecting/removing a facet updates results immediately and preserves the text query. Active selections render as removable chips above the list, with **Clear all**.
- All public discovery state is URL-backed and bookmarkable: `q`, repeated `area`, `department`, `type`, `tag`, `from`, `to`, and `page`.
- Facet semantics: selections within a facet are OR; different facets are AND; multiple selected tags are AND. Results sort newest-first for this MVP.
- Tags are discovered through a searchable multi-select/popover with matching-tag suggestions, not an unbounded sidebar tag list.

## Tasks

- [ ] Define a single `PublicThesisSearchParams` parser/serializer with validation, defaults, repeated URL parameters, and page reset rules. → Verify: valid URLs round-trip; invalid values are ignored safely.
- [ ] Replace the `getTheses({ limit: 100, q })` plus browser-side filtering split with one paginated server query that applies all facets and returns total count. → Verify: a URL with every facet returns only matching accepted theses and accurate count/page metadata.
- [ ] Add a small, read-only tag-suggestion query scoped to accepted theses, normalized case-insensitively, with a result limit. Add the database indexes/query shape required for title/abstract/author/tag discovery. → Verify: a partial tag returns stable suggestions and does not expose unaccepted records.
- [ ] Extend the public search query to include author names and tags without multiplying thesis rows; add the query-level tag matching rules above. → Verify: author and tag-only searches find the expected thesis once, and two tag selections require both tags.
- [ ] Keep the reusable `RepositorySearchBar` above the result list; retain Enter submission and an explicit accessible submit button. → Verify: search retains the current filter URL state.
- [ ] Render URL-editing facets inside the top control zone, not the public navigation sidebar. Preserve sidebar-collapse and result-density preferences. → Verify: selecting a filter updates the URL and results, and opening the copied URL reproduces the same view.
- [ ] Add the tag multi-select and active-filter chip row, including individual removal, `Clear all`, result heading, loading/pending feedback, empty state, and mobile drawer parity. → Verify: all controls work with keyboard, show selected state, and keep mobile/desktop results identical.
- [ ] Update the public-search contract/types and repository docs to record searchable fields, URL semantics, tag matching, pagination, and explicit non-goals (semantic search/autocomplete result replacement). → Verify: docs and service types describe the implemented behavior.
- [ ] Add focused unit/component/service tests for URL parsing, query construction, tag matching, active-chip removal, and no-result states. → Verify: tests are ready for human-review-approved execution.

## Migration notes

- Use an additive timestamped migration in `docs/sql/changes/`; do not alter the flexible `thesis_tags` data model.
- Prefer database-level existence predicates or an RPC for tag/author matching, rather than joining the result query directly and deduplicating rows in React.
- Add pagination before growth makes it necessary. Do not build semantic/vector search or live full-result search in this scope.

## Done when

- A researcher can submit a query, refine it by metadata and tags, share the URL, and get the same paginated result set on another device.
- The public search behavior matches the PRD's title, author, tag, and abstract discovery promise.
- Search remains intentional and stable; live behavior is limited to filter changes and tag suggestions.
