---
description: Capture a small project-specific decision record for future agents
---

# /capture-decision - Project Decision Record

---

## description: Capture a small project-specific decision record for future agents

> **Purpose**: Preserve durable project conventions without building a full wiki.
> **Source Inspiration**: Karpathy's LLM Wiki pattern and Hindsight-style retain/recall/reflect memory.
> **Scope**: Small user-gated decision records under `docs/decisions/`.

**Project Workflows output convention**: Save generated decision records under root `docs/`. Do not create project-facing decisions, faces, references, or planning artifacts inside `.agent/` or `.codex/`; those directories are template/instruction infrastructure.

## When to Use

- "Capture this decision."
- "Future agents should remember this."
- "Write this convention down."
- A term means something project-specific.
- A folder, adapter, or workflow convention has been settled.
- A repeated agent mistake should be prevented.
- A scope boundary was clarified.

## Do Not Use When

- The note is only useful for the current session.
- `/handoff` already captures the continuation context.
- `/report-task` already captures completed integration work.
- The fact belongs in `docs/PRODUCT.md`, `docs/DESIGN.md`, a project spec, or an ADR.
- The decision is obvious from code and unlikely to drift.

## Workflow

### Step 1: Classify The Memory

Pick one:

- **Convention**: naming, folders, file locations, tool choice.
- **Vocabulary**: project-specific term meaning.
- **Boundary**: in-scope vs out-of-scope.
- **Adapter**: platform-specific behavior.
- **Design**: visual/product rule that affects future UI.
- **Failure Lesson**: repeated mistake to avoid.

### Step 2: Check For Existing Record

Search `docs/decisions/` for related records.

If an existing active record covers the decision, update only if the user asks.
Otherwise, link to it in the response.

### Step 3: Draft Compact Record

Use:

```text
docs/decisions/YYYY-MM-DD-short-decision-name.md
```

Keep it short. Prefer one screen.

Required sections:

```markdown
# Decision: [short title]

**Date**: YYYY-MM-DD
**Status**: Active / Superseded / Revisit
**Scope**: [project, adapter, workflow, domain, design]
**Source**: [conversation, file, issue, doc]

## Decision

[one paragraph]

## Why

- [reason]

## Applies To

- [files, workflows, concepts]

## Do Not Do

- [future-agent guardrail]

## Revisit When

- [condition]
```

### Step 4: Approval Gate

Show the proposed record before writing unless the user already explicitly asked
to write it.

Ask whether to:

- Write as proposed.
- Shorten it.
- Change status/scope.
- Discard it.

### Step 5: Write And Link

If approved, create or patch the record.

Then report:

- File path.
- Decision title.
- One-line future-agent instruction.

## Principles

- **Raw vs synthesized**: do not pretend inferred context is sourced fact.
- **Small records**: one decision per file.
- **User-gated**: no automatic memory writes.
- **Anti-drift**: record only what prevents likely future confusion.
- **Portable**: keep Markdown readable by any agent.

## Related

- `/handoff` - Use for next-session continuation.
- `/report-task` - Use for completed task integration.
- `/research-loop` - Use when a decision came from comparing sources.
- `docs/decisions/README.md` - Decision record conventions, if present.
