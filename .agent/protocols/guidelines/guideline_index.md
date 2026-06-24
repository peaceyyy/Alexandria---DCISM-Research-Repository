# Guideline Index (Cognitive Routing)

- Credits goes to the creator of Athena OS (the base template for this system) for most of the protocls found within this folder

> **Purpose**: Central directory for all methodology and protocol guidelines.
> **Rule**: Do not "guess" which guideline to load. Use this index to find the exact cognitive tool required for your current task.

---

## 🏗️ Architecture & Engineering

_Core principles for structuring software and systems._

- `07-modular-architecture.md` — Use when designing new systems or decomposing monolithic structures.
- `08-forward-only-architecture.md` — Use when extending existing systems to prevent regressions and backward compatibility hell.

## 🕵️ Auditing & Logical Reasoning

_Mental models for debugging, validating claims, and structuring complex thoughts._

- `09-premise-audit.md` — Use when a proposed solution feels "off" or rests on questionable assumptions.
- `11-first-principles-deconstruction.md` — Use for complex problem spaces that need to be broken down to absolute truths.
- `13-graph-of-thoughts.md` — Use when nonlinear or parallel execution paths need to be evaluated.
- `12-base-rate-audit.md` — Use when estimating timelines, success rates, or evaluating edge cases based on prior probabilities.
- `10-claim-atomization-audit.md` — Use when reviewing PRs, plans, or user requirements to ensure every statement is verifiable.
- `14-synthetic-parallel-reasoning.md` — Use to evaluate multiple architectural choices simultaneously before committing.

## 🧠 Context & Memory Management

_Techniques for retaining focus and managing information flow._

- `06-feature-context-persistence.md` — Use when working on multi-session features to ensure you don't lose context.
- `05-canonical-memory.md` — Use to establish single sources of truth (e.g., project specifications or architecture maps).
- `03-context-engineering.md` — Use at the start of complex tasks to rigorously define what information matters and what is noise.

## 🛡️ Safety & Resource Hygiene

_Protocols for agent safety, token limits, and hallucination prevention._

- `01-token-hygiene.md` — Use for lengthy sessions to minimize token bloat and optimize context windows.
- `02-hybrid-token-conservation.md` — Use alongside token hygiene to manage external tools and LLM usage efficiently.
- `15-container-sandboxing.md` — Use when executing unknown code, scripts, or testing potentially destructive terminal commands.
- `04-anti-hallucination.md` — Use for critical tasks where assumptions must be verified strictly by facts and codebase reality.

## 📋 Planning & Decision Making

_Structured techniques for capturing user decisions during the planning phase._

- `21-decision-elicitation.md` — Use during Kairou planning whenever there are unresolved architectural, library, or structural decisions. MCQ for technical choices, open-ended for contextual ones.

## 🔬 Research, Flow & Vibe Engineering

_Advanced methodologies for rapid iteration, feeling out UI, and deep dives._

- `16-deep-research-loop.md` — Use for extensive external research, documentation hunts, or complex library integration.
- `17-cyborg-methodology.md` — Use when highly collaborative, rapid-fire iteration with the human operator is required.
- `18-vibe-engineering.md` — Use for UI/UX tasks focusing on fast, iterative, aesthetic development.
- `19-vibe-coding.md` — Use alongside vibe engineering to maintain momentum and flow state during coding.
- `20-latency-indicator.md` — Use when feedback loops are critical (e.g., teaching or debugging).
