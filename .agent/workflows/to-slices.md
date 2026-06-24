---
description: Convert a phase or sub-phase plan into demoable vertical implementation slices
---

# /to-slices - Vertical Slice Breakdown

---

## description: Convert a phase or sub-phase plan into demoable vertical implementation slices

> **Purpose**: Turn capability chunks into independently buildable and verifiable work packets.
> **Source Inspiration**: Matt Pocock's `to-issues` tracer-bullet slicing.
> **Scope**: Planning artifact only. Does not publish issue-tracker tickets by default.

**Project Workflows output convention**: Read and write generated planning artifacts under root `docs/`. `.agent/` and `.codex/` are instruction/template infrastructure, not the destination for project-facing slice, phase, face, reference, or roadmap outputs.

## When to Use

- "Turn this phase into vertical slices."
- "Break this sub-phase into implementation packets."
- "This plan is too horizontal."
- "Make these tasks AFK-agent ready."
- After `/breakdown-phase`, before implementation begins.

## Input

Use one of:

- `docs/roadmap/roadmap.md`
- `docs/roadmap/phase-*.md`
- `docs/phases/[phase]/breakdown.yaml`
- `docs/phases/[phase]/sub-phases/[id]/plan.md`
- User-pasted phase or sub-phase plan.

If the target is unclear, ask which phase or sub-phase to slice.

## Core Principle

A vertical slice is a narrow complete path through the system.

Prefer:

```text
Guest can submit mock checkout and see success or validation error.
```

over:

```text
Create checkout database tables.
Create checkout API.
Create checkout page.
Add checkout tests.
```

Each slice should be demoable or objectively verifiable on its own.

## Workflow

### Step 1: Read The Source Plan

Extract:

- Phase mission.
- Sub-phases or capability chunks.
- Success criteria.
- Known dependencies.
- Files likely touched.
- Human decision points.
- Verification expectations.

Use project domain vocabulary from existing docs where available.

### Step 2: Detect Horizontal Tasks

Flag tasks grouped only by layer:

- Database only.
- API only.
- UI only.
- Tests only.
- Documentation only.

Do not delete horizontal tasks. Reframe them as part of vertical slices unless a
foundation task is genuinely required first.

### Step 3: Draft Slices

For each slice, define:

- **Title**: short outcome-oriented name.
- **Type**: `AFK` or `HITL`.
- **User or system behavior**: what becomes possible.
- **Scope**: the thinnest complete path.
- **Acceptance criteria**: 2-5 checkboxes.
- **Likely files**: broad paths only when useful.
- **Tests or verification**: command, manual check, screenshot, or inspection.
- **Blocked by**: other slices or unresolved decisions.

Type definitions:

- **AFK**: Can be implemented by an agent without human judgment once started.
- **HITL**: Requires human decision, design review, credential access, or manual validation.

Prefer AFK where safe. Mark HITL honestly when judgment is needed.

### Step 4: Dependency Check

Order slices so blockers come first.

Rules:

- A slice should not depend on a later slice.
- Avoid circular dependencies.
- Split any slice that has unrelated blockers.
- Merge slices only when separated work would not be verifiable.

### Step 5: Ask For Granularity Approval

Present the proposed slices and ask:

- Is this too coarse or too fine?
- Are the dependencies correct?
- Should any slices be merged or split?
- Are HITL and AFK labels accurate?

Do not create or edit downstream task files until the user approves.

### Step 6: Optional Artifact Update

After approval, ask whether to write the slice plan.

Recommended target:

```text
docs/phases/[phase]/slices.md
```

If writing to an existing file, patch only the slice section.

## Output Format

```markdown
## Vertical Slice Plan

**Source**: [phase or sub-phase]
**Verdict**: Ready / Needs user decision / Blocked

### Slice 1: [Outcome]

**Type**: AFK / HITL
**Behavior**: [demoable behavior]
**Scope**: [thin complete path]
**Acceptance Criteria**:

- [ ] [criterion]
- [ ] [criterion]

**Likely Files**:

- `[path or area]`

**Verification**:

- [command or manual check]

**Blocked By**: None / [slice or decision]
```

## Related

- `/roadmap` - Defines major project phases.
- `/breakdown-phase` - Defines sub-phases and dependency structure.
- `/prototype` - Use when a slice depends on an uncertain design or state model.
- `/handoff` - Use when passing approved slices to a fresh agent.
