# Unified UI/UX Audit & Vibe Check Report

**Updated:** 2026-07-28  
**Status:** Living handoff document for Alexandria’s frontend designer  
**Review boundary:** Static source review of the current landing, public shell, dialogs, and submission flow. Recent polish is recorded as implemented source work; this update does not replace cross-browser, assistive-technology, or responsive-device verification.

Alexandria should feel like a considered research archive: calm, direct, slightly tactile, and never promotional. Its personality should come from editorial hierarchy, purposeful feedback, and confidence in the content—not decorative effects or generic SaaS chrome.

---

## 🌊 Current Vibe Check

**Vibe score:** 89 / 100 (static, source-based)  
**Verdict:** Strong direction; the next work should concentrate on interaction accessibility and responsive certainty, not visual reinvention.

### What now feels intentional

- The public and admin sidebars use the same drawer-handle idea while preserving their different roles. The collapsed public rail retains the Alexandria mark, stacks utility actions vertically, and gives the brand room to breathe.
- The primary Contribute treatment is now restrained and width-aligned with the surrounding navigation rather than a large, saturated promotional button.
- Dialogs share the Base UI-backed dialog shell and use a light background blur. Long-form writing fields now have an inset, padded writing surface instead of text pressed against a focus border.
- The submission wizard allows users to inspect any step freely. It still validates the current step when advancing and validates all required material at final review; this preserves user agency without weakening the submission boundary.
- The active wizard step has one quiet motion cue—the motion-safe pulse ring—while normal transitions respect reduced-motion preferences.
- Submission materials now express their hierarchy: a required PDF is primary; the repository teaser is a quieter, genuinely optional sibling. File selection has readable attached, replace, remove, and error states.
- Keyword tags are neutral; semantic research-area and review-status colors remain meaningful rather than becoming arbitrary decoration.
- The landing CTA uses the brand-token background, the narrow hero can reflow, and header controls reserve 44px hit areas.

### Personality contract

| Keep | Avoid |
| --- | --- |
| Dark-first archive surfaces, fine separators, compact metadata, plain helpful copy | Neon glows, floating gradients, promotional cards, “startup dashboard” decoration |
| Blue only where a user must act or locate state | Making every icon, chip, border, and heading blue |
| One small response to a meaningful action | Ambient motion everywhere, bouncing controls, hover-only instructions |
| Clear file, review, and error states | Generic empty cards with no next action or silent failure |

The pulse ring is the right model: it earns its place by locating the active task. Future motion should follow that standard—short, transform/opacity based, and hidden under `prefers-reduced-motion`.

---

## ✅ Findings Closed or Materially Improved

| Previous concern | Current source status | Design result |
| --- | --- | --- |
| Landing CTA bypassed tokens and had weak contrast | Implemented | The CTA now uses the darker brand token with white text, rather than a raw bright-blue literal. |
| Narrow landing heading could clip | Implemented | The small-screen lockup can wrap/reflow while desktop keeps the intentional wordmark treatment. |
| Header actions were too small and theme mounting shifted the header | Implemented | The header reserves 44px controls, including theme-toggle space before hydration. |
| Sidebar felt cramped and collapse control floated beside the brand | Implemented | Brand, drawer handle, utilities, and Contribute hierarchy are separated more deliberately. |
| Modal shells and writing areas were inconsistent | Implemented | The shared dialog foundation is used; long-form text has padding, line height, and a soft focus state. |
| Wizard hard-gated future steps | Corrected | All steps remain reachable; validation stays at Continue and final review. |
| PDF and optional teaser competed visually | Implemented | Required material leads; optional enrichment follows in a quieter state model. |
| Icon-only removal actions obscured a consequential file decision | Implemented for submission materials | PDF and teaser actions now use visible labels. |

Do not reopen these as redesign work. They need normal visual and accessibility verification, but the design decision itself is settled unless a real usage problem appears.

---

## Priority Backlog

### P0 — Preserve access to core tasks

#### 1. Give Lessons Learned keyboard-equivalent reordering

**Problem:** `LessonsModal` uses only `PointerSensor`, and its drag handle is removed from the tab sequence. A keyboard user can edit or delete an entry but cannot change its order.

**Replace with:** Keep drag for pointer users, but add explicit accessible Move up / Move down controls (or a correctly configured keyboard sortable interaction) for each editable lesson. They should announce the new position in a polite live region.

**Principle:** Dragging may be an enhancement; it cannot be the only way to complete an ordered task.

**Expected result:** The list still feels compact and tactile with a drag handle, but no contributor is trapped in the original order.

#### 2. Establish the mobile contract for seven-step navigation

**Problem:** The wizard exposes seven labelled nodes in one horizontal row. The user-approved free navigation is correct, but the current 9px labels and connector widths need a real narrow-screen check; there is a credible crowding/overflow risk.

**Replace with:** On small screens, retain tappable step nodes but show the active label in the footer/status area and either horizontally scroll the node row with visible affordance or reduce inactive nodes to compact numbered controls. Do not hide steps or restore hard gating.

**Principle:** Responsive adaptation should reduce visual density, not remove user freedom.

**Expected result:** Every step remains directly reachable on a phone, with the current location obvious and no crushed labels.

#### 3. Repair FAQ disclosure semantics and focus treatment

**Problem:** `faq-modal.tsx` uses buttons visually, but its questions do not expose `aria-expanded` / `aria-controls`; the answer regions do not have stable IDs, and the trigger lacks an explicit focus-visible style.

**Replace with:** Compose the existing dialog with an accessible Disclosure/Accordion contract, or add the missing IDs, relationships, focus state, and reduced-motion treatment directly.

**Principle:** A conventional interactive pattern should be familiar to both keyboard and assistive-technology users, not merely look familiar.

**Expected result:** FAQ remains visually quiet, while its open state is unambiguous in every interaction mode.

### P1 — Make the system feel consistently cared for

#### 4. Decide the functional UI font deliberately

**Problem:** `app/layout.tsx` still maps Geist to `--font-sans`, while `DESIGN.md` names Inter as Alexandria’s functional UI font. Inter is loaded but not the active default.

**Replace with:** Either make Inter the actual `--font-sans` value, or amend `DESIGN.md` to make Geist the documented UI choice and remove the unused competing variable.

**Principle:** Typography is product infrastructure. Two undocumented defaults create visual drift even if each font is individually good.

**Expected result:** Navigation, filters, metadata, forms, and dialogs have one intentional voice across the application.

#### 5. Finish the ThemeToggle’s token and focus contract

**Problem:** The icon presentation still uses raw Tailwind amber/slate colors and has no explicit focus-visible treatment in its default branch.

**Replace with:** Add theme-aware sun/moon tokens or document a precise exception, then use the same restrained focus ring contract as other header controls.

**Principle:** Globally reused utilities should not become quiet exceptions to the system that every local component is expected to follow.

**Expected result:** The theme action feels like part of Alexandria in both modes and is dependable by keyboard.

#### 6. Create a route-level state inventory before adding more polish

**Problem:** Public discovery and upload now have thoughtful pending, empty, error, and review states, but those states have not been inventoried across profile, thesis detail, corrections, review, and admin routes.

**Replace with:** A read-only matrix for each route: loading, empty, error, permission-denied, success, and destructive/busy states. Only implement missing states after the matrix identifies a real gap.

**Principle:** A polished happy path cannot compensate for an unclear failure or permission state.

**Expected result:** The app feels dependable under ordinary failure—not just attractive in screenshots.

#### 7. Continue controlled component unification

**Problem:** A shared `ConfirmDialog` now exists, but buttons, secondary actions, and confirmation surfaces are still partly local. A broad component-library sweep would create churn without guaranteeing better UX.

**Replace with:** Inventory three or more instances of one repeated family, agree a narrow visual/behavior contract, migrate only that family, and document genuine exceptions. Suggested order: back controls → icon utilities → confirmation shells → repeated fields/status notices.

**Principle:** Reuse stable behavior and tokens; keep product-specific consequences local.

**Expected result:** Familiar actions look related without flattening Alexandria into a default component kit.

### P2 — Refine only after the above is settled

#### 8. Audit the legacy `components/upload/submission-popup.tsx`

**Problem:** This older upload surface still carries a separate visual and validation language. Its current route/reachability should be confirmed before it receives design work.

**Replace with:** Decide whether it is active. If it is, migrate it toward the active submission contract in one bounded slice; if not, mark it deprecated or remove it through the appropriate engineering process.

**Principle:** Parallel task flows are more harmful than minor visual inconsistency because they create different expectations for the same submission action.

#### 9. Add delight only at moments of progress or resolution

**Problem:** More animation would be easy to add, but the current direction is strongest when feedback serves a task.

**Replace with:** Reserve a single low-amplitude completion transition for a successful submission or an accepted review action, subject to product copy and motion testing. Avoid confetti, automatic card lifts, or decorative loading loops.

**Principle:** The desired tactileness is felt through causality—“I did this, the system acknowledged it”—not spectacle.

**Expected result:** Alexandria feels responsive and human without losing its academic composure.

---

## Designer Handoff Rules

For each proposed slice, state these before implementation:

1. **Problem:** what is hard to understand, reach, or trust today?
2. **Replacement:** what concrete visual/interaction contract changes?
3. **Principle or anti-pattern:** why this is better than the present pattern?
4. **Expected result:** what should a contributor, reader, or reviewer actually notice?

Then keep the slice small: one interaction family or one route state at a time. Reuse existing tokens and Base UI primitives first; do not introduce a new visual language, raw colors, broad gradients, or a universal component with page-name variants.

### Motion budget

- One persistent state cue per focused task is enough (for example, the current wizard-step ring).
- Use 150–250ms opacity/transform transitions for direct feedback only.
- Never make motion the only indicator of a changed state.
- Every nonessential animation must have a `motion-reduce` fallback.

### Accessibility baseline for every new interactive control

- Visible keyboard focus and a programmatic name.
- Minimum 44px touch target when used on touch layouts.
- Default, hover, focus-visible, disabled, busy, error, and success states considered in proportion to the action.
- Labels and errors remain associated through native semantics or ARIA.
- Do not rely on hover, color alone, drag alone, or an icon alone to explain an action.

---

## Verification Queue (after explicit human approval)

1. Keyboard-only journey: landing → browse → filters → FAQ → upload → final review.
2. Screen-reader spot checks: FAQ disclosure, wizard progress/current step, form errors, file actions, dialogs, and submission status.
3. Responsive checks: 320px, 375px, 768px, desktop; dark and light themes.
4. Motion-reduction checks for wizard navigation, dialog entry, FAQ disclosure, and any completion feedback.
5. File-state checks: valid/invalid PDF, replace/remove, optional teaser, drag-and-drop, and submit failure.

The frontend has moved beyond “make it lively.” The next standard is quieter and harder: every state should make a student feel that Alexandria anticipated the next question.
