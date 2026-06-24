---
description: Strict code quality reporting without modification
---

# /review-code — Code quality and constitution audit

---

## description: Strict code quality reporting without modification

> **Skill**: [code-analysis](../skills/core-engineering/code-analysis/SKILL.md) (Investigator Mode)
> **Mode**: Read-only (no modifications)

## When to Use

- "Review this PR"
- "Audit this file for issues"
- "What's wrong with this function?"
- "Is this implementation audit-ready?"

## Workflow

### Step 1: Detect Intent

**Code Review**:

- **Input**: Source code files (`.ts`, `.py`, etc.)
- **Check**:
  - **Constitution**: SOLID, DRY, KISS.
  - **Security**: Secrets, injection (via `securing-code` skill).
  - **Performance**: N+1, leaks.
  - **Style**: Readability, naming.
  - **Vibe**: strict adherence to `anti-vibe-coding-checklist.md` (if UI).

### Step 2: Activate Read-Only Mode

1.  **NO code modifications**.
2.  **NO file writes**.
3.  **ONLY observations and reports**.

### Step 3: Generate Report

```markdown
## 🧐 Code Review Report

**Scope**: [File/Block Reviewed]

**Verdict**: ✅ Approved / ⚠️ Needs Changes / ❌ Blocked

### 🌟 Commendations

- [Good practice found]

### ⚠️ Issues & Suggestions

1. **[Critical]** Logic Error in `auth.ts`
   - _Issue_: Handling of null tokens.
   - _Fix_: Add guard clause.

2. **[Minor]** Naming in `utils.ts`
   - _Suggestion_: Rename `process()` to `processUserData()`.

### 🛡️ Security & Constitution

- [ ] SOLID Principles: ✅
- [ ] Security: ⚠️ (See Critical Issue #1)
```

---

## Related

- `/debug-error` - For fixing the issues found.
- `/review-plan` - For reviewing the initial spec/concept.
