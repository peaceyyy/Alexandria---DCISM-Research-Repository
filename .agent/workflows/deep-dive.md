---
description: Ultra-deep multi-source research for complex problems
---

# /deep-dive — Exhaustive research mode

---

## description: Ultra-deep multi-source research for complex problems

> **Purpose**: Gather comprehensive understanding from Web, Docs, and Codebase.
> **Output**: Synthesis Report (`docs/research/...`) or `docs/references/llms.txt` update.

**Project Workflows output convention**: Save generated research and reference artifacts under root `docs/`. Do not create project-facing research, faces, references, or planning outputs inside `.agent/` or `.codex/`; those folders are template/instruction infrastructure.

## When to Use

- "Research best practices for [topic]"
- "Find a library for [feature]"
- "Understand the domain of [industry]"

## Workflow

### Step 1: Define Scope

- **Topic**: What are we researching?
- **Constraints**: Cost, Performance, Tech Stack?
- **Goals**: "Create a comparison table" or "Find definitive answer".

### Step 2: Multi-Source Investigation

1.  **Web Search**: `search_web` for current trends, libraries, benchmarks.
2.  **Docs Search**: `read_url_content` for specific API docs.
3.  **Code Search**: `github_search_code` (if applicable) for implementation examples.
4.  **Internal Knowledge**: Check KIs for existing wisdom.

### Step 3: Synthesis & Verification

- **Compare**: Assess pros/cons of findings.
- **Verify**: Check credibility of sources (official docs vs random blog).
- **Contextualize**: Relate findings to CURRENT project constraints.

### Step 4: Generate Output

**Option A: Research Report** (`docs/research/topic.md`)

```markdown
# Research: [Topic]

## Executive Summary

[Key Recommendation]

## Findings

- **Solution A**: Pros/Cons
- **Solution B**: Pros/Cons

## Recommendation

Implement Solution A because [Reason].
```

**Option B: Knowledge Update** (`docs/references/llms.txt`)

- Append consolidated knowledge to `llms.txt` for future context.

---

## Related

- `/plan` - Uses research to build specs.
- `/onboard` - Loads knowledge from research.
