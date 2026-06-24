---
description: Stress-test a plan or design through one-question-at-a-time interrogation
---

# /grill-plan - Plan Interrogation Workflow

---

## description: Stress-test a plan or design through one-question-at-a-time interrogation

> **Purpose**: Sharpen a plan before execution by resolving unclear decisions.
> **Source Inspiration**: Matt Pocock's `grill-me` skill.
> **Mode**: Read-first, question-first, no implementation.

**Project Workflows output convention**: Project-facing plans, roadmaps, phases, faces, references, and grill follow-up artifacts belong under root `docs/`. Do not write them into `.agent/` or `.codex/`; those are template/instruction infrastructure.

## When to Use

- "Grill this plan."
- "Stress-test this design."
- "Interrogate this roadmap."
- "Find holes before I build."
- Before `/plan`, `/roadmap`, `/breakdown-phase`, or a risky implementation phase.

## Workflow

### Step 1: Identify Target

Find the plan or design being grilled.

Common targets:

- `docs/project_specification.md`
- `docs/roadmap/roadmap.md`
- `docs/roadmap/phase-*.md`
- `docs/phases/.../plan.md`
- `docs/phases/.../sub-phases/.../plan.md`
- User-pasted plan text.

If no target is obvious, ask the user which plan to grill.

### Step 2: Read Existing Context

Read only the context needed to ask better questions:

- Target plan or design.
- Relevant README or architecture notes.
- Relevant `docs/references/llms.txt` entries, falling back to `.agent/protocols/references/llms.txt` only for template-level context.
- Relevant code if the question can be answered by inspection.

If a question can be answered from files, inspect files instead of asking.

### Step 3: Build Decision Tree

Identify unresolved branches:

- Goal and user value.
- Scope boundaries.
- Data model and ownership.
- API and integration contracts.
- Failure modes and edge cases.
- Test and verification strategy.
- Rollout, migration, or rollback concerns.
- Human decisions that cannot be inferred from code.

### Step 4: Ask One Question At A Time

For each question:

1. Ask one focused question.
2. Provide your recommended answer.
3. Explain the trade-off briefly.
4. Wait for the user's response before continuing.

Do not dump a long questionnaire.

### Step 5: Track Resolved Decisions

Maintain a compact running list:

```markdown
## Resolved

- Decision: [answer]
- Rationale: [why]
- Follow-up artifact: [plan/spec/doc to update later]

## Still Open

- [question]
```

Do not edit the plan unless the user explicitly asks.

## Exit Criteria

Stop when:

- All high-risk branches are resolved.
- The remaining questions are low-impact.
- The user asks to stop.
- The plan is blocked by a decision the user must make later.

## Output Format

```markdown
## Grill Summary

**Target**: [file or pasted plan]
**Verdict**: Ready / Needs revision / Blocked

### Resolved Decisions

- [decision]

### Remaining Risks

- [risk]

### Recommended Next Action

- [next workflow or edit]
```

## Related

- `/review-plan` - Use after grilling to produce a formal review.
- `/plan` - Use when the plan needs to be rewritten.
- `/breakdown-phase` - Use after high-level decisions are settled.
