---
description: Run the full design flow from discovery brief to build to visual iteration
---

# /impeccable-craft - End-To-End UI Build Flow

---

## description: Run the full design flow from discovery brief to build to visual iteration

> **Purpose**: Shape the design, build it, then visually iterate.
> **Source Inspiration**: Impeccable `/impeccable craft`.
> **Scope**: New features from zero. Not for small touch-ups.

## When to Use

- Starting a new feature from scratch.
- The user knows what to build but not how it should look.
- The feature needs structured discovery before implementation.
- Visual iteration should be part of the default flow.

Do not use for small changes or finished UI. Use `/impeccable-polish`,
`/impeccable-critique`, or a focused refinement command instead.

## Workflow

### Phase 1: Shape

Run `/impeccable-shape` internally.

Discovery is non-skippable:

- Purpose.
- Users.
- Content.
- Constraints.
- Goals.
- Anti-references.

Produce a design brief and let the user push back before code.

### Phase 2: Load References

Read:

- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- Shape brief.
- Relevant design reference skills/docs for spatial layout, typography, color,
  motion, interaction, responsive behavior, and UX writing.

If `docs/PRODUCT.md` is missing, recommend `/impeccable-teach`.

If `docs/DESIGN.md` is missing, recommend `/impeccable-document`.

### Phase 3: Build

Implement deliberately:

1. Structure.
2. Spacing and hierarchy.
3. Typography and color.
4. States.
5. Motion.
6. Responsive behavior.

Every decision should trace back to the brief or design system.

### Phase 4: Visual Iteration

Open the result in the browser when possible.

Check against:

- Shape brief.
- `docs/PRODUCT.md`.
- `docs/DESIGN.md`.
- Anti-pattern catalog.

Refine until the result matches the intent. The first working version is not the
shipped version.

## Output Format

```markdown
## Impeccable Craft Report

**Feature**: [feature]
**Brief**: [path or summary]
**Files Changed**: [files]
**Browser Checks**: [checks]
**Verdict**: Built / Needs iteration / Blocked

### Design Decisions

- [decision traced to brief]

### Verification

- [command/screenshot/manual check]
```

## Related

- `/impeccable-shape` - Use when you only want the brief.
- `/impeccable-live` - Use for element-level visual iteration after build.
- `/prototype` - Use when the product decision is too uncertain for production code.
