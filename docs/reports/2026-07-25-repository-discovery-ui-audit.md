# Repository Discovery UI Audit — 2026-07-25

## Scope

Audit of the public repository control zone after the navigation and filter refactor. Evidence: the supplied desktop screenshots and the current components. The immediate issues below have since been addressed; this report remains the design record and parking lot.

## Primary observation

The current control zone exposes too many representations of the same state at once: search icon plus search icon, sidebar navigation plus scope tabs, facet-count badges plus an expanding row of selected-filter chips. The result feels cramped because controls are competing to explain the same thing instead of each owning one role.

## Findings

### P0 — My Submissions shows filters that do not filter

- `Alexandria/app/home/page.tsx:67` calls `listOwnSubmissions` with only `q`.
- `Alexandria/lib/services/review-service.ts:1120-1171` supports review status and title query only; it does not receive area, program, study type, year, or tags.
- `Alexandria/components/layout/filter-bar.tsx:72-119` still renders all repository facets in this scope.

**Impact:** A member can select visible filters in My Submissions and believe the list is narrowed when it is not. This is a correctness problem, not just a label problem.

**Recommended resolution:** Let the sidebar own switching between Browse research and My Submissions. Replace the Home scope tabs with a scope heading. Hide repository metadata filters in My Submissions until that backend contract is intentionally extended; retain only the supported text search, or introduce submission-status filtering as a separate future feature.

### P1 — Duplicate search icon

- `Alexandria/components/layout/repository-search-bar.tsx:26` renders a decorative magnifying glass.
- `Alexandria/components/layout/repository-search-bar.tsx:36-38` renders a second icon-only submit button.

**Impact:** The two identical icons do not communicate different actions. The screenshot reads as accidental duplication.

**Recommended resolution:** Keep the leading icon as orientation and remove the trailing icon-only button; Enter already submits the form. If a visible submit affordance is retained, use a text label such as `Search`, not a second magnifying glass.

### P1 — Active-chip row repeats facet state and crowds results

- `Alexandria/components/layout/theses-browser.tsx:108-116` derives every selected facet, including every tag.
- `Alexandria/components/layout/theses-browser.tsx:200-229` displays them all below the scope/result row.
- `Alexandria/components/layout/tag-multi-select.tsx:91-110` already displays selected tags inside the Tags control where they can be removed.

**Impact:** Long tag selections push content down and make the repository feel like a filter-debugging UI rather than a research index.

**Recommended resolution:** Remove the global active-chip row. Keep selection counts on the facet controls and place `Clear all` next to the filter controls. Keep individual selected tags only inside the Tags popover/sheet, where they belong.

### P1 — Year popover overflows its container

- `Alexandria/components/layout/filter-bar.tsx:58-66` places two text inputs in a two-column grid without `w-full min-w-0`.

**Impact:** The native input width exceeds its grid track, producing the overlap visible in the screenshot.

**Recommended resolution:** Give both inputs `w-full min-w-0`, use `type="number"`, and preserve the compact range layout. The popover should not need clipping to hide a layout bug.

### P2 — “Refine” is vague and wrong in the submission scope

- `Alexandria/components/layout/filter-bar.tsx:97` labels repository facets as `Refine` in every scope.

**Impact:** In Browse, `Filters` is plainer language. In My Submissions, the label implies working filters that the current backend does not apply.

**Recommended resolution:** Rename it to `Filters` for Browse and do not render it in My Submissions until supported filters exist.

### P2 — Selection-count badges are too weak

- `Alexandria/components/layout/filter-bar.tsx:25` uses a 12% brand-color wash with small blue text.

**Impact:** The selected counts in the screenshot are technically present but visually recessive; they do not provide dependable state feedback.

**Recommended resolution:** Use a higher-contrast count treatment: solid brand background with white text, or a stronger tokenized surface/text pairing that meets contrast requirements.

## Accessibility and guideline notes

- `Alexandria/components/layout/repository-search-bar.tsx:27-35` — search input lacks a programmatic label, `name`, and autocomplete intent. Add an associated label or `aria-label="Search research"` and `name="q"`.
- `Alexandria/components/layout/tag-multi-select.tsx:45-55` — tag search input lacks a programmatic label/name.
- `Alexandria/components/layout/tag-multi-select.tsx:66-82` — interactive list rows use `li role="button"`; use actual buttons or a proper listbox/option pattern for predictable keyboard behavior.
- `Alexandria/components/layout/filter-bar.tsx:61,65` — year fields should be numeric inputs with a meaningful `name`; the visible wrapping labels are otherwise a good start.

## Vibe Check

**Vibe score: 67/100 — Needs Polish**

The dark academic-index direction is intact: restrained surfaces, compact facets, and the public navigation rail fit Alexandria. The current problem is control density, not the visual language. The page asks users to parse too many related states before they reach the papers.

### Major vibe killers

1. Duplicate affordances: two search icons and two My Submissions entry points.
2. State echo: facet counts, chips, and tag-chip lists all report the same selection.
3. A visible filter system that silently does not apply in My Submissions.

### Quick wins, in priority order

1. Hide unsupported metadata filters in My Submissions and remove the duplicated scope tabs.
2. Remove the trailing search icon and the global active-chip row.
3. Fix the year field width and strengthen count-badge contrast.
4. Keep tag selection/removal inside the Tags popover or mobile filter sheet.

## Immediate follow-up implemented

- Pending feedback: search now announces `Searching…`; public filter changes show a compact pending spinner and live status.
- Empty states: public research and My Submissions now distinguish empty repositories, unmatched searches, and unmatched filters. Relevant clear actions appear only when useful.
- Year range: inputs are constrained to a four-digit year from 1900 through next year; invalid or inverted ranges receive an inline explanation without changing the results.
- Query context: the existing result heading now lightly shows `Results for “…”` without adding a second search surface or an active-chip row.
- Clear search: a quiet, labeled X appears only while text is present. It clears the URL query and resets pagination without discarding the user’s active repository filters.

## Interaction-accessibility follow-up implemented

- Facet triggers, options, clear actions, and shared buttons now present a pointer cursor alongside their existing hover and focus-visible states.
- Filter options retain a visible keyboard focus ring even though their native checkboxes are visually hidden.
- Tag filtering now uses free-form entry rather than suggested preset values. Pressing Enter or `Add` creates an exact tag filter; selected tags remain removable inside the Tags popover only.
- Touch targets expand to 44px in the mobile filter sheet while keeping the compact desktop dimensions.
- Selected tags use subdued, status-chip-inspired neutral indicators rather than saturated brand-blue highlights.

These code-level changes have not yet been browser- or assistive-technology-verified.

## My Submissions status filter implemented

- My Submissions now offers only the backend-supported, owner-workflow Status control: All, Under review, Needs revision, and Published.
- The status is URL-backed with title search; thesis-detail return links preserve both, while the sidebar remains a clean default entry point.
- Repository metadata facets remain absent in My Submissions. Trashed stays out of the member surface because it is an administrative removal state.

## Parking lot

These are deliberately deferred until the immediate control-zone behaviour has been reviewed:

- A dedicated My Submissions filter contract, starting with review status. Do not expose repository metadata facets there unless the server query supports them.
- Facet result counts and type-ahead suggestions, if the catalog becomes large enough to warrant them.
- Richer result-context copy or saved searches. The current query label should remain intentionally quiet until its value is proven in use.
- Search-result sorting, pagination/load-more decisions, and advanced query syntax.
