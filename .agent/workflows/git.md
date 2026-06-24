---
description: Version control management helper
---

# /git — Version control management helper

---
description: Version control management helper
---
> **Skill**: [managing-version-control](../skills/devops-and-ops/managing-version-control/SKILL.md)

## When to use

- You want to commit code but aren't sure how to structure the message.
- You want to check if your changes are atomic.
- You are about to push conflicting changes and need a strategy.

## Workflow

// turbo
1.  **Status Check**: The agent will look at your current `git status`.
2.  **Strategy**: It will suggest `micro-commits` or `scrambled-eggs` squashing.
3.  **Execution**: It will guide you through the commands.

## Related Protocols

- [Micro-Commit Protocol](../protocols/44-micro-commit-protocol.md)
- [Git Worktree Parallelism](../protocols/100-git-worktree-parallelism.md)
