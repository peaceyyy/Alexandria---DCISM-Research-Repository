---
description: comprehensive review of specs, plans, and roadmaps
---

# /review-plan — Concept, Specification, and Roadmap Review

---

## description: comprehensive review of specs, plans, and roadmaps

> **Purpose**: "Measure Twice, Cut Once". Validate ideas BEFORE code is written.
> **Modes**: Concept (Strategy), Spec (Technical), Roadmap (Execution)

**Project Workflows output convention**: Review project-facing planning artifacts from root `docs/`. Generated specs, roadmaps, phase plans, references, faces, and review notes should not live under `.agent/` or `.codex/`.

## When to Use

- "Review this project plan" (Concept)
- "Check this specification for gaps" (Spec)
- "Is this roadmap feasible?" (Roadmap)
- "Does this implementation plan match the user story?"

## Workflow

### Step 1: Detect Intent

**Concept Review**:

- **Input**: `docs/project_specification.md`
- **Check**: Feasibility, Clarity, Scope Creep.
- **Action**: "Does this solve the user's problem?"

**Spec Review**:

- **Input**: `docs/phases/.../plan.md` or `docs/phases/.../sub-phases/.../plan.md`
- **Check**: Completeness, Edge Cases, Test Strategy.
- **Action**: "Are all requirements covered?"

**Roadmap Review**:

- **Input**: `docs/roadmap/roadmap.md`
- **Check**: Dependency logic, Phase sizing, Parallelism.
- **Action**: "Is the execution path optimal?"

### Step 2: Execute Review

1.  **Read-Only Analysis**: Do not modify plans yet.
2.  **Constitution Check**: strict adherence to `CONSTITUTION.md` (Design Principles).
3.  **Feasibility Check**: cross-reference with `llms.txt` and tech stack.

### Step 3: Generate Report

```markdown
## 🧐 Plan Review Report

**Scope**: [File/Plan Reviewed]

**Verdict**: ✅ Approved / ⚠️ Needs Changes / ❌ Blocked

### 🌟 Commendations

- [Good strategic alignment]

### ⚠️ Gaps & Suggestions

1. **[Critical]** Missing Edge Case
   - _Issue_: No plan for offline state.
   - _Fix_: Add "Offline Sync" section to spec.

2. **[Minor]** Scope Creep
   - _Suggestion_: Move "Dark Mode" to Phase 2.

### 🛡️ Constitution Alignment

- [ ] KISS (Simple): ✅
- [ ] DRY (No redundancy): ⚠️ (See Minor Issue #2)
```

---

## Related

- `/review-code` - For reviewing the IMPLEMENTATION of this plan.
- `/plan` - To create the plans being reviewed.
