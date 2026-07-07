---
description: Automated semantic commit generator based on diff analysis
---

# /git-detailed — Semantic Diff Commit Generator

> **Skill**: [git-detailed](../skills/devops-and-ops/git-detailed/SKILL.md)

## When to use

- You want to generate precise, Conventional Commits based on actual code changes.
- You need the agent to analyze `git diff` to extract semantic context before committing.
- You are strictly enforcing commit histories for changelog generation.

## Workflow

// turbo
1.  **Deep Inspect**: The agent will run `git status` and `git diff` to analyze exact code modifications.
2.  **Semantic Drafting**: It will draft Conventional Commits (type, scope, description, and body explaining the *why*).
3.  **Approval & Execution**: It will present the detailed commits to you and guide you through execution.
