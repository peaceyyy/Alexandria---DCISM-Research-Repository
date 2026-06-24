# BALAI Decision Records

This folder stores small project-specific decisions that future agents should
not rediscover or relitigate.

Think of it as a lightweight project constitution, not a session log and not a
full wiki.

## When To Add A Decision

Add a record only when the decision is likely to prevent future drift:

- Folder, naming, or artifact conventions.
- Domain vocabulary that differs from common meaning.
- Scope boundaries future agents may accidentally cross.
- Adapter/tooling choices.
- Design-system rules that affect future UI work.
- Repeated failure lessons.
- "Do not touch" or "only change this through X" constraints.

Do not record routine implementation details, transient debugging notes, or
anything already covered by `/handoff`, `/report-task`, `PRODUCT.md`,
`DESIGN.md`, or project specs.

## Naming

Use:

```text
YYYY-MM-DD-short-decision-name.md
```

Example:

```text
2026-05-27-canonical-agent-folder.md
```

## Record Shape

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

## Operating Rule

Decision records are user-gated. An agent may propose a record, but should not
write one unless the user explicitly asks or approves the proposed record.
