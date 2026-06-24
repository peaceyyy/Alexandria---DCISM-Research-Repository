---
description: Create a compact continuation packet for a fresh agent or future session
---

# /handoff - Fresh Agent Continuation Packet

---

## description: Create a compact continuation packet for a fresh agent or future session

> **Purpose**: Let another agent continue without rereading the whole conversation.
> **Source Inspiration**: Matt Pocock's `handoff` skill.
> **Scope**: Session continuation, not full task completion reporting.

**Project Workflows output convention**: Save generated handoffs under root `docs/`. Do not place project-facing handoff artifacts inside `.agent/` or `.codex/`; those directories are template/instruction infrastructure.

## When to Use

- "Hand this off."
- "Prepare the next agent."
- "Summarize for the next session."
- Ending a long conversation with unfinished work.
- Moving work between Codex, Antigravity, Claude Code, or Copilot.
- Switching from planning to implementation in a new thread.

## Relationship To Existing Workflows

Use `/handoff` when the next agent needs current conversational state.

Use `/report-task` when a completed task needs integration details, validation,
and handoff notes for parallel work.

Use `/session-log` when the goal is chronological project history or meeting-style
minutes.

Do not duplicate existing artifacts. Link to plans, reports, commits, diffs, ADRs,
or docs by path instead.

## Workflow

### Step 1: Identify Next Session Focus

If the user provides an argument, treat it as the next session's intended focus.

Examples:

- "Continue adapter migration."
- "Implement phase 3."
- "Review the prototype findings."

If no focus is provided, infer it from the current conversation and state the
assumption.

### Step 2: Gather Minimal Continuation Context

Capture only what a fresh agent needs:

- Current goal.
- Current repo or workspace.
- Files changed or created.
- Decisions already made.
- Open questions.
- Blockers and risks.
- Verification already run.
- Verification still needed.
- Relevant adapters, workflows, or skills to invoke.

### Step 3: Redact Sensitive Content

Never include:

- API keys.
- Passwords.
- Tokens.
- Private personal data.
- Full `.env` contents.
- Secrets copied from terminal output.

Mention that sensitive values were intentionally omitted if relevant.

### Step 4: Choose Output Location

Default target:

```text
docs/handoffs/YYYY-MM-DD-[short-focus].md
```

If the handoff is temporary and should not enter the repo, use the active
adapter's temp directory policy instead.

Ask before creating a repo-local handoff if the user has not already approved
writing it.

### Step 5: Write The Handoff

Use this structure:

```markdown
# Handoff: [focus]

**Date**: [date]
**Workspace**: [path]
**Next Focus**: [focus]

## Current State

[short summary]

## Decisions Made

- [decision]

## Files And Artifacts

- `[path]` - [why it matters]

## Verification

- Ran: [command/result]
- Still needed: [command/check]

## Open Questions

- [question]

## Suggested BALAI Workflows

- `/workflow` - [why]

## Risks

- [risk]

## First Move For Next Agent

[single recommended first action]
```

## Step 6: Keep It Compact

Rules:

- Prefer links/paths over pasted content.
- Summarize decisions, not full debate.
- Mention uncertainty plainly.
- Include only the next useful action.

## Related

- `/report-task` - Use for completed task integration reports.
- `/session-log` - Use for chronological project recordkeeping.
- `/onboard` - Use when starting from an existing handoff.
- `/research-loop` - Use when the handoff identifies workflow improvement work.
