---
description: Zero-Point Codex strategic analysis and workspace priming
---

# /onboard — Project context loading

---

## description: Zero-Point Codex strategic analysis and workspace priming

> **Purpose**: Load critical context, verify dependencies, and prepare workspace.
> **Steps**: Context Load → Dependency Check → Workspace Prime.

**Project Workflows output convention**: Treat root `docs/` as the canonical location for project-facing specs, roadmaps, phases, references, faces, and generated artifacts. Use `.agent/` only as the template/instruction library.

## When to Use

- Start of a new session.
- "Load context for [Phase X]"
- "Get ready to code"

## Workflow

### Step 1: Load Core Context

**Read**:

- `.agent/personas/CONSTITUTION.md` (Constitutional Law).
- `docs/project_specification.md` (The "Why").
- `docs/roadmap/roadmap.md` (The "What").
- `docs/references/llms.txt` (Project-local external knowledge index, if present).
- `.agent/protocols/references/llms.txt` (Template-level external knowledge index, if needed).

### Step 2: Check Dependencies

**Verify**:

- Are we in the correct workspace?
- (If provided) Load `dependencies.yaml` for specific sub-phase (verified against `.agent/templates/dependencies_template.yaml`).

### Step 3: Workspace Prime

- **Summary**: Echo back current state. "We are in Phase 2, working on Auth."
- **Next Action**: Suggest `/breakdown-phase` or `/design` or `/code`.
- **Status**: ✅ Ready.

---

## Output

**Summary**:

- Current Phase: [Phase Name]
- Critical Files Loaded: [List]
- Next Suggested Step: [Command]
