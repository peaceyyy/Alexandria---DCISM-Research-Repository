---
description: Scaffolds a phase into sub-phases with dependencies (Worktrees & Parallelization)
---

# /breakdown-phase — Scaffolding and Decomposing Phases

---

## description: Scaffolds a phase into sub-phases with dependencies (Worktrees & Parallelization)

> **Purpose**: "Plan the Work". Decompose Phase → Sub-Phases → Detailed Tasks.
> **Output**: `breakdown.yaml` (Execution Plan) + `dependencies.yaml` (Context Control).
> **Integrates**: Strategic Planning (Scaffold) + Technical Execution (Worktrees).

**Project Workflows output convention**: Generated phase, sub-phase, face, reference, and dependency artifacts belong under root `docs/`. Do not write generated planning outputs to `.agent/` or `.codex/`; those folders are template/instruction infrastructure.

## Step 0: Load Templates

**REQUIRED:** You MUST read the following template before generating sub-phase plans.

```bash
echo "📚 Loading templates for /breakdown-phase:"
echo "  - .agent/templates/dependencies_template.yaml"
```

Use `dependencies_template.yaml` to identify shared files and potential bottlenecks. This ensures that parallel agents are aware of overlapping files and avoid conflicts.

## When to Use

- "Start Phase 2" or "Plan the next phase"
- "This phase is too big for one go"
- "I want to parallelize this work"
- "Break this down for me"

## Workflow

### Step 1: Strategic Scaffolding

**Action**: Load `docs/roadmap/roadmap.md` and the relevant `docs/roadmap/[phase-name].md`, then define the Phase Mission.

**Ask**:

- **Mission**: What is the 1-sentence goal?
- **Success Criteria**: What _must_ work for this to be "done"?
- **Time Budget**: How many hours/tokens can we spend?

### Step 2: Technical Decomposition

**Action**: Identify logical boundaries for sub-phases.

**Look for**:

1.  **Independent Units**: Frontend vs Backend, Database vs API.
2.  **Sequential Dependencies**: "Must build User Model before Auth API".
3.  **Parallel Opportunities**: "Frontend Components" and "Backend API" can often run together.

### Step 3: Generate Execution Plan

**Create**: `docs/phases/[phase]/breakdown.yaml`

**Requirement**: Every `dependencies.yaml` MUST conform to the schema defined in `.agent/templates/dependencies_template.yaml`.

```yaml
phase: phase-2-user-authentication
mission: "Implement secure JWT auth flow with password hashing and user management"
success_criteria:
  - [ ] User can register and login
  - [ ] Passwords stored as bcrypt hashes
  - [ ] JWT tokens issued on login
  - [ ] Protected routes reject invalid tokens
estimated_hours: 12

sub_phases:
  # Wave 1: Foundation (Parallelizable)
  - id: sub-phase-2.1
    name: Database Schema & Models
    persona: Kairou (Architect)
    time_estimate: 2h
    dependencies: []
    files_to_create: [backend/src/models/user.py]
    tasks:
      - Define User SQLAlchemy model
      - Create migration script

  - id: sub-phase-2.2
    name: Auth Utilities (Hashing/JWT)
    persona: Securing-Code (Guard)
    time_estimate: 3h
    dependencies: []
    files_to_create: [backend/src/utils/security.py]
    tasks:
      - Implement password hashing
      - Implement JWT encode/decode

  # Wave 2: Integration (Sequential)
  - id: sub-phase-2.3
    name: API Endpoints
    persona: Default (Engineer)
    time_estimate: 4h
    dependencies: [sub-phase-2.1, sub-phase-2.2]
    files_to_modify: [backend/src/api/auth.py]
    tasks:
      - Create /login and /register routes
      - Connect to Database and Security utils
```

### Step 4: Execution Strategy

**Parallel via File Isolation (The Standard)**:

1.  Ensure `.yaml` targets are mutually exclusive (different files).
2.  Spawn Agents (e.g., Tab 1 for Sub-Phase 2.1, Tab 2 for Sub-Phase 2.2).
3.  Agents operate on their isolated targets safely in the same workspace.

**Parallel via Git Worktrees (Per-Suggestion Only)**:

_Use ONLY if explicitly requested by the user, or if heavy file overlap is unavoidable._

1.  Check out separate branch worktrees for Sub-Phase 2.1 & 2.2.
2.  Spawn agents in their respective worktrees.
3.  Human user merges branches at the end.

**Sequential (Safest)**:

1.  Complete Sub-Phase 2.1.
2.  Complete Sub-Phase 2.2.
3.  Complete Sub-Phase 2.3.

---

## Output Files

1.  `docs/phases/[phase]/breakdown.yaml`: The master plan.
2.  `docs/phases/[phase]/sub-phases/[id]/dependencies.yaml`: Context instructions for sub-agents (conforming to `.agent/templates/dependencies_template.yaml`).
3.  `docs/phases/[phase]/sub-phases/[id]/plan.md`: Optional detailed implementation notes.

After sub-phases are defined, use `/to-slices` when a sub-phase needs demoable
vertical implementation packets before coding.

---

## Related

- `/roadmap` - Defines the high-level phases.
- `/to-slices` - Converts sub-phases into demoable vertical implementation slices.
- `/prime` - Loads the context for a specific sub-phase.
- `/report-task` - Generates the handoff report when a sub-phase is done.
