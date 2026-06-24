---
description: Refine layout, spacing, visual rhythm, density, hierarchy, and responsive structure
---

# /impeccable-layout - Layout And Rhythm Refinement

---

## description: Refine layout, spacing, visual rhythm, density, hierarchy, and responsive structure

> **Purpose**: Fix pages that feel crowded, flat, random, or rhythm-less.
> **Source Inspiration**: Impeccable `/impeccable layout`.
> **Scope**: Arrangement of the right content. Not content subtraction.

## When to Use

- "Everything feels crowded."
- "It reads like a wall."
- "I do not know where to look first."
- Equal padding everywhere makes the page monotonous.
- Card grids feel generic.
- Content runs edge-to-edge.

If the page has too much content, use a distillation/planning pass before layout.

## Workflow

### Step 1: Read Context

Read:

- `docs/DESIGN.md`
- Target page/component.
- Relevant layout primitives and shared components.
- Existing responsive breakpoints.

If browser access is available, inspect desktop and mobile renders.

### Step 2: Audit Five Dimensions

1. **Spacing**: consistent scale, tight related groups, generous separation
   between groups.
2. **Visual hierarchy**: primary action visible within two seconds.
3. **Grid and structure**: underlying grid, alignment, baselines.
4. **Rhythm**: alternation between dense and spacious regions.
5. **Density**: density matches content type and use case.

### Step 3: Decide Layout Strategy

Choose only what fits the product:

- Symmetric for restrained professional surfaces.
- Asymmetric for editorial, expressive, or brand-led surfaces.
- Dense but organized for operational dashboards.
- Generous air for landing, portfolio, editorial, or premium surfaces.

### Step 4: Apply Or Report

Patch layout when implementation is requested.

Typical changes:

- Normalize spacing scale.
- Add or repair grid.
- Rebalance columns.
- Replace decorative borders with spacing-driven grouping.
- Pull primary actions into clearer visual positions.

Stop and ask if hierarchy problems require product/content decisions.

## Output Format

```markdown
## Impeccable Layout Report

**Target**: [page/component]
**Verdict**: Apply / Needs content decision / Report only

### Layout Diagnosis

- [issue]

### Proposed Changes

- [change]

### Responsive Notes

- [desktop/mobile behavior]
```

## Related

- `/impeccable-typeset` - Use when text hierarchy is the main problem.
- `/impeccable-polish` - Use after layout is structurally sound.
- `/prototype` - Use when testing alternative layouts before committing.
