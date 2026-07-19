# Unified UI/UX Audit & Vibe Check Report

This report combines the findings from the `/vibe-check`, `/ui-audit`, and `/impeccable-critique` workflows for the Alexandria Frontend repository, specifically targeting the Landing Page (`app/page.tsx`) and global styling (`app/globals.css`, `app/layout.tsx`).

---

## 🌊 Vibe Check Report
**Vibe Score**: 85 / 100
**Verdict**: Needs Polish

### 🚫 Major Vibe Killers
- [ ] **Issue**: Hardcoded HEX colors bypassing Design Tokens
  - **Fix**: In `app/page.tsx`, the primary CTA button uses `bg-[#368bfe]` and `hover:bg-[#2f78ff]`. This ignores the meticulous OKLCH design tokens defined in `globals.css` and `DESIGN.md`. Replace with `bg-[var(--color-brand-bright)]` (or equivalent Tailwind mapped utility) to ensure theme compatibility and token adherence.
- [ ] **Issue**: Functional UI font does not match the design guide
  - **Evidence**: `app/layout.tsx` assigns Geist to `--font-sans`, while Inter is assigned to `--font-inter`. `globals.css` uses `var(--font-sans)` for the body and Tailwind’s `font-sans`, so Inter is loaded but not selected as the default UI face. This is more specific than a fallback conflict: current functional UI will render in Geist unless a component explicitly opts into Inter.
  - **Fix**: Make one intentional choice. To follow `DESIGN.md`, assign Inter to `--font-sans` and remove Geist if it has no separate role; otherwise, amend the guide to document Geist as the functional UI font.

### 🎨 Design & Aesthetics
- **Color/Theme**: Generally follows the dark-charcoal aesthetic. The `conic-gradient` on the wordmark perfectly matches the design spec. However, hardcoding hex values in the CTA breaks the token system.
- **Typography**: The display wordmark uses the intended Khula treatment and tight tracking (e.g., `-0.06em`). The functional type system needs the font-variable correction above before it can be called fully aligned with the guide.
- **Spacing/Layout**: Tailwind's 4px grid system is respected (`mt-12`, `px-6`, `pb-28`), giving the landing page appropriate vertical breathing room.

### 🧠 UX & Polish
- **Feedback**: The CTA is covered by the global `:focus-visible` rule in `globals.css`, which gives it a soft token-based focus glow. This is a **pass in static review**, not a missing state; visual keyboard QA is still needed later to confirm that the glow is sufficiently distinct on the CTA and header controls.
- **Mobile**: Responsive typography using `clamp()` is present, but its benefit is undermined by non-wrapping hero text; see the validated additions below.

### 🤖 AI Slop Signals
- **Phantom Deps**: None found in the reviewed landing scope. `lucide-react` is explicitly declared in `Alexandria/package.json`.
- **Clone Clusters**: None found.
- **Over-Abstraction**: None found in the reviewed scope.
- **AI Tell**: The short JSX comments are harmless orientation markers, not evidence of AI authorship. The meaningful curation concern is narrower: a few landing decisions bypass the local token and responsive rules despite a detailed guide already existing.

### ✨ Quick Wins
1. Update `app/page.tsx` CTA button to use CSS variables for colors.
2. Remove `Geist` font from `app/layout.tsx`.
3. Resolve the title wrapping and touch-target findings below before treating the landing page as mobile-ready.

---

## 🎨 UI/UX Audit Report
**Verdict**: ❌ FAIL (Strict Token Adherence)

### 🚫 Anti-Patterns Found

1. **Hardcoded CSS (No Design Tokens)**: `app/page.tsx:35` uses `#368bfe`.
   - **[Fix]**: Use tailored palette token (`var(--color-brand-bright)`).

2. **Functional Typography Mismatch**: `app/layout.tsx:7` maps Geist to `--font-sans`, while `app/layout.tsx:9` maps Inter to a separate `--font-inter` variable that the global font stack never uses.
   - **[Fix]**: Deliberately wire Inter into `--font-sans` or document Geist as an approved exception in `DESIGN.md`.

### ✅ Pass Criteria
- [x] No default browser fonts (Google fonts are loaded).
- [ ] Functional UI typography matches `DESIGN.md` (Geist currently wins over Inter).
- [ ] CTA text contrast is sufficient for normal-size text; see the validated contrast finding below.
- [ ] Design Tokens used consistently (Failed due to CTA button).

---

## 🧐 Impeccable Critique Report
**Target**: Landing Page (`app/page.tsx`)
**AI-Slop Verdict**: Pass (with minor tells)
**Overall Verdict**: Needs polish

### Scores
- Visibility of status: 4
- Match with real world: 4 (Library/Archive theme hits perfectly)
- Consistency and standards: 3 (Token system broken on CTA)
- Error prevention: N/A
- Recognition over recall: 4

### Persona Tests
- **Skeptical first-time student**: 4/4 for message and action clarity. The existing subtitle already tells them they are entering a DCISM student repository; adding a thesis count should be treated as a content decision, not presumed necessary.
- **Mobile user with one hand**: Needs validation. The CTA itself is 44px high, but the theme toggle is 32px and non-wrapping hero copy is likely to be clipped on narrow viewports.

### Priority Issues
1. **[Medium] Token System Bypass on CTA**
   - **Why**: Hardcoded hex colors prevent dynamic theme switching and violate the `DESIGN.md` source of truth.
   - **Fix**: Swap `#368bfe` and `#2f78ff` for their corresponding `--color-brand-*` variables.

2. **[Low] Font Definition Clashing**
   - **Why**: Defining `Geist` and `Inter` for the same structural role adds unnecessary weight and risks rendering the wrong font stack.
   - **Fix**: Remove `Geist` entirely from `RootLayout`.

### Provocative Questions
- The landing page has a "Browse" button that links to `/home`. Does the user know what they are browsing before clicking? A subtle subtitle clarifying the volume of theses available might improve conversion.

### Next Workflow
- `/impeccable-polish` to clean up the token usage and font definitions.

---

## 🔎 Evidence-Backed Additions and Corrections

### Review boundary

This addendum is a static source review of `Alexandria/app/page.tsx`, `Alexandria/components/layout/minimal-header.tsx`, `Alexandria/components/layout/theme-toggle.tsx`, `Alexandria/app/layout.tsx`, `Alexandria/app/globals.css`, `Alexandria/package.json`, and `docs/DESIGN.md`. No browser, responsive-device, keyboard, or automated accessibility test was run. Findings labelled “likely” should be visually confirmed during the later, explicitly approved verification stage.

### Prioritized findings

1. **[High] Non-wrapping hero text can be clipped on narrow screens**
   - **Evidence**: The landing `<main>` has `overflow-hidden`. Both the `ALEXANDRIA` heading and the “Research and Capstone Hub” heading use `whitespace-nowrap`; the wordmark has a minimum `clamp()` size of `4rem`, while the tagline starts at `2.25rem`. The hero also has horizontal padding (`px-6`), further reducing its usable width.
   - **Why it matters**: On small phones, the text cannot wrap or scroll horizontally, so the right side is likely to disappear. This is a content-loss risk, not merely a cosmetic line-break preference.
   - **Direction for a future fix**: Preserve the intentional desktop lockup, but introduce a narrow-screen treatment that allows the tagline to wrap and reduces or reflows the wordmark/pronunciation pair. Do not simply remove overflow clipping without deciding how the decorative waves should behave.

2. **[High] The bright CTA background is below the normal-text WCAG AA contrast threshold with white text**
   - **Evidence**: `app/page.tsx` uses `#368bfe` with `text-white` at `text-base` (16px). Its approximate contrast against white is **3.3:1**; the hover color `#2f78ff` is approximately **4.0:1**. Normal-sized text needs 4.5:1 for WCAG AA.
   - **Why it matters**: “Browse” is the page’s sole conversion action. Its label should remain immediately legible in both the visual design and assistive accessibility review.
   - **Design tension to resolve**: `DESIGN.md` names the bright blue as the landing CTA color, but its accessibility notes also require AA contrast. A later implementation should keep the bright-blue identity while choosing an accessible foreground/background pairing; replacing a hex literal with the same bright token alone will not solve contrast.

3. **[Medium] Header controls do not meet the guide’s mobile target size**
   - **Evidence**: The theme toggle is `h-8 w-8` (32×32px) and the GitHub link is `h-10 w-10` (40×40px). `DESIGN.md` calls for at least 44px interactive targets on mobile and specifically describes the GitHub hit area as 49×48px.
   - **Why it matters**: The buttons are visually neat but less forgiving for one-handed touch use. This directly qualifies the earlier 4/4 mobile persona score.
   - **Direction for a future fix**: Expand the interactive hit areas while keeping the visible icons compact; the controls do not need to look larger to become easier to tap.

4. **[Medium] Theme-toggle hydration creates a small header layout shift**
   - **Evidence**: `ThemeToggle` returns `null` until `mounted` becomes true. After hydration, a 32px control plus a 16px flex gap appears next to the GitHub link.
   - **Why it matters**: The header’s right-side action group changes width after the first paint. It is modest, but it is an avoidable polish issue on the first screen users see.
   - **Direction for a future fix**: Reserve the control’s space in the server/initial render, then swap its visual state once the saved theme is known. Preserve the current early theme script, which already helps avoid a full-page light/dark flash.

5. **[Low] Theme-toggle icon colors bypass the documented semantic palette**
   - **Evidence**: The toggle uses Tailwind’s `text-amber-400` and `text-slate-500` rather than the project’s token layer. `DESIGN.md` reserves yellow for the pronunciation accent and otherwise emphasizes semantic theme-aware tokens.
   - **Why it matters**: This is not a visual failure today, but it gives a globally reused control colors that have no explicit dark/light contract in the design system.
   - **Direction for a future fix**: Decide whether the icons are intentional exceptions or assign them named, theme-aware tokens. Avoid treating the existing pronunciation yellow as a generic highlight without that decision.

### Confirmed non-findings / scope clarifications

- **The landing wordmark gradient is an approved exception.** Its raw blues match the exact gradient specified in `DESIGN.md`; it should not be grouped with the CTA’s token-bypass issue.
- **A global keyboard-focus treatment exists.** The soft `:focus-visible` glow uses `color-mix()` with `--color-brand-bright`, matching the guide’s preference for a restrained rather than saturated focus treatment.
- **No phantom `lucide-react` dependency was found.** It is declared directly in the manifest.
- **Loading, empty, error, submission feedback, and full repository browsing states are outside this landing-page review.** The page is intentionally static, so their absence here is not a finding.

---

## 🤝 Handoff Context: Avoiding “Vibe-Coded” UI

### Purpose and boundary

This section is guidance for future Alexandria work and for other projects. It is **not** a mandate to maximize shadcn usage, minimize Lucide usage, or copy Alexandria’s dark academic styling elsewhere. The actual standard is intentional authorship: use a library when it solves a real interaction problem, then make its behavior and appearance belong to the product.

### What the Alexandria evidence actually says

- The repository has a small shared UI layer (`Button`, `Dialog`, and `Calendar`) backed by Base UI, while many controls are still styled directly in feature components. This is a **fragmented primitive strategy**, not proof that the project needs to convert every control to shadcn.
- `lucide-react` is imported in 50 of the repository’s 103 TSX files. That number alone is not a quality failure: search, upload, close, calendar-navigation, status, and theme icons are legitimate semantic uses.
- The risk appears when a standard interaction is rebuilt locally without a shared accessibility/behavior contract. The FAQ rail is a useful example: it has a custom open-state animation and Unicode disclosure glyph, but no explicit `aria-expanded` or `aria-controls`. An Accordion/Disclosure primitive would be a strong fit **if** its styling is re-authored to match Alexandria.
- Conversely, blindly adopting default shadcn/base-nova visuals would also be a problem. Alexandria’s design guide favors sharp research-index rows, restrained radii, tokens, and minimal chrome; default rounded buttons, cards, and dialogs must be deliberately adapted before broad reuse.

### The rule for library choices

> **Use libraries for reliable behavior and accessibility. Use the product’s design system for visual authorship.**

| Situation | Good default | Avoid |
| --- | --- | --- |
| A conventional repeated interaction (dialog, date picker, disclosure, menu, combobox) | Start with the existing shared primitive or a headless/shadcn composition, then theme it with product tokens. | Rebuilding the interaction from local state and arbitrary classes on every page. |
| A product-specific surface (thesis result row, review field, archive metadata) | Build a custom composition from shared primitives and domain-specific content. | Forcing a generic Card/Bento component that makes research content look like SaaS marketing. |
| An icon-only action | Use a familiar icon, an accessible name, a visible focus state, and a tooltip when the icon is not universally obvious. | Adding an icon because there is empty space, or expecting the icon alone to explain an uncommon action. |
| A reusable visual style | Encode it once through tokens and a primitive variant only after it has proven repeatable. | Copying long utility strings or creating one-off raw colors/radii across unrelated components. |

### How Lucide becomes a “vibe-coded” tell

Lucide is not the tell. It becomes one when it is used as visual filler rather than information:

- every label receives an icon even though the icon adds no scanning value;
- multiple unrelated icons share the same accent weight, so the screen has no hierarchy;
- icons are used instead of clear labels for unfamiliar or consequential actions;
- a screen relies on the default icon set as its main personality, rather than typography, spacing, content, and brand rules;
- icons appear clickable without an action, hover, focus, label, or tooltip contract.

For Alexandria, the restrained archive aesthetic means icons should mainly orient, navigate, or signal state. They should not compete with thesis titles, metadata, filters, or review decisions.

### How shadcn becomes a “vibe-coded” tell

shadcn should not be treated as a collection of pre-approved aesthetics. It becomes a tell when its defaults are pasted in unchanged and the app starts to look like its registry rather than its own product.

Before adopting a shadcn/Base UI primitive, the coding agent should decide:

1. **Is this a repeated, conventional interaction?** If not, a custom domain composition may be clearer.
2. **Is there already a shared primitive in the repository?** Reuse or extend it before adding a parallel version.
3. **Which product tokens and shape rules apply?** Do not inherit default radius, surface, shadow, focus, or typography values accidentally.
4. **Which states must be provided?** At minimum: default, hover, focus-visible, disabled, loading where relevant, error where relevant, and mobile/touch behavior.
5. **Does the component still look like the product when its label and icons are removed?** The answer should come from hierarchy, spacing, typography, and color discipline—not from decorative component chrome.

### Agent handoff checklist

For every new interactive UI element, the coding agent should record or be able to answer:

- What user task does this help complete?
- Is this a standard interaction that should reuse an existing primitive?
- If it is custom, what domain need makes it custom?
- Which existing tokens, type scale, radius, and focus treatment does it use?
- Is an icon necessary, and can a first-time user understand the action without guessing?
- Are keyboard, screen-reader, touch, loading, empty, error, and success states considered in proportion to the feature?
- Does this addition make the interface more like the project’s own product—or more like a generic component demo?

### Future-project translation

Carry the **decision process**, not Alexandria’s exact choices. A finance app may need dense tables and restrained icons; a student community app may need warmer microcopy and more playful feedback. In both cases, the failure mode is the same: selecting libraries and surface patterns because they are familiar to the coding agent, rather than because they clarify the product for its users.

---

## 🧩 Proposed Approach: Controlled UI Unification (Planning Only)

### The problem in plain language

Alexandria does not need a front-end redesign. It needs a small, deliberate **shared-component contract**: when two controls serve the same user purpose, they should inherit the same interaction and visual rules unless there is a documented contextual reason not to.

“Inheritance” here should mean composition through shared React primitives, not a large object-oriented component hierarchy. A `BackLink` should own the shared arrow, typography, spacing, hover, focus, and token rules; each page should continue to own its route, label, and any domain-specific guard.

### Evidence: the back-control family

The current difference is real and is a good first slice for unification:

| Surface | Current presentation | Behavior that must remain local |
| --- | --- | --- |
| Profile | Outlined, pill-shaped, 36px back link with `ArrowLeft`, muted text, hover/focus treatment | Direct link to `/home` |
| Thesis detail | Near-identical outlined, pill-shaped, 36px back link with the same arrow and focus treatment | Destination depends on whether it came from “My Submissions” |
| Corrections workspace | Bare 13px text link with an arrow; it has separate CSS and no shared focus treatment | It intercepts navigation when unsaved work exists, then opens the existing exit/discard flow |

The correction page’s unsaved-work protection is a reason to keep its navigation handler local. It is **not** a reason for its back control to invent an unrelated visual language. The shared primitive must accept a normal link/click handler rather than owning navigation policy itself.

### Non-overhaul contract

The implementation must follow these constraints:

- Do not rearrange pages, rename routes, change labels, change destinations, or replace domain-specific guards.
- Do not perform a repository-wide class-name replacement or introduce a “universal component” with dozens of variants.
- Start with patterns proven to be duplicated in multiple current surfaces; leave true one-off/domain-specific UI alone.
- Preserve the existing approved visual direction. The first migrations should look recognizably like Alexandria, not like a newly installed component kit.
- Each component family is a separate, reviewable change. A back-control improvement must not be bundled with dialogs, cards, form fields, or token cleanup.

### Implementation sequence

1. **Create a read-only pattern inventory.**
   - Catalogue only recurring families: back/return controls, secondary outlined actions, confirmation dialogs, icon-only actions, form fields, status notices, and empty/loading states.
   - For each candidate, record its source files, user purpose, current visual rules, behavior, and a reason it is repeated. This prevents abstracting components that merely look similar but do different jobs.

2. **Choose one canonical contract per family before touching consumers.**
   - For the first slice, define a narrow `BackLink`/`BackAction` primitive: arrow position, text style, hit area, token-based border/background, hover, and focus-visible behavior.
   - Keep props small: destination or click behavior, visible label, and one justified appearance context such as `content` versus `sidebar`. A variant is allowed only when its placement changes the hierarchy; it must not become a page-name variant.
   - The recommended default is the existing profile/thesis-detail outlined control, because it already has a usable hit area and focus treatment. The corrections page can preserve its discard guard while adopting the contract after its sidebar/context variant is explicitly reviewed.

3. **Migrate one family in a small source-only change.**
   - Replace only the confirmed back-control duplicates first. Keep every route and unsaved-change handler exactly where it is.
   - Compare the affected pages side by side in human review. The expected visible outcome is consistency, not a new design.
   - If a surface genuinely needs a different hierarchy, document it as an intentional exception instead of silently letting a second style emerge.

4. **Repeat the same process for confirmation dialogs.**
   - Build on the existing shared Base UI `Dialog` primitive rather than replacing every dialog at once.
   - Standardize only the shared shell: title/description hierarchy, action order, destructive/secondary treatment, close/escape behavior, and focus management. Individual dialog copy, validation, loading state, and consequences stay in the feature that owns them.

5. **Unify tokens and spacing through the migrated primitives—not through a CSS purge.**
   - Once a shared component owns a repeated pattern, its padding, radius, gap, border, and state colors become the single edit point.
   - Raw values elsewhere should be addressed only when that specific component family is migrated. This prevents a broad token sweep from causing accidental visual changes across the app.

6. **Use a human review gate after every family.**
   - First review the changed source and the affected before/after surfaces.
   - Do not run tests, builds, or browser automation until the explicit instruction: **“Human review approved; run verification.”** Browser/E2E checks require separate approval.
   - Only begin the next family after the prior one is accepted or its exceptions are documented.

### What “done” looks like

- A user sees the same back-control language across comparable Alexandria surfaces.
- The correction workspace still protects unsaved work; its visual unification does not weaken its behavior.
- New dialogs, secondary actions, and icon buttons have an obvious component to reuse instead of a fresh local implementation.
- A future agent can explain every exception in one sentence: what contextual difference requires it.
- The number of direct, duplicated utility strings decreases gradually, but there is no single disruptive redesign release.

### Initial change boundary

The first implementation should be limited to the back-control family and its immediate shared primitive. Account identity and button contracts should be considered only after that slice is accepted; confirmation boxes follow as a separate dialog-family slice. This boundary is intentional: it proves the unification method on a visible but low-risk pattern before any broader component migration is authorized.

---

## 🔬 Additional Reuse and Interaction Inventory (No Changes Yet)

This inventory extends the back-control example. It distinguishes three things that are easy to conflate:

- **Shared behavior already exists but is not consistently consumed.** Reuse it before making another version.
- **A shared primitive exists but needs a product-specific composition.** Reuse its accessible mechanics, not necessarily its default look.
- **A control is genuinely domain-specific.** Keep its local logic, but still inherit basic button, dialog, token, and accessibility rules.

### 1. Bottom-left account/member indicator: likely accidental link dragging

The likely control described in the observation is the account link at the bottom of `components/layout/filter-sidebar.tsx`. It shows the role abbreviation and the user’s profile name (or role label) and links to `/profile` or `/login`.

- **Evidence**: it is rendered as a `next/link` with no `draggable={false}` and no intended drag-and-drop handler. Browsers permit native dragging of ordinary links, which can feel like the account chip is a misplaced image or detachable element.
- **Interpretation**: this is not a library-choice problem. It is a small interaction-artifact problem: a control that should read as a stable account action exposes browser-default drag behavior instead.
- **Future adjustment direction**: confirm the behavior manually, then suppress accidental dragging while preserving its link semantics, keyboard access, accessible name, focus treatment, and normal click/tap navigation. Do not convert it into a non-semantic `div` merely to stop dragging.

There is also a separate `RoleIndicator` in the shared header. Both draw from `getRoleDisplay`, so the data semantics are already shared; the missing layer is a deliberate shared **account-identity presentation contract** for compact header, sidebar footer, and icon-only contexts.

### 2. Long-form editor modals: repeated dialog work beside an existing dialog primitive

`ModalEditor` and `LessonsModal` in the upload flow each manually implement an overlay, backdrop click, Escape-key listener, focus timing, panel shell, close button, footer actions, and local button styling. Meanwhile, the repository already has an accessible Base UI-backed `components/ui/dialog.tsx` used by many other flows.

- **What should be reused**: the dialog foundation—modal semantics, focus containment/restoration, Escape handling, close behavior, and the shared surface/focus contract.
- **What should remain local**: the text draft lifecycle, word count/minimum validation, sortable lesson entries, save/discard consequences, and feature-specific copy.
- **Why this matters**: manual modal shells are a common vibe-coded artifact. They work in the happy path but quietly diverge on focus, screen-reader semantics, stacking, and close behavior. The correct response is not to force both editors into the same giant modal component; it is to compose their different content inside the same dialog foundation.

### 3. Confirmation dialogs: standardize the shell, not the decision logic

Several confirmation flows already use the shared `Dialog` primitive (for example upload confirmation, exit warnings, review decisions, and correction-workspace actions), while their header, action row, button treatments, and loading/disabled rules are authored separately.

- **Reuse candidate**: a small `ConfirmDialog` composition over the existing `Dialog`, with a consistent title/description structure, action ordering, cancel treatment, destructive treatment, and busy state.
- **Do not centralize**: the business action, error handling, mutation state, warning copy, or whether a guard is needed. Those belong to the feature that understands the consequence.
- **Adoption rule**: introduce it only after comparing at least three existing confirmation cases and identifying a stable common contract. A confirmation dialog for destructive moderation should not become visually or verbally identical to a harmless “save changes” confirmation.

### 4. Button vocabulary: the largest downstream source of visual drift

The same basic actions are currently expressed through a mixture of the shared `Button` primitive, raw Tailwind button strings, and CSS-module button classes. For example, the authentication prompt uses shared `Button`, while the upload editor and lessons modal define their own Cancel/Save controls with locally chosen radius, padding, colors, disabled state, and focus behavior.

The desired unification is a **small action vocabulary**, not “every button must use the same shape”:

| Action meaning | Shared contract to establish | Context that may still vary |
| --- | --- | --- |
| Primary commit (`Save`, `Submit`, `Continue`) | Brand token, readable contrast, loading/disabled behavior, focus, minimum hit area | Width and placement in a footer, form, or toolbar |
| Secondary/escape (`Cancel`, `Back`) | Muted hierarchy, focus, hover, label-first affordance | Whether it is text-like, outlined, or placed in a sidebar versus content panel |
| Destructive (`Discard`, `Remove`, `Log out`) | Danger token, confirmation threshold, disabled/busy state | Whether an action needs immediate confirmation |
| Icon-only utility | Fixed hit area, accessible name, focus, tooltip when needed | Icon itself and the surrounding toolbar density |

This is the layer that will naturally unify padding, gap, border, radius, and token use. It should be built slowly from the controls that have already repeated—not from an imagined complete design system.

### 5. Filter chips and drag affordances: do not generalize by appearance alone

The repository filter chips use visually styled labels backed by real checkbox inputs. That is a sensible accessibility pattern and should not be replaced simply because it looks different from a status pill or account chip. Likewise, the Lessons Learned reorder handle is an intentional drag affordance, backed by `dnd-kit`; it should remain draggable because dragging is part of its task.

The principle is:

> **Only interactive elements whose task includes reordering should drag. Links, identity badges, navigation pills, and ordinary chips should feel anchored.**

### Recommended inventory order before implementation

1. Back/return controls and secondary navigation links.
2. Account identity and role indicators, including accidental drag/select behavior and compact/full variants.
3. Primary, secondary, destructive, and icon-only button contracts.
4. Confirmation dialog shell and long-form dialog foundation.
5. Repeated form fields, status notices, and only then spacing/token consolidation.

This order starts with highly visible controls, but it intentionally postpones a global CSS cleanup. Each family should first be mapped, then given one shared contract, then migrated in a small reviewed slice.
