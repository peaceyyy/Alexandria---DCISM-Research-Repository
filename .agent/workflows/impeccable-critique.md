---
description: Read-only design critique with heuristics, persona lenses, and AI-slop detection
---

# /impeccable-critique - Design Review

---

## description: Read-only design critique with heuristics, persona lenses, and AI-slop detection

> **Purpose**: Decide whether a finished interface reads as intentional.
> **Source Inspiration**: Impeccable `/impeccable critique`.
> **Mode**: Read-only unless the user separately asks for fixes.

## When to Use

- Page is functionally done and needs an honest design review.
- UI might look generic or agent-generated.
- User asks "is this any good?"
- Before `/impeccable-polish`.
- Before shipping an important page.

Do not use on incomplete placeholder work. It will produce noisy findings.

## Workflow

### Step 1: Gather Evidence

Read:

- `docs/DESIGN.md`
- Target page/component source.
- Relevant shared components and tokens.

If available, inspect the live page with browser automation and screenshots.

### Step 2: Run Two Independent Passes

**Pass A: Design Review**

Assess:

- Nielsen-style usability heuristics.
- Cognitive load.
- Visual hierarchy.
- Product/audience fit.
- Emotional journey through the flow.
- Design-system consistency.

**Pass B: AI-Slop Detection**

Flag concrete tells:

- Purple-pink gradients.
- Cyan neon dark-mode glow.
- Gradient text.
- Generic centered CTAs.
- Nested cards.
- Lucide-icon filler patterns.
- Monochrome beige/gray wall.
- Inconsistent spacing or random one-off styling.
- Default typography that does not match brand.

### Step 3: Persona Lenses

Test through 2-4 relevant personas.

Examples:

- Returning user in a hurry.
- Skeptical first-time evaluator.
- Admin scanning dense data.
- Mobile user with one hand.
- Buyer comparing alternatives.

Score each persona from `0` to `4` and explain the main reason.

### Step 4: Merge Findings

Return:

- What works.
- AI-slop verdict: pass/fail with specific tells.
- Heuristic scores.
- Cognitive-load failures.
- Three to five priority issues.
- Questions the interface cannot answer by itself.
- Recommended next workflow.

Do not patch code during critique.

## Output Format

```markdown
## Impeccable Critique Report

**Target**: [page/component]
**AI-Slop Verdict**: Pass / Fail
**Overall Verdict**: Ready / Needs polish / Needs redesign / Blocked

### Scores

- Visibility of status: 0-4
- Match with real world: 0-4
- Consistency and standards: 0-4
- Error prevention: 0-4
- Recognition over recall: 0-4

### Persona Tests

- [persona]: [score]/4 - [reason]

### Priority Issues

1. **[severity] [issue]**
   - Why: [reason]
   - Fix: [recommendation]

### Provocative Questions

- [question]

### Next Workflow

- `/impeccable-polish` / `/impeccable-layout` / `/impeccable-typeset` / `/impeccable-colorize`
```

## Related

- `/ui-audit` - Broader UI/UX audit.
- `/vibe-check` - Anti-vibe checklist pass.
- `/impeccable-polish` - Fix small final issues after critique.
