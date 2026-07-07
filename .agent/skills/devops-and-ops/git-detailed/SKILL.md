---
name: git-detailed
description: Enforces semantic commit messages driven by diff-level semantic analysis. Use when making highly detailed commits that require context, conventional formatting, and diff review.
---

# Git Detailed Manager

## When to use this skill

- User invokes `/git-detailed` or asks for detailed, semantic commits based on code diffs.
- High-stakes repositories where the "why" and "what" of commits must be explicitly documented.
- CI/CD environments that require strict Conventional Commits compliance.

## Core Principles (Conventional Commits + Diff Context)

1. **Semantic Analysis**: Diffs only tell us *what* changed. The AI must infer or ask the user *why* it changed to populate the commit body.
2. **Conventional Commits**: Every commit must adhere to: `<type>(<scope>): <description> [body] [footer]`.
    - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
    - **Description**: Present imperative mood (e.g., "add feature", not "added feature").
    - **Body**: Explain the intent or business logic behind the change.
    - **Footer**: Reference issues or indicate `BREAKING CHANGE`.

## Workflow

1.  **Assess State & Deep Inspect**: 
    - Run `git status` to see what files are changed/staged.
    - Run `git diff` or `git diff --cached` to semantically analyze the exact code modifications.
2.  **Atomize**: Suggest breaking changes into multiple atomic commits if the diff reveals disjointed features.
3.  **Draft Detailed Messages**: Draft conventional commit messages for each atomized chunk, including a descriptive body that explains the *why* based on the diff analysis.
4.  **Review**: Present the proposed commits to the user for approval. If the *why* is ambiguous, explicitly ask the user for context.
5.  **Execute**: Perform the git operations safely once approved.
