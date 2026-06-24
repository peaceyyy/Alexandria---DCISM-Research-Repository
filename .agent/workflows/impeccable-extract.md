---
description: Extract repeated UI tokens, components, and patterns into the design system
---

# /impeccable-extract - Design System Extraction

---

## description: Extract repeated UI tokens, components, and patterns into the design system

> **Purpose**: Consolidate real repeated UI drift into reusable primitives.
> **Source Inspiration**: Impeccable `/impeccable extract`.
> **Scope**: Extraction plus migration. No premature abstractions.

## When to Use

- Repeated button styles appear across many files.
- Multiple card/input/modal variants differ only slightly.
- Hex values, spacing, radii, shadows, or font sizes repeat.
- Product has shipped enough UI for patterns to be obvious.

Do not use when there are only one or two usages. Two usages are not a pattern.

## Workflow

### Step 1: Discover Drift

Read:

- `docs/DESIGN.md`
- Existing tokens/theme files.
- Shared component library.
- Target UI files.

Find repeated:

- Literal values: colors, spacing, radii, shadows, font sizes.
- Components: buttons, cards, inputs, modals.
- Composition patterns: form rows, toolbar groups, empty states.
- Type styles.
- Motion/easing/duration patterns.

### Step 2: Apply Extraction Threshold

Only extract when:

- Pattern appears three or more times.
- Intent is the same, not merely visually similar.
- Current use cases are clear enough to define an API.
- Migration can happen in the same pass.

Never extract because something might be reused later.

### Step 3: Propose Primitives

For each candidate:

- Token names.
- Component API with variants and sizes.
- Text style names.
- Motion tokens.
- Call sites to migrate.
- Old code to remove.

### Step 4: Approval Gate

Show the proposal before implementation.

Ask whether to extract now, narrow scope, or leave duplication in place.

### Step 5: Extract And Migrate

If approved:

1. Add the primitive.
2. Migrate all matching call sites in scope.
3. Remove duplicated/orphaned styles.
4. Update `docs/DESIGN.md` if the design-system contract changed.
5. Run verification.

Extraction without migration is incomplete.

## Output Format

```markdown
## Impeccable Extract Report

**Target**: [pattern]
**Instances Found**: [count/files]
**Verdict**: Extract / Do not extract / Needs narrower scope

### Candidate Primitive

- Name: [name]
- API: [variants/sizes/tokens]

### Migration Plan

- [file]

### Verification

- [check]
```

## Related

- `/impeccable-document` - Records the extracted system.
- `/impeccable-polish` - Use after extraction to clean drift.
