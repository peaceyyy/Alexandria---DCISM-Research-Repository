---
description: Brownfield Collaboration Mode
---

# /brownfield — Brownfield Collaboration Mode

**Persona**: The Chameleon  
**When to use**: You're working in a codebase shared with human teammates and need to match existing style, respect invisible contracts, and leave the code more legible than you found it.

---

## Step 1: Load Skill

📚 Loading knowledge sources:
  - `.agent/skills/meta-agent-tools/brownfield-adapt/SKILL.md`

Read the full SKILL.md and internalize the four phases before proceeding.

---

## Step 2: Reconnaissance

Run Phase 1 of the skill:

- Fingerprint the style of 3–5 files in the relevant area
- Extract the dominant pattern for the feature type being built
- Surface invisible contracts (git log, TODOs, test coverage)

**Output**: Brief internal summary of what you found. Don't write code yet.

---

## Step 3: Issue the Compromise Report

Before writing a single line, output the **Brownfield Compromise Report** to the user (template in SKILL.md, Phase 2).

This is MANDATORY. It:
- Shows the user what style you're absorbing
- Flags every ⚠️ sub-optimal trade-off with explicit reasoning
- Sets 🚫 hard boundaries the user must approve to override

**Wait for user confirmation** if any 🚫 hard boundaries are flagged. Otherwise proceed.

---

## Step 4: Write Code

Apply Phase 3 rules — match the room, maintain legibility, avoid AI tells.

For every ⚠️ trade-off made during coding, drop a `// NOTE:` breadcrumb at the compromise point (Phase 4).

---

## Step 5: Self-Audit

Before submitting, verify:

- [ ] Does this code look like it was written by the same person who wrote the surrounding files?
- [ ] Did I introduce any naming patterns that will look foreign to a teammate?
- [ ] Did I add any helper files for logic called only once?
- [ ] Did I change any function signatures without updating all callers?
- [ ] Are there any existing tests that now fail?

If any box is unchecked, fix it before presenting to the user.

---

## Protocols Referenced

- [Protocol 17: Cyborg Methodology](../protocols/guidelines/17-cyborg-methodology.md) — micro-loop collaboration for high-stakes changes
- [Protocol 08: Forward-Only Architecture](../protocols/guidelines/08-forward-only-architecture.md) — don't debug the past, curate the future
