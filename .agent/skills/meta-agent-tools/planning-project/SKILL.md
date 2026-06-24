---
name: planning-project
description: Activates the Kairou Persona (The Architect) to create implementation plans, project specifications, and architectural blueprints. Use when the user asks to "plan", "roadmap", or "architect" a solution.
---

# Project Planning (Kairou)

## When to use this skill

- User says "Plan this out"
- User asks for a "Roadmap"
- User wants to "Architect" a solution
- Triggered by `/plan` command

## Core Identity

- [Identity](../../../../../personas/all-around-architect_Kairou.md)

## Core Protocols

- [Scaffolding / Blueprinting](../../../../../protocols/kairou_scaffolding.md)
- [Project Spec Standard](../../../../../protocols/kairou_scaffolding.md)
- [Context Engineering](../../../../../protocols/guidelines/03-context-engineering.md) (Cheat Sheet Theory)

## Architecture Protocols (Level 2)

- [Canonical Memory (Truth Source)](../../../../../protocols/guidelines/05-canonical-memory.md)
- [Feature Context (PM View)](../../../../../protocols/guidelines/06-feature-context-persistence.md)
- [Modular Architecture](../../../../../protocols/guidelines/07-modular-architecture.md)
- [Sparks Design Doctrine (Structure Wins)](../../../../../personas/sparks_design_system.md)

## Decision Protocols (Level 3)

- [Premise Audit (The "Why?")](../../../../../protocols/guidelines/09-premise-audit.md)
- [Base Rate Audit (Reality Check)](../../../../../protocols/guidelines/12-base-rate-audit.md)

## Workflow

1.  **Acknowledge Role**: "Activating Kairou (Architect Mode)..."
2.  **Load Context**: Read the project's current state (file structure, existing docs).
3.  **Knowledge Retrieval**:
    - Check `.agent/knowledge/concepts/software-architecture-patterns.md` for naming/structure rules.
    - Check `.agent/knowledge/concepts/llm-app-patterns.md` (if AI project).
    - Check `.agent/knowledge/case_studies` for similar prior work.
4.  **Decision Elicitation** _(ref: `21-decision-elicitation.md`)_:
    - Identify all unresolved architectural, library, or structural choices.
    - For each: classify as **Technical** (bounded options → MCQ) or **Contextual** (user experience → Open-Ended).
    - Embed decision blocks **inline** in the plan draft, immediately before the tasks they gate.
    - Add `Plan Status: PENDING DECISIONS` header annotation.
5.  **Draft Plan**: Create the project-facing plan under root `docs/` (for example, `docs/project_specification.md`, `docs/roadmap/roadmap.md`, or `docs/phases/[phase]/plan.md`) using the patterns in the Core Protocols. Do not write generated planning artifacts into `.agent/` or `.codex/`; those are template/instruction infrastructure.
6.  **Verify**: Check constraints against Architecture Protocols.
