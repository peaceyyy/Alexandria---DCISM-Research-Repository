---
name: reasoning-complex-logic
description: Analyzes problems using deep logic, first principles, and graph of thoughts. Use when the user asks "Why?", "Analyze", or uses /think.
---

# Deep Reasoning (The Philosopher)

## When to use this skill

- User asks "Why is this happening?" for a complex bug.
- User requests a "deep dive" or "root cause analysis".
- User uses `/think` or `/ultrathink`.
- Triggered by ambiguity or conflicting information.

## Core Protocols

- [First Principles Deconstruction](../../../../../protocols/guidelines/11-first-principles-deconstruction.md)
- [Graph of Thoughts](../../../../../protocols/guidelines/13-graph-of-thoughts.md)
- [Claim Atomization](../../../../../protocols/guidelines/10-claim-atomization-audit.md)
- [Premise Audit](../../../../../protocols/guidelines/09-premise-audit.md)
- [Synthetic Parallel Reasoning](../../../../../protocols/guidelines/14-synthetic-parallel-reasoning.md) (Tier 3)

## Workflow

### Tier 1: Root Cause Analysis (Default)

- **Trigger**: "Why is this happening?"
- **Action**: Use `sequential-thinking` to perform Root Cause Analysis.
- **Steps**:
  1.  **Stop**: Don't guess.
  2.  **Sequential Think**: Start with clear hypothesis, revise with evidence.
  3.  **Consult Precedents**: Check `.agent/knowledge/case_studies`.

### Tier 2: Deep Deconstruction (/think)

- **Trigger**: `/think` command or "Analyze this deeply"
- **Action**: Break down problem into First Principles.
- **Steps**:
  1.  **Load Knowledge**: `11-first-principles-deconstruction.md`, `13-graph-of-thoughts.md`
  2.  **Atomize**: Break claim into atomic facts.
  3.  **Trace**: Trace back to First Principles.
  4.  **Graph**: Explore multiple branches using Graph of Thoughts.
  5.  **Validate**: Verify hypothesis before coding.

### Tier 3: Maximum Depth (/ultrathink)

- **Trigger**: `/ultrathink` command or "I need to know EVERYTHING"
- **Action**: "Shukai" State - Perfect Fusion of User + AI.
- **Steps**:
  1.  **Clarify**: Ask 3-4 defining questions (Time horizon? Stakes?).
  2.  **Research**: Auto-trigger `search_web` for core topic + contrarian views.
  3.  **CoVe**: Chain of Verification - stress-test initial findings.
  4.  **Pivot Check**: Is the original question the right question?
  5.  **Full Sequence**: Upstream Tracing → Validation → Counterfactual Analysis → Reality Simulation.
  6.  **Adversarial**: Steelman the opposing view.
