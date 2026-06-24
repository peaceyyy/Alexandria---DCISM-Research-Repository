---
description: Break projects into conversation-sized phases
---

# /roadmap — Break projects into conversation-sized phases

---

## description: Break projects into conversation-sized phases

> **Role**: Implementation Strategist
> **Philosophy**: Break big projects into conversation-sized phases.

## Purpose

Reads `docs/project_specification.md` and breaks it into implementation phases. Each phase becomes a clear conversation boundary with defined scope, exit criteria, and learning goals.

**Output**: Creates root `docs/roadmap/` phase files and `docs/roadmap/roadmap.md` as the master tracking document.

**Project Workflows output convention**: Do not create generated roadmap, phase, face, reference, or planning artifacts inside `.agent/` or `.codex/`. Those folders are template/instruction infrastructure. Generated project-facing artifacts belong under root `docs/`.

---

## When to Use This

**After** you've run `/plan` and have a complete `docs/project_specification.md`:

- You need to break a large project into manageable chunks
- You want clear boundaries for when to start new conversations
- You need guidance on what to implement first (dependency order)

**Don't use this** for single-feature projects that fit in one conversation.

---

## Execution Process

### Step 0: Load Knowledge Sources

**REQUIRED:** Log all files being loaded for this workflow.

```bash
echo "📚 Loading knowledge sources for /roadmap:"
echo "  - .agent/protocols/guidelines/01-token-hygiene.md"
echo "  - .agent/protocols/guidelines/02-hybrid-token-conservation.md"
```

Verify files exist. If missing, log warning and proceed with degraded functionality.

### Step 1: Read Project Specification

**Action**: Load the complete spec

```bash
# Read the full project spec created by /plan
Read: docs/project_specification.md
```

**Extract**:

- Tech stack and architecture
- Implementation plan (tasks)
- Feature prioritization (must-have vs nice-to-have)
- Dependencies between features

---

### Step 2: Identify Phase Boundaries

**Analyze the implementation plan** and group tasks into phases based on:

#### Natural Boundaries:

- **Domain separation**: Auth vs Habits vs Analytics
- **Architectural layers**: Backend vs Frontend vs Infrastructure
- **Dependency chains**: Can't do Y before X is done
- **Complexity**: Aim for 3-7 related features per phase

#### Phase Sizing Heuristics:

- **Too small**: 1-2 tasks (just do it, don't phase it)
- **Good size**: 3-7 related tasks, 2-5 hours of work
- **Too large**: 10+ tasks (split into multiple phases)

---

### Step 3: Order Phases by Dependencies

**Determine implementation order**:

1. Foundation first (project setup, database, core models)
2. Backend before frontend (API must exist before UI calls it)
3. Core features before enhancements (CRUD before analytics)
4. Authentication before protected features (if auth is required)

**Example Order**:

```
Phase 1: Project Foundation (setup, config, database)
Phase 2: User Authentication (if needed)
Phase 3: [Core Feature] Backend (API endpoints)
Phase 4: [Core Feature] Frontend (UI components)
Phase 5: Deployment (Docker, production config)
```

---

### Step 4: Create Phase Files

**For each phase**, create `docs/roadmap/[phase-name].md` with this structure. If the phase later needs detailed sub-phases or dependencies, place those under `docs/phases/[phase-name]/`.

```markdown
# Phase [N]: [Phase Name]

**Phase Goal**: [One-sentence description of what this phase achieves]

---

## Phase Metadata

**Phase Type**: [Foundation | Feature | Enhancement | Infrastructure]
**Estimated Complexity**: [Low | Medium | High]
**Estimated Time**: [X-Y hours]
**Prerequisites**: [Previous phases that must be complete]
**Primary Systems Affected**: [Backend | Frontend | Database | Infrastructure]
**Dependencies**: [List of tech/libraries/tools needed]

---

## Feature Description

[Detailed description of what's being built in this phase]

## User Impact

**User Story**:
As a [role], I want [goal], so that [benefit]

**Value Delivered**:

- [What can users do after this phase?]
- [What problems does this solve?]

---

## CONTEXT REFERENCES — READ BEFORE IMPLEMENTING!

**Critical Documentation**:
| Document | Sections | Why Read |
|----------|----------|----------|
| `docs/project_specification.md` | [API Spec, Data Models] | Full technical requirements |
| `docs/references/code-documentation/[tech].md` | [All] | Project-local tech-specific patterns and anti-patterns |

**Key Patterns to Follow**:

- [Specific pattern from reference file, e.g., "Pydantic v2 model_config"]
- [Specific pattern from reference file, e.g., "SQLAlchemy 2.0 context manager"]

**Anti-Patterns to Avoid**:

- ❌ [Common mistake, e.g., "Pydantic v1 Config class"]
- ❌ [Common mistake, e.g., "sessionmaker() without context"]

---

## Implementation Tasks

**Task Breakdown** (specific, actionable, independent):

### Task 1: [Task Name]

**Action**: [What to do]
**Files**: [What files to create/modify]
**Why**: [Purpose of this task]
**Verification**: [How to know it's done]

### Task 2: [Task Name]

[repeat structure]

---

## Exit Criteria (Definition of Done)

**Functional Requirements**:

- [ ] [All endpoints/features work as specified]
- [ ] [Expected user flows complete successfully]

**Quality Requirements**:

- [ ] Tests pass (>80% coverage for new code)
- [ ] `/validate` command passes (no anti-patterns)
- [ ] No console errors or warnings
- [ ] Logging present in all key functions

**Documentation Requirements**:

- [ ] Code comments for complex logic
- [ ] API endpoints documented (if applicable)
- [ ] README updated with new features

---

## What You'll Learn

**Technical Skills**:

- [Specific skill, e.g., "JWT token generation and validation"]
- [Specific skill, e.g., "React hooks: useState, useEffect"]

**Conceptual Understanding**:

- [Concept, e.g., "Difference between authentication and authorization"]
- [Concept, e.g., "Repository pattern for data access"]

**Tools & Patterns**:

- [Tool/pattern, e.g., "FastAPI dependency injection"]
- [Tool/pattern, e.g., "TanStack Query for server state"]

---

## Phase Completion Protocol

When all exit criteria are met:

1. **Validate**: Run `/validate` to verify quality
2. **Review** (Optional): Run `/system-review` to analyze process
3. **Update Roadmap**: Mark this phase complete in roadmap overview
4. **Commit**: `git commit -m "Complete Phase [N]: [name]"`
5. **Exit Conversation**: End current conversation
6. **Next Phase**: Start NEW conversation, run `/prime`, continue to next phase

---

## Notes & Gotchas

**Common Issues**:

- [Potential problem specific to this phase]

**Dependencies**:

- [External services/APIs needed]
- [Configuration required]

**Helpful Resources**:

- [Links to relevant docs]
```

---

### Step 5: Create Roadmap Overview

Create `docs/roadmap/roadmap.md` as the master tracking document:

```markdown
# Project Roadmap: [Project Name]

**Generated**: [Date]
**Source**: `docs/project_specification.md`
**Total Phases**: [N]
**Estimated Total Time**: [X-Y weeks]

---

## How to Use This Roadmap

Each phase represents a **conversation boundary**:

1. Complete all tasks in current phase
2. Run `/validate` to ensure quality
3. Commit your work
4. Start NEW conversation
5. Run `/prime` to load fresh context
6. Move to next phase file

**Phase files are in**: `docs/roadmap/[phase-name].md`

---

## Phase Overview

| Phase | Name   | Type       | Complexity | Time | Prerequisites | Status      |
| ----- | ------ | ---------- | ---------- | ---- | ------------- | ----------- |
| 1     | [Name] | Foundation | Low        | 1-2h | None          | Not Started |
| 2     | [Name] | Feature    | Medium     | 3-4h | Phase 1       | Not Started |
| 3     | [Name] | Feature    | High       | 4-5h | Phase 2       | Not Started |

---

## Phase 1: [Name]

**Goal**: [One sentence]
**File**: `docs/roadmap/[phase-1-name].md`
**Must Complete Before**: Phase 2, Phase 3

**Quick Scope**:

- Task 1
- Task 2
- Task 3

**Exit Criteria**: All tests pass, `/validate` clean

**Conversation Boundary**: ✅ Start new conversation after this

---

[Repeat for each phase]

---

## Progress Tracking

**Completed Phases**: [N/Total]
**Current Phase**: [Phase X]
**Last Updated**: [Date]

### Completion Log

| Phase   | Completed Date | Actual Time | Notes |
| ------- | -------------- | ----------- | ----- |
| Phase 1 | -              | -           | -     |
| Phase 2 | -              | -           | -     |

---

## Dependency Graph
```

Phase 1 (Foundation)
↓
Phase 2 (Auth)
↓
Phase 3 (Feature Backend) ← requires Phase 2
↓
Phase 4 (Feature Frontend) ← requires Phase 3
↓
Phase 5 (Deployment) ← requires Phase 4

```

---

## Learning Path

By completing this roadmap, you will learn:
- [Skill set from Phase 1]
- [Skill set from Phase 2]
- [Overall conceptual understanding]
```

---

## Output Files

The `/roadmap` command creates:

1. **`docs/roadmap/roadmap.md`** - Master overview (one file)
2. **`docs/roadmap/phase-1-[name].md`** - Detailed phase 1 plan
3. **`docs/roadmap/phase-2-[name].md`** - Detailed phase 2 plan
4. **`docs/roadmap/phase-N-[name].md`** - One file per phase

---

## Integration with Workflow

**Complete Workflow**:

```
User: "I want to build [app]"
↓
User: /plan
→ Creates docs/project_specification.md (WHAT to build)
↓
User: /roadmap
→ Creates docs/roadmap/roadmap.md + docs/roadmap/phase-*.md (HOW to phase it)
↓
User: /prime
→ Loads context for Phase 1
↓
Implement Phase 1 tasks
↓
User: /validate
→ Checks quality
↓
Agent: "✅ Phase 1 complete. Start new conversation for Phase 2."
↓
User: [New conversation]
↓
User: /prime
→ Loads context for Phase 2
↓
[Repeat until all phases complete]
```

---

## Related Protocols

- [Token Hygiene](.agent/protocols/guidelines/01-token-hygiene.md) - Session handoffs between phases
- [Hybrid Token Conservation](.agent/protocols/guidelines/02-hybrid-token-conservation.md) - Plan-first pattern optimization

---

## References Used

This workflow relies on the following guidelines:

- [Token Hygiene](.agent/protocols/guidelines/01-token-hygiene.md)
- [Hybrid Token Conservation](.agent/protocols/guidelines/02-hybrid-token-conservation.md)

_Note: These files are copied to your project during `/prime` or `boot_agent.py`._

---

## Notes

- **Naming**: Use descriptive phase names (e.g., `backend-foundation.md`, not `phase-1.md`)
- **Flexibility**: If mid-phase you realize scope is wrong, it's OK to re-run `/roadmap`
- **Manual Override**: You can edit phase files manually if needed
- **Git Tracking**: Phase files are part of your project docs (commit them!)
