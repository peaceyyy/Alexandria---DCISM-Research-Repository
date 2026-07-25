# Navigation and Filter Refactor Plan

> [!TIP]
> **Plan Status: READY** — The public-shell boundary and the detail-page return behavior are confirmed.

## Goal

Pivot Alexandria's public layout from a "filters-in-the-sidebar" model to a "navigation-sidebar + unified-top-filters" model. This creates one coherent home for repository discovery while preserving a focused reading experience on detail pages.

## Product contract

- **Workspace Sidebar**: The left sidebar transitions from housing filters to housing global navigation and workspace features.
  - Active links: `Home/Browse` and `My Submissions`.
  - `My Submissions` appears only for signed-in users.
  - A quiet, non-interactive `Coming later` disclosure may appear below the active navigation to signal planned library features. Do not add disabled links for `Bookmarks`, `Drafts`, or `Settings`.
  - The sidebar retains its collapsibility to save horizontal space.
- **Public-shell scope**: The shared public sidebar is used by Home, thesis-detail, and profile pages. The staff `AdminSidebar` remains a separate workspace and is out of scope.
- **Unified Top Filters**: All search and filtering moves to the main content area's "Control Zone".
  - The text query field remains at the top.
  - Tags are integrated closely with the search bar as one compact filter control, not embedded into the text input.
  - A horizontal row of compact dropdown menus (using Shadcn `Select` or `Popover`) is introduced for `Research Area`, `Department`, `Study Type`, and `Year`.
- **Focused reading**: Thesis-detail pages do not show repository search or filter controls. Their Back-to-results affordance preserves the complete originating browse URL, including query and filters.
- **Responsive Parity**: The mobile drawer becomes public navigation. The Home control zone exposes a `Filters (n)` trigger that opens mobile-friendly facets and keeps the active-filter count plus Clear all visible when closed.

## Tasks

- [ ] Define the shared public `WorkspaceSidebar` component to replace `FilterSidebar` and `ContextSidebar`; expose Browse and role-appropriate My Submissions, plus a non-interactive Coming later disclosure if included.
- [ ] Create a `FilterBar` component for the Home control zone. Implement compact popover/dropdown controls for `Study Type`, `Department`, `Year`, `Research Area`, and tags without changing the existing facet behavior.
- [ ] Relocate the `TagMultiSelect` functionality so it integrates smoothly with the `RepositorySearchBar`.
- [ ] Replace the duplicate public sidebar implementations, preserve collapse/account/contribute behavior, and leave `AdminSidebar` untouched.
- [ ] Preserve the full browse URL when a result is opened; render a detail-page Back-to-results link that restores the original query, facets, and page.
- [ ] Update the mobile layout: navigation stays in its drawer, while `Filters (n)` opens the Home facets in a mobile-friendly sheet or popover.
- [ ] Verify that all URL-backed state (`q`, `area`, `tag`, etc.) still updates correctly when using the new top-level filter components.

## Migration notes

- This is a public-shell/frontend refactor. No backend or database migration is expected because the current URL-backed discovery contract remains unchanged.
- The plan must not alter the existing Admin workspace shell.
- Coming-later content must be non-interactive and must not present as a disabled navigation destination.

## Done when

- The left sidebar functions as the shared public navigation rail; the Admin shell remains independent.
- A user can apply any combination of text search, tags, and category filters from a unified control zone at the top of the repository view.
- Opening a thesis and returning to results restores the original search, filters, and page.
