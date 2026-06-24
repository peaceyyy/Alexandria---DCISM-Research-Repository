---
description: Browser-based single-element visual iteration with variants and explicit accept/discard
---

# /impeccable-live - Browser Visual Iteration

---

## description: Browser-based single-element visual iteration with variants and explicit accept/discard

> **Purpose**: Iterate on one real UI element in browser context.
> **Source Inspiration**: Impeccable `/impeccable live`.
> **Status**: Experimental adapter workflow. Requires browser/dev-server support.

## When to Use

- User wants to visually iterate on a real element.
- Element is already implemented with real content.
- The question is local to one hero, card, pricing tier, form section, etc.
- The user wants variants to compare before accepting any source change.

Do not use for:

- New greenfield features. Use `/impeccable-craft`.
- Whole-page redesigns. Use `/impeccable-impeccable` or a focused refine workflow.
- Half-written UI, placeholder copy, or default unstyled elements.

## Workflow

### Step 1: Check Requirements

Confirm:

- Dev server URL.
- Browser tool availability.
- Target element/page.
- `docs/PRODUCT.md` and `docs/DESIGN.md` availability when brand fit matters.
- Source file can be mapped from rendered element.

If source maps to generated/build output, do not write there. Route changes to
true source or stop.

### Step 2: Pick Element

Use browser inspection or user-provided target to identify one element.

Accept intent from:

- Freeform comment.
- Action chip style: bolder, quieter, distill, polish, typeset, colorize, layout,
  animate, delight, overdrive.
- User annotations, screenshots, or described strokes if available.

### Step 3: Generate Three Variants

Produce three genuinely different design archetypes, not three color riffs.

Each variant must:

- Respect `docs/PRODUCT.md` voice.
- Respect `docs/DESIGN.md` visual system unless user asks to explore outside it.
- Keep real content and context.
- Be production-quality enough to compare.

### Step 4: Present And Compare

Show:

- Variant A/B/C names.
- What changed.
- Trade-offs.
- Screenshots if browser tooling is available.

The user may:

- Accept one.
- Reject all.
- Ask for another round.

### Step 5: Write Only On Explicit Accept

Do not write source until the user accepts a variant.

If accepted:

1. Patch true source.
2. Verify rendered output.
3. Report the accepted variant and files changed.

If all discarded, leave original source unchanged.

## Output Format

```markdown
## Impeccable Live Report

**URL**: [dev server]
**Element**: [target]
**Intent**: [comment/chip]

### Variants

- A: [archetype/trade-off]
- B: [archetype/trade-off]
- C: [archetype/trade-off]

### Decision

- Accepted: A/B/C / None
```

## Related

- `/impeccable-craft` - Use for new features.
- `/impeccable-polish` - Use for final small fixes.
- `/prototype` - Use when exploring before source should change.
