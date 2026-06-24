---
name: vibe-check
description: Audit UI/UX against the Anti-Vibe Coding Checklist to ensure modern aesthetics and best practices.
metadata:
  author: user
  version: "1.0.0"
  argument-hint: "file-or-pattern"
---

# Vibe Check

Review UI/UX code against the **Anti-Vibe Coding Checklist** to ensure modern aesthetics and best practices.

## How It Works

1.  **Read Context**: Analyze the provided files (or the entire active UI context if none provided).
2.  **Load Rules**: Read `anti-vibe-coding-checklist.md` located in this skill directory.
3.  **Audit**: Compare the implementation against the "Anti-Patterns" and "Fixes" in the checklist.
    - **Technical**: Libraries vs. Custom, Clean Patterns.
    - **Design**: Consistency, Hierarchy, Spacing, Tokens.
    - **UX**: Feedback, Onboarding, Accessibility, Mobile.
    - **Slop Signals**: Phantom deps, clone clusters, over-abstraction, AI tells.
4.  **Report**: Generate a "Vibe Report".

> **Slop Signals posture**: Flag and explain. Never silently change. Human decides.

## Usage

**Arguments**: `files` (optional) - The specific files or directories to audit. If empty, the agent should ask or infer based on open files.

## Vibe Report Format

Generate the output in the following format:

```markdown
# 🌊 Vibe Check Report

**Vibe Score**: [1-100] / 100
**Verdict**: [Passed / Needs Polish / Critical Fail]

## 🚫 Major Vibe Killers

(List top 3 critical issues that ruin the feel)

- [ ] **Issue**: [Description]
  - **Fix**: [Specific recommendation]

## 🎨 Design & Aesthetics

- **Color/Theme**: [Comments on consistency, tokens]
- **Typography**: [Comments on hierarchy, readability]
- **Spacing/Layout**: [Comments on breathing room, grid]

## 🧠 UX & Polish

- **Feedback**: [Interactive states, loading, errors]
- **Mobile**: [Responsiveness check]

## 🤖 AI Slop Signals

(Structural patterns that signal uncurated AI generation — your call on each)

- **Phantom Deps**: [Any imports not in the manifest, or "None found"]
- **Clone Clusters**: [Repeated logic blocks, or "None found"]
- **Over-Abstraction**: [Single-use utils/wrappers, or "None found"]
- **AI Tell**: [Robotic naming or structural predictability, or "None found"]

## ✨ Quick Wins

(Low effort, high impact changes)

1. ...
2. ...
```

## Resources

- [Anti-Vibe Coding Checklist](./anti-vibe-coding-checklist.md)
