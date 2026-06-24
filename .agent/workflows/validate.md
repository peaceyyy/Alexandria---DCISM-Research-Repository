---
description: Implementation verification against spec and roadmap
---

# /validate — Implementation verification

---

## description: Implementation verification against spec and roadmap

> **Purpose**: "Definition of Done". Verify implementation meets spec, tests pass, and constitution is followed.
> **Output**: Validation Report (Pass/Fail).

**Project Workflows output convention**: Generated validation lessons, success patterns, and failure notes belong under root `docs/knowledge/`. Do not append project-specific learnings into `.agent/skills/`, `.agent/knowledge/`, or `.codex/`.

## When to Use

- "I finished the feature"
- "Is this task done?"
- "Verify my implementation"

## Workflow

### Step 1: Check Functional Correctness

// turbo
- **Compile**: `npm run build` / `compile`
// turbo
- **Test**: `npm test` (or relevant suite)
- **Spec Check**: Does feature X exist as defined in `docs/project_specification.md`?

### Step 2: Check Constitution Compliance

**Read**: `.agent/personas/CONSTITUTION.md`
**Verify**:

- [ ] **SOLID**: Single Responsibility, Open/Closed, Liskov, Interface Seg, Dependency Inv.
- [ ] **DRY**: No blatant duplication.
- [ ] **KISS**: No over-engineering.
- [ ] **Test-First**: Do tests exist for the new code?

### Step 3: Check Documentation

- **Docs**: Are comments added? Is README updated?
- **Logs**: Is structured logging used?

### Step 4: Generate Report

```markdown
## ✅ Validation Report

**Feature**: [Feature Name]
**Spec**: [Spec Section]

### Functional (Pass)

- [x] Compilation
- [x] Unit Tests (12/12 passed)
- [x] API Endpoint Respond 200

### Constitution (Pass)

- [x] SOLID Principles met.
- [x] DRY met.
- [x] KISS met.

### Documentation (Pass)

- [x] Type definitions complete.
- [x] Comments present.

### Verdict: READY TO MERGE
```

---

## Related

- `/review-code` - To improve code quality before this step.
- `/commit` - To finalize the work if passed.

---

## Step 5: Auto-Knowledge Write (Reflection Loop)

> **[Autoregrate]** Fires after a PASS verdict. Writes success patterns back to the skill system.

**If validation PASSED:**
1. Identify what technique or pattern made this implementation clean (e.g., `service-layer-separation`, `optimistic-locking`, `schema-first design`).
2. Check if a relevant docs knowledge file exists for this domain under `docs/knowledge/proven-patterns/`.
3. Append a `## Proven Pattern: [YYYY-MM-DD]` section to `docs/knowledge/proven-patterns/[domain].md` with:
   - **Context**: What kind of task this was
   - **Approach**: The pattern that worked
   - **Why it passed**: What made it spec-compliant and constitution-compliant

**If validation FAILED:**
- Instead of a success pattern, document the failure mode in `docs/knowledge/failure-modes/` as a guard against repeating it.
