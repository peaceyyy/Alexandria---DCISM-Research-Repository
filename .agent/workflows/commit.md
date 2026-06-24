---
description: Analyze changes and generate conventional commit messages
---

# /commit — Conventional commit message generator

---

## description: Analyze changes and generate conventional commit messages

> **Role**: Git Historian (Conventional Commits)
> **Goal**: Clear history = maintainable project.

## When to Use

- "Commit these changes"
- "Create a message for this PR"
- "Unsure how to describe this update"

## Workflow

### Step 1: Analyze Changes

// turbo
**Action**: Run `git diff --staged` (or `git status`).
**Identify**:

- What files changed?
- What functional changes (Logic, Formatting, Test)?
- What systems were affected (Auth, Database, UI)?

### Step 2: Classify Change Type

**Conventional Types**:
| Type | Use Case | Example |
| :--- | :--- | :--- |
| `feat` | New feature | `feat(auth): add JWT validation` |
| `fix` | Bug fix | `fix(habit): prevent duplicates` |
| `docs` | Documentation | `docs(readme): update setup` |
| `refactor` | Code restructure | `refactor(db): extract methods` |
| `test` | Adding tests | `test(auth): verify user login` |
| `chore` | Build/Config/Deps | `chore(deps): bump fastapi` |
| `perf` | Performance | `perf(query): add db index` |

### Step 3: Generate Message

**Rules**:

1.  **Format**: `<type>(<scope>): <short description>`
2.  **Subject**: Imperative mood ("add" not "added"), max 50 chars.
3.  **Body**: Why, not how. Wrap at 72 chars.
4.  **Footer**: `BREAKING CHANGE:` or `Closes #123`.

### Step 4: Provide Command

```bash
# Recommended:
git commit -m "feat(auth): implement refresh token flow

Implements secure refresh token logic using httpOnly cookies.
Adds database migration for token table.

Closes #42"
```

---

## Output

- Analysis Summary
- Recommended Commit Message
- Copy-paste `git commit` command
