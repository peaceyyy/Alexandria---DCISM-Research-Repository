---
description: Stress-test plan language against project docs, glossary, and code reality
---

# /grill-docs - Documentation-Aware Grill Workflow

---

## description: Stress-test plan language against project docs, glossary, and code reality

> **Purpose**: Resolve fuzzy terms and contradictions between a plan, docs, and code.
> **Source Inspiration**: Matt Pocock's `grill-with-docs` skill.
> **Mode**: Question-first. Documentation writes require explicit approval.

**Project Workflows output convention**: Root `docs/` is the canonical home for project-facing docs, roadmaps, phases, faces, references, glossaries, and proposed documentation updates. `.agent/` and `.codex/` remain template/instruction infrastructure.

## When to Use

- "Grill this plan against the docs."
- "Check whether my terminology matches the codebase."
- "Stress-test this domain model."
- "Make sure the docs and plan agree."
- Before creating or updating project specs, ADRs, domain glossary, or roadmap files.

## Workflow

### Step 1: Identify Target And Context

Identify:

- Target plan, design, or proposal.
- Relevant docs.
- Relevant code areas.
- Active adapter, if tool behavior matters.

Common docs:

- `docs/project_specification.md`
- `docs/roadmap/roadmap.md`
- `docs/roadmap/phase-*.md`
- `docs/references/llms.txt`
- `docs/references/code-documentation/*.md`
- `README.md`
- `docs/adr/*.md` if present.

### Step 2: Discover Existing Language

Look for:

- Glossary or domain terms.
- ADRs or decision records.
- Naming conventions in code.
- Existing user stories or acceptance criteria.
- Contradictions between docs and implementation.

If no glossary exists, do not create one automatically. Propose one only after a term is resolved.

Recommended BALAI glossary target:

```text
docs/references/domain-glossary.md
```

### Step 3: Challenge Terms

When the user or plan uses a fuzzy term:

1. Name the ambiguity.
2. Compare it with existing docs/code.
3. Ask one focused question.
4. Provide your recommended canonical term.
5. Wait for the user's answer.

Examples of terms to challenge:

- "account" vs "user" vs "customer"
- "plan" vs "subscription" vs "weekly plan"
- "order" vs "checkout" vs "reservation"
- "draft" vs "published" vs "active"

### Step 4: Probe Concrete Scenarios

Use specific cases to test boundaries:

- Happy path.
- Empty state.
- Duplicate entity.
- Partial failure.
- Permission mismatch.
- Migration or rollback scenario.
- Cross-feature interaction.

Ask one scenario question at a time.

### Step 5: Surface Contradictions

If docs, plan, and code disagree, report the contradiction directly:

```markdown
**Contradiction**: [doc says X], but [code/plan says Y].
**Decision Needed**: Which source should become canonical?
**Recommendation**: [recommended source and why]
```

### Step 6: Documentation Update Gate

When a term or decision is resolved, propose the smallest doc update.

Do not edit docs until the user approves:

- File to update or create.
- Exact section to update.
- Proposed wording.
- Whether this is glossary, spec, roadmap, or ADR material.

Use ADRs sparingly. Offer an ADR only when all are true:

- Decision is hard to reverse.
- Future readers would wonder why it was chosen.
- There were real alternatives.

### Step 7: Handoff

End with:

```markdown
## Docs Grill Summary

**Target**: [plan/design]
**Docs Checked**: [files]
**Code Checked**: [files or none]

### Resolved Terms

- [term]: [meaning]

### Contradictions

- [contradiction]

### Proposed Doc Updates

- [file]: [change]

### Next Question Or Action

- [next]
```

## Related

- `/grill-plan` - Use when docs are not part of the review.
- `/review-plan` - Use for formal plan critique after terminology is resolved.
- `/research-loop` - Use to evolve this workflow from future examples.
