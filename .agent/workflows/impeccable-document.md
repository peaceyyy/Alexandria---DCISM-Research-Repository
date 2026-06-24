---
description: Create or update docs/DESIGN.md as the project visual system source of truth
---

# /impeccable-document - DESIGN.md Generator

---

## description: Create or update docs/DESIGN.md as the project visual system source of truth

> **Purpose**: Capture the visual system in portable `docs/DESIGN.md`.
> **Source Inspiration**: Impeccable `/impeccable document`.
> **Scope**: Design-system documentation. Writes require approval.

**Project Workflows output convention**: Product and design context files belong under root `docs/`. Do not create or update root-level `DESIGN.md`, `.agent/`, or `.codex/` for project-facing design documentation.

## When to Use

- "Create docs/DESIGN.md."
- "Document the visual system."
- "Make the UI consistent across agents."
- Before a large redesign.
- After enough UI exists to extract colors, typography, components, and patterns.
- When `docs/DESIGN.md` is stale or missing.

## Workflow

### Step 1: Detect Mode

Use **scan mode** when UI code already exists.

Use **seed mode** when there is no implemented UI yet. Mark seeded files with:

```text
<!-- SEED: verify against implemented UI later -->
```

Do not fabricate a complete design system when there is no code to support it.

### Step 2: Read Context

Read, when present:

- `docs/PRODUCT.md`
- `docs/DESIGN.md`
- `README.md`
- `docs/project_specification.md`
- Brand or product docs.
- Global stylesheet, Tailwind config, CSS variables, theme files.
- Representative components: button, input, card, nav, modal, table.

If browser access is available and a local app is running, inspect rendered UI.

### Step 3: Extract System

Extract:

- Creative North Star.
- Color roles and tokens, preferably OKLCH.
- Typography families, scale, hierarchy, line-height, line length.
- Elevation and surface philosophy.
- Component character and reusable patterns.
- Do's and don'ts, including AI-slop anti-patterns.

Ask one grouped question for missing creative inputs instead of inventing them.

### Step 4: Generate Fixed Structure

Use exactly these top-level sections:

```markdown
# DESIGN.md

## 01 Overview
## 02 Colors
## 03 Typography
## 04 Elevation
## 05 Components
## 06 Do's and Don'ts
```

Fold layout, motion, and responsive rules into Overview or Components rather
than adding extra top-level sections.

### Step 5: Approval Gate

Before writing or overwriting `docs/DESIGN.md`, show:

- Whether this is seed or scan mode.
- Files inspected.
- Proposed Creative North Star.
- Any assumptions.
- Whether an existing `docs/DESIGN.md` will be changed.

Wait for approval before editing.

### Step 6: Optional Machine-Readable Sidecar

When useful for tooling, propose a matching `DESIGN.json` sidecar.

Do not write `docs/DESIGN.json` without approval. Keep `docs/DESIGN.md` authoritative for
humans and agents.

## Output Format

```markdown
## Impeccable Document Report

**Mode**: Seed / Scan
**Target**: `docs/DESIGN.md`
**Files Inspected**: [files]
**Verdict**: Ready to write / Needs creative input / Blocked

### Proposed North Star

[name and one-line meaning]

### Open Questions

- [question]
```

## Related

- `/impeccable-colorize` - Refines color tokens after `docs/DESIGN.md` exists.
- `/impeccable-typeset` - Refines typography after `docs/DESIGN.md` exists.
- `/impeccable-polish` - Uses `docs/DESIGN.md` as final-pass source of truth.
