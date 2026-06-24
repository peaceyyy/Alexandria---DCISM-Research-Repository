---
description: Create integration-ready task handoff report
---

# /report-task — Generate Task Completion Report

---

## description: Create integration-ready task handoff report

> **Purpose**: Facilitate seamless integration between parallel agents/phases.
> **Scope**: Completed sub-tasks, modules, or features.

**Project Workflows output convention**: Save generated task reports under root `docs/`, preferably near the phase or sub-phase they describe. Do not write project-facing reports into `.agent/` or `.codex/`.

## When to Use

- "Task completed - generate report"
- "Hand this off to the next agent"
- "Document my work for integration"

## Workflow

### Step 1: Gather Context

**Current Phase**: [Phase Name]
**Task Number**: [Task ID]
**Files Modified/Created**: [List]
**Tests Run**: [Status]

### Step 2: Structure Report

**Generate**: `docs/phases/[phase]/sub-phases/[id]/TASK_{ID}_COMPLETION_REPORT.md` when phase context exists, otherwise `docs/reports/TASK_{ID}_COMPLETION_REPORT.md`.

### Step 3: Required Sections

1.  **Executive Summary**:
    - Build status (Success/Partial/Blocked)
    - Key files touched.

2.  **Integration Interface**:
    - Exports/Imports needed by others.
    - Configuration updates (env vars, constants).
    - Dependencies.

3.  **Validation Checklist**:
    - ✅ Requirements met.
    - ✅ Tests pass.
    - ✅ Error handling verified.

4.  **Testing Instructions**:
    - How to verify independently (CLI commands).
    - Expected output.

5.  **Handoff Notes**:
    - Known blockers.
    - Next steps for integration.

---

## Output Format

```markdown
# Task 2.1 Completion Report: User Model

## Summary

Build Status: ✅ Success
Implemented User SQLAlchemy model with password hashing.

## Integration Interface

- **Model**: `backend.src.models.User`
- **Method**: `User.set_password(str)`
- **Schema**: `UserCreate.py` (Pydantic)

## Validation

- [x] Compilation successful
- [x] Unit tests passed (12/12)

## Handoff

Ready for API endpoint implementation (Task 2.2).
```

## Related

- `/handoff` - Use when the next agent needs conversational continuation context.
- `/session-log` - Use when preserving chronological session history.
