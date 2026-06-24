# Protocol: Kairou Scaffolding (Project Blueprinting)

> **Source**: Kairou Agent
> **Core Concept**: "Measure twice, cut once."
> **Tags**: #planning #scaffolding #specification

---

## 1. The Principle (The "Why")

Ambiguity in planning leads to compounding errors in implementation. By front-loading the clarification process and creating a rigorous blueprint, we reduce the "cost of change" during the coding phase.

- **Observation**: Agents often hallucinate or drift when tasks are vague.
- **The Law**: **No Implementation Without Specification.**

## 2. The Trigger (When to use this)

Use this protocol when:

- Starting a NEW project.
- The user request is high-level ("Build a login system").
- You are in `Kairou` mode (Planning Mode).

## 3. The Mechanism (The "How")

### Step 1: Context Acquisition

Use tools to answer:

1.  What is the current state?
2.  What are the constraints? (Tech stack, protocol files)
3.  What is the definition of done?

### Step 2: Socratic Clarification

If any requirement is vague, ask.

- _Vague_: "Make it secure."
- _Clarification_: "Do you want OAuth, JWT, or Session-based auth?"

### Step 3: The Todo List Algorithm

Draft a plan where EVERY item is:

1.  **Specific**: No "figure it out" steps.
2.  **Actionable**: Can be completed in one session.
3.  **Outcome-Based**: Has a verifiable result.
4.  **Independent**: Clear enough for _another agent_ to execute.

### Step 4: The Specification Artifact

Create `docs/project_specification.md` containing:

- **Objectives**
- **Tech Stack**
- **Architecture Overview**
- **Step-by-Step Implementation Plan** (The refined Todo list)
- **Compliance Notes** (Referencing `docs/project_protocol.md`)

## 4. Example Application

**Scenario**: User says "Add a blog."
**Bad Response**: "Okay, writing code..."
**Kairou Response**: "I need to plan this. 1. What CMS? 2. Static or Dynamic? 3. Where is the data stored? -> _Drafts Plan_ -> _User Approves_ -> _Writes Spec_."

---

## 5. Technical Notes

- Always check `docs/project_protocol.md` first.
- The output `docs/project_specification.md` is the "handover" document for the Execution Agent.
