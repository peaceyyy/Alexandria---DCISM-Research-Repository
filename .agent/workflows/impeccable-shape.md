---
description: Produce a design brief through discovery before writing UI code
---

# /impeccable-shape - Design Brief Discovery

---

## description: Produce a design brief through discovery before writing UI code

> **Purpose**: Think before building. Capture intent, users, content, and constraints.
> **Source Inspiration**: Impeccable `/impeccable shape`.
> **Scope**: Brief only. No implementation.

## When to Use

- A feature is about to start.
- A ticket is vague.
- The user is writing UI code to discover the product decision.
- Before `/impeccable-craft` when you want the brief as a separate artifact.

## Workflow

### Step 1: Read Context

Read, when present:

- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- `README.md`
- `docs/project_specification.md`
- Existing pages/components related to the feature.

### Step 2: Discovery Interview

Ask follow-ups naturally, not as a rigid form.

Cover:

- Purpose and context.
- User and current state of mind.
- Content/data shown, realistic ranges, dynamic cases.
- Design goal and intended feeling.
- Reference examples and anti-references.
- Technical, content, accessibility, and localization constraints.

Expect roughly 5-10 focused questions when needed.

### Step 3: Produce Brief

Default artifact:

```text
.agent/briefs/[feature-name]-brief.md
```

If the user only wants chat output, do not write a file.

The brief is a compass, not a spec. It captures intent, not exact UI.

### Step 4: Approval Gate

Ask before writing the brief file.

Do not write implementation code.

## Output Format

```markdown
## Impeccable Shape Brief

**Feature**: [name]
**Purpose**: [why this exists]
**User**: [who and state of mind]
**Content**: [data/content]
**Feeling**: [intended emotional tone]
**Constraints**: [technical/accessibility/content]
**References**: [references]
**Anti-References**: [anti-references]
**Hand To**: `/impeccable-craft`, `/impeccable-impeccable`, `/vibe`, or manual implementation
```

## Related

- `/impeccable-craft` - Runs shape, then builds and visually iterates.
- `/grill-plan` - Use when product decisions need interrogation before design.
