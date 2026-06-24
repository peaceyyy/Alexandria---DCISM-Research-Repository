---
description: Build a throwaway prototype to answer one design, logic, or UI question
---

# /prototype - Throwaway Learning Prototype

---

## description: Build a throwaway prototype to answer one design, logic, or UI question

> **Purpose**: Learn quickly before committing production architecture.
> **Source Inspiration**: Matt Pocock's `prototype` skill.
> **Core Rule**: A prototype answers a question, then gets deleted or absorbed.

## When to Use

- "Prototype this."
- "Let me play with it."
- "Try a few designs."
- "Does this state model feel right?"
- "Can we sanity-check this flow before building?"
- UI, data model, or state-machine uncertainty blocks a decision.

## Do Not Use When

- The user already approved the implementation plan.
- The artifact needs production quality.
- The prototype would require real credentials or production data.
- The question can be answered by reading existing code or docs.

## Workflow

### Step 1: State The Question

Define the exact question the prototype must answer.

Examples:

- "Does this checkout state machine cover partial failure?"
- "Which of these three dashboard layouts scans best?"
- "Does this data model make meal plan publishing awkward?"

If the question is unclear, ask before creating anything.

### Step 2: Pick Prototype Branch

Choose one:

**Logic Prototype**

- Use for state machines, domain rules, data model shape, or CLI-interactive flows.
- Prefer a tiny local script or terminal app.
- Print the relevant state after each action.

**UI Prototype**

- Use for layout, interaction, visual hierarchy, or comparison between directions.
- Prefer multiple variants reachable from one route or one isolated prototype page.
- Show enough state for the user to judge behavior, not just appearance.

State the branch and why before implementation.

### Step 3: Place It Near Context

Create the prototype near the real feature area, using project conventions.

Naming rules:

- Include `prototype` in the filename, route, or folder.
- Mark it as throwaway in the file header or page label.
- Do not invent a new project-level structure unless no local convention exists.

### Step 4: Keep It Disposable

Prototype rules:

- One command to run.
- In-memory state by default.
- No production persistence.
- No broad abstractions.
- No test suite unless the prototype's question is specifically about testing.
- Minimal error handling: enough to keep it runnable.

If persistence is required, use an obvious scratch target and label it disposable.

### Step 5: Capture The Answer

When the prototype answers the question, keep only the learning:

- Decision made.
- Evidence from the prototype.
- What to delete.
- What to fold into production.

Durable capture options:

- Plan update.
- ADR.
- Issue/task note.
- Commit message.
- `NOTES.md` next to the prototype.

### Step 6: Cleanup Gate

Before finishing, ask whether to:

- Delete the prototype.
- Fold the validated idea into real code.
- Keep it temporarily with a clear cleanup note.

Do not let prototype code silently become production code.

## Output Format

```markdown
## Prototype Report

**Question**: [question]
**Branch**: Logic / UI
**Location**: [file or route]
**Run Command**: [command]

### What We Learned

- [finding]

### Decision

- Delete / Absorb / Keep temporarily

### Follow-Up

- [next action]
```

## Related

- `/grill-plan` - Use before prototyping if the question is still fuzzy.
- `/vibe` - Use after a UI prototype direction is chosen.
- `/handoff` - Use when a future agent needs to continue from prototype findings.
