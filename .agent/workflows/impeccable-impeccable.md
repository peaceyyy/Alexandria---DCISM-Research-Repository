---
description: General Impeccable design partner for work that spans multiple UI disciplines
---

# /impeccable-impeccable - General Design Intelligence

---

## description: General Impeccable design partner for work that spans multiple UI disciplines

> **Purpose**: Use full design intelligence when no narrower Impeccable workflow fits.
> **Source Inspiration**: Impeccable `/impeccable`.
> **Scope**: Freeform design work with strong defaults and anti-pattern checks.

## When to Use

- The user is unsure which Impeccable command fits.
- Work spans layout, type, color, motion, copy, and interaction.
- A vague UI request needs a strong design direction.
- Specialized commands do not map cleanly.

Use specialized commands when the problem is clearly color, typography, layout,
polish, critique, document, teach, shape, live, or extract.

## Workflow

### Step 1: Load Product And Design Context

Read:

- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- Target page/component.
- Relevant design skills/references.

If `docs/PRODUCT.md` is missing, recommend `/impeccable-teach`.

If `docs/DESIGN.md` is missing, recommend `/impeccable-document`.

### Step 2: Choose Register-Aware Defaults

Use `docs/PRODUCT.md` register:

- **Brand**: marketing, landing, portfolio, campaign; design is part of the product.
- **Product**: dashboards, tools, app UI; design serves task completion.

Do not push brand-heavy typography or motion onto product dashboards.

Do not flatten expressive brand pages into generic app UI.

### Step 3: Commit To Direction Before Code

Name the aesthetic direction before implementation:

- What it should feel like.
- What it should avoid.
- Which design axes matter most.
- Which Impeccable sub-workflow would handle follow-up refinement.

### Step 4: Build Or Advise

If implementation is requested, build with browser verification when possible.

If not, return a design plan, critique, or next-command recommendation.

## Output Format

```markdown
## Impeccable Direction

**Target**: [page/component]
**Register**: Brand / Product
**Direction**: [specific aesthetic]
**Avoid**: [anti-patterns]
**Next Command**: [specific impeccable workflow if needed]

### Plan

- [step]
```

## Related

- `/impeccable-teach` - Establishes `docs/PRODUCT.md`.
- `/impeccable-document` - Establishes `docs/DESIGN.md`.
- `/impeccable-craft` - Use for full discovery-build-iterate flow.
