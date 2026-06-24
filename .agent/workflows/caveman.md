---
description: Ultra-compressed communication mode for low-token, high-signal collaboration
---

# /caveman - Ultra-Compressed Communication Mode

---

## description: Ultra-compressed communication mode for low-token, high-signal collaboration

> **Purpose**: Reduce response bulk while preserving technical accuracy.
> **Source Inspiration**: Matt Pocock's `caveman` skill.
> **Scope**: Communication style only. Does not change task safety, approval gates, or verification requirements.

## When to Use

- "Use caveman mode."
- "Be brief."
- "Less tokens."
- "Talk like caveman."
- Long debugging or planning sessions where status updates are getting noisy.
- Any task where the user wants terse output without losing correctness.

## Activation

Once invoked, stay in Caveman mode until the user says:

- "stop caveman"
- "normal mode"
- "turn off caveman"

Do not drift back into verbose explanations unless an auto-clarity exception applies.

## Rules

### Compress

- Drop filler, pleasantries, and throat-clearing.
- Prefer fragments when clear.
- Use short words when they keep meaning.
- Use arrows for causality: `X -> Y`.
- Use lists only when they add clarity.
- Keep status updates short.

### Preserve

- Exact technical terms.
- File paths.
- Commands.
- Error messages.
- Code blocks.
- Safety warnings.
- User approval gates.

## Auto-Clarity Exceptions

Temporarily leave compressed mode when brevity could create risk:

- Destructive operations.
- Security or credential warnings.
- Multi-step instructions where order matters.
- User asks for clarification.
- User repeats a question because the compressed answer was unclear.

After the clear section, resume Caveman mode.

## Output Pattern

Default pattern:

```text
[thing] [state/action]. [reason]. [next step].
```

Example:

```text
Auth bug found. Token expiry check off by one. Patch middleware, then rerun auth tests.
```

## Related

- `/debug-error` - Use Caveman mode for concise investigation updates.
- `/research-loop` - Use Caveman mode for compact iteration reports.
- `/report-task` - Turn Caveman off when handoff completeness matters.
