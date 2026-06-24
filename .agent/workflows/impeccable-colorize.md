---
description: Refine UI color strategy with OKLCH tokens, semantic roles, and contrast hierarchy
---

# /impeccable-colorize - Strategic Color Refinement

---

## description: Refine UI color strategy with OKLCH tokens, semantic roles, and contrast hierarchy

> **Purpose**: Add or repair color without creating AI-slop palettes.
> **Source Inspiration**: Impeccable `/impeccable colorize`.
> **Scope**: Color tokens, semantic roles, contrast, and restraint.

## When to Use

- Interface is functional but emotionally flat.
- Everything is gray, beige, or visually same-weight.
- Brand color exists but is not used strategically.
- Primary actions do not stand out.
- Charts, categories, or statuses need a controlled accent system.

Do not use when the interface is already too colorful. Use critique or a quieter
pass first.

## Workflow

### Step 1: Find Color Source

Read:

- `docs/DESIGN.md`
- Brand docs or product spec.
- CSS variables, Tailwind config, theme files.
- Current component styles.

If no brand hue exists, ask the user for one before choosing a palette.

### Step 2: Audit Current Color

Check:

- Is the primary action using the strongest expression of the brand hue?
- Are secondary accents muted or tinted, not competing full colors?
- Are neutrals subtly tinted toward the brand hue at low chroma?
- Do charts/categories use a limited intentional accent set?
- Are lightness steps perceptually balanced?
- Are contrast ratios sufficient for text and controls?

### Step 3: Propose Color System

Prefer OKLCH tokens.

Include:

- Accent hue.
- Neutral tint strategy.
- Semantic roles: background, surface, border, text, muted, accent, danger,
  warning, success.
- Light and dark variants if the app supports themes.
- Banned palette notes, especially purple-pink gradients, cyan neon, and generic
  AI dark-mode glow.

### Step 4: Apply Or Report

If the user asked for implementation, patch the smallest token/style surface.

If not, produce a report and proposed token diff only.

Update `docs/DESIGN.md` only after explicit approval.

## Output Format

```markdown
## Impeccable Colorize Report

**Target**: [page/component/system]
**Brand Hue**: [OKLCH or source]
**Verdict**: Apply / Needs brand decision / Report only

### Proposed Tokens

- `--color-accent`: [value]

### Changes

- [change]

### Risks

- [contrast/theme risk]
```

## Related

- `/impeccable-document` - Establishes `docs/DESIGN.md`.
- `/impeccable-critique` - Use first if the palette already feels loud or generic.
- `/impeccable-polish` - Final pass after colors are set.
