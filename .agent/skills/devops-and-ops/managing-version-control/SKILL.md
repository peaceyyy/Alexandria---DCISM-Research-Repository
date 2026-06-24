---
name: managing-version-control
description: Enforces atomic commits, safe branching, and clean git history. Use when pushing code, creating branches, or managing git workflows.
---

# Version Control Manager

## When to use this skill

- User says "push this", "commit", or "save my work"
- User asks for "git help" or "branching strategy"
- Triggered by high volumes of changes needing organization

## Core Protocols

<!-- TODO: Create missing protocol files -->
<!-- - [Micro-Commit Protocol](../../../../../protocols/guidelines/44-micro-commit-protocol.md) (Atomic standards) -->
<!-- - [Scrambled Eggs Strategy](../../../../../protocols/guidelines/42-scrambled-eggs-strategy.md) (Squashing WIPs) -->
<!-- - [Git Worktree Parallelism](../../../../../protocols/guidelines/100-git-worktree-parallelism.md) (Context isolation) -->

## Workflow

1.  **Assess State**: Run `git status` to see what's changed.
2.  **Atomize**: Suggest breaking changes into multiple atomic commits (Micro-Commit Protocol).
3.  **Branching**: If changes are experimental, suggest a new branch or worktree.
4.  **Message**: Draft commit messages using the `[type] description` format (feat, fix, refactor).
5.  **Execute**: Perform the git operations safely (ask before push if configured).
