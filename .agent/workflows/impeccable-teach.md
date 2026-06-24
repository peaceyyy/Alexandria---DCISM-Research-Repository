---
description: Create or refresh docs/PRODUCT.md and then offer to generate docs/DESIGN.md
---

# /impeccable-teach - Product Context Onramp

---

## description: Create or refresh docs/PRODUCT.md and then offer to generate docs/DESIGN.md

> **Purpose**: Teach the design system who the product is for, once per project.
> **Source Inspiration**: Impeccable `/impeccable teach`.
> **Scope**: Product strategy context. Visual details belong in `docs/DESIGN.md`.

**Project Workflows output convention**: Product and design context files belong under root `docs/`. Do not create or update root-level `PRODUCT.md`, root-level `DESIGN.md`, `.agent/`, or `.codex/` for project-facing documentation.

## When to Use

- First Impeccable command in a new project.
- Product audience, positioning, or brand voice has changed.
- Another Impeccable workflow reports missing product/design context.
- Before `/impeccable-document`, `/impeccable-craft`, or `/impeccable-live` on a project without context files.

## Workflow

### Step 1: Scan Project Context

Read, when present:

- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- `README.md`
- `docs/project_specification.md`
- Routes/pages/components that reveal product type.
- Brand assets or copy samples.

Infer a register hypothesis:

- **Brand**: landing, marketing, portfolio, campaign, where design is the product.
- **Product**: app UI, dashboards, tools, where design serves the task.

### Step 2: Ask Only What Cannot Be Inferred

Ask a short interview, 5-8 minutes in spirit:

- Confirm register: brand or product.
- Target users and state of mind.
- Product purpose.
- Brand personality in three concrete words.
- Named references and anti-references.
- Accessibility needs.
- Design principles.

Do not ask for colors, fonts, spacing, or pixel values. Those belong in `docs/DESIGN.md`.

### Step 3: Draft docs/PRODUCT.md

Use this docs file:

```text
docs/PRODUCT.md
```

Include:

- Register.
- Target users.
- Product purpose.
- Brand voice/personality.
- References.
- Anti-references.
- Design principles.
- Accessibility requirements.

### Step 4: Approval Gate

Before writing or overwriting `docs/PRODUCT.md`, show the proposed content and ask for approval.

If approved, write or update `docs/PRODUCT.md`.

### Step 5: Offer docs/DESIGN.md

After `docs/PRODUCT.md` is approved, offer to run `/impeccable-document`.

Default recommendation: yes, unless the user has a specific reason to delay.

## Output Format

```markdown
## Impeccable Teach Report

**Register Hypothesis**: Brand / Product
**Target**: `docs/PRODUCT.md`
**Verdict**: Ready to write / Needs answers / Blocked

### Inferred Context

- [finding]

### Questions

- [question]

### Proposed Next Step

- `/impeccable-document`
```

## Related

- `/impeccable-document` - Creates visual-side `docs/DESIGN.md` after product context exists.
- `/impeccable-impeccable` - Uses `docs/PRODUCT.md` and `docs/DESIGN.md` for general design work.
