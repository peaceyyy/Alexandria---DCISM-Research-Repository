---
description: Final UI refinement pass for spacing, states, typography, contrast, motion, and copy
---

# /impeccable-polish - Final UI Pass

---

## description: Final UI refinement pass for spacing, states, typography, contrast, motion, and copy

> **Purpose**: Move a functionally complete feature from good to refined.
> **Source Inspiration**: Impeccable `/impeccable polish`.
> **Scope**: Small refinements only. Not a redesign.

## When to Use

- Feature is functionally complete.
- Nothing is obviously broken, but it feels unfinished.
- UI has drifted from `docs/DESIGN.md`.
- Before shipping or handoff.

Do not use on unfinished work with TODO placeholders. Finish the feature first.

## Workflow

### Step 1: Confirm Readiness

Check:

- Feature works.
- No obvious TODO placeholders.
- Main flows are implemented.
- Relevant tests or manual checks already pass.

If not ready, stop and name the blocking work.

### Step 2: Discover Design System

Read:

- `docs/DESIGN.md`
- Existing tokens and shared components.
- Relevant page/component code.
- Prior critique/audit notes if present.

### Step 3: Inspect Six Polish Dimensions

1. **Visual alignment and spacing**: grid, baseline, optical icon alignment,
   consistent scale.
2. **Typography**: hierarchy, line length, line-height, widows/orphans, headline
   fit.
3. **Color and contrast**: token usage, theme parity, focus indicators, WCAG
   basics.
4. **Interaction states**: hover, focus, active, disabled, loading, error,
   success.
5. **Transitions and motion**: easing, reduced motion, no layout jank.
6. **Copy**: consistent voice, no placeholder strings, no stray TODOs.

### Step 4: Patch Small

Make small targeted fixes only.

Stop and recommend `/impeccable-layout` or `/impeccable-critique` if the work
requires structural redesign.

### Step 5: Verify

Run the active adapter's appropriate checks:

- Unit/component tests if relevant.
- Browser screenshot inspection for UI changes.
- Responsive spot checks.
- Contrast/static checks if available.

## Output Format

```markdown
## Impeccable Polish Report

**Target**: [page/component]
**Readiness**: Ready / Not ready
**Verdict**: Polished / Needs structural design pass / Blocked

### Fixes

- [small fix]

### Verification

- [check]

### Remaining Risks

- [risk]
```

## Related

- `/impeccable-critique` - Use before polish for diagnostic review.
- `/impeccable-layout` - Use when spacing fixes require structural changes.
- `/impeccable-typeset` - Use when typography is the main issue.
