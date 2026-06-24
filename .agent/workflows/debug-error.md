---
description: 3-Strike Rule powered debugging
---

# /debug-error — Systematic bug fixing loop

---

## description: 3-Strike Rule powered debugging

> **Skill**: [code-analysis](../skills/core-engineering/code-analysis/SKILL.md) (Investigator Mode)
> **Goal**: Fix the bug using systematic hypothesis testing.

**Project Workflows output convention**: Save generated bug knowledge and debug records under root `docs/knowledge/`. Do not create project-facing debug artifacts inside `.agent/` or `.codex/`; those folders are template/instruction infrastructure.

## When to Use

- "This specific error is happening"
- "Fix this crash"
- "Why isn't this button working?"

## Workflow

### Step 1: Define the Symptom

**Ask**:

- What is the expected behavior?
- What is the actual behavior?
- When did it start failing?

### Step 2: Activate Investigator Mode

Load **`skills/core-engineering/code-analysis/SKILL.md`** (Investigator Mode):

- Read-only analysis first
- Trace execution paths
- Check logs, state, permissions

### Step 3: Generate Hypothesis

Based on evidence, propose:

1. **Most Likely Cause**: [Hypothesis]
2. **Test**: How to verify this hypothesis
3. **Fix**: If hypothesis is correct, what to change

### Step 4: Test & Iterate (3-Strike Rule)

**Attempt 1**: Test hypothesis → Apply fix → Verify
**Attempt 2**: If failed, revise hypothesis → Test again
**Attempt 3**: If failed again, STOP and report.

**After 3 strikes**:

- Report exact error state.
- List what was tried.
- Request human judgment.

### Step 5: Verify Fix

- Run tests.
- Check edge cases.
- Ensure no regressions.

### Step 6: Auto-Knowledge Write (Reflection Loop)

> **[Autoregrate]** This step closes the learning loop. Execute after every debug session.

**If fix SUCCEEDED:**
1. Identify what category of bug this was (e.g., `null-safety`, `async-race`, `schema-mismatch`).
2. Check if `docs/knowledge/[bug-class]/` exists. If not, create the folder.
3. Append a `docs/knowledge/[bug-class]/known-fix-[YYYY-MM-DD].md` entry with:
   - **Trigger**: What caused the bug
   - **Symptom**: How it manifested
   - **Root Cause**: The actual source
   - **Fix Pattern**: The generalizable solution

**If 3 strikes FAILED:**
1. Create `docs/knowledge/[bug-class]/open-bug-[YYYY-MM-DD].md` with:
   - **Symptom**: Exact error
   - **Attempted Fixes**: All 3 approaches tried
   - **Status**: `UNRESOLVED — awaiting human judgment`
   - **Next Steps**: Hypotheses for human to explore

---

## Output Format

```markdown
## 🐛 Debug Report

**Symptom**: [What's broken]

**Hypothesis**: [Why it's broken]

**Evidence**:

- File: `path/to/file.py:42`
- Error: `NullPointerException`

**Fix Applied**: [What was changed]

**Verification**: ✅ Tests pass
```
