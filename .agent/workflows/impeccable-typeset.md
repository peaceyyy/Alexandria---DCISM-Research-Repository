---
description: Refine typography choices, hierarchy, scale, readability, and consistency
---

# /impeccable-typeset - Typography Refinement

---

## description: Refine typography choices, hierarchy, scale, readability, and consistency

> **Purpose**: Make text feel designed rather than default.
> **Source Inspiration**: Impeccable `/impeccable typeset`.
> **Scope**: Font choices, type scale, hierarchy, readability, consistency.

## When to Use

- Hierarchy feels flat.
- Text looks generic or accidental.
- Body copy is too small.
- Display type is just a default font in bold.
- One-off font sizes are scattered across components.
- Readability feels off.

## Workflow

### Step 1: Read Typography Context

Read:

- `docs/DESIGN.md`
- Brand/product voice docs.
- Current font imports and CSS variables.
- Representative text-heavy components.

### Step 2: Audit Five Dimensions

1. **Font choices**: do they match the brand, avoid invisible defaults, and stay
   within 2-3 families?
2. **Hierarchy**: are heading, body, captions, and labels visibly distinct?
3. **Scale**: is there a coherent fixed-rem app scale or fluid marketing scale?
4. **Readability**: body text minimums, line-height, contrast, 45-75 character
   line lengths for reading surfaces.
5. **Consistency**: repeated elements use repeated treatment, no random one-off
   overrides.

### Step 3: Propose Type System

Include:

- Display, body, mono, and UI font roles when needed.
- Type scale.
- Font weights.
- Line-heights.
- Letter spacing policy.
- Line-length constraints.
- Banned default/slop fonts when appropriate.

### Step 4: Apply Or Report

Patch type tokens and repeated style rules when implementation is requested.

Avoid adding external fonts without considering load/performance and project
constraints.

Update `docs/DESIGN.md` only after approval.

## Output Format

```markdown
## Impeccable Typeset Report

**Target**: [page/component/system]
**Verdict**: Apply / Needs font decision / Report only

### Typography Issues

- [issue]

### Proposed System

- Display: [font/role]
- Body: [font/role]
- Scale: [values]

### Verification

- [readability/responsive check]
```

## Related

- `/impeccable-layout` - Use when typography is fine but composition feels cramped.
- `/impeccable-polish` - Use after typography decisions are implemented.
- `/impeccable-document` - Records final typography in `docs/DESIGN.md`.
