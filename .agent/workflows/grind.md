---
description: Metric-driven loop that iterates on code until a validation command passes
---

// turbo-all
# /grind — Autonomous Error Resolution Loop

---

## description: Metric-driven loop that iterates on code until a validation command passes

> **Scope**: Modifies project code. Does NOT modify skills or agent config.
> **Goal**: Relieve the developer of tedious fail-fix-verify cycles (TDD, type-checking, linting).

## When to Use

- You wrote unit tests, they are failing, and you just want the agent to make them pass.
- You have massive TypeScript errors (`tsc --noEmit`) after a refactor.
- You need to resolve a long list of repetitive linting warnings.

## Workflow

### Step 1: The Brief (Driver's Seat)

The user provides two things:
1. **The Target**: The specific file(s) or directory to be modified.
2. **The Metric**: The exact terminal command that defines success (e.g., `cmd /c npm run test:utils & REM \`). Success is strictly defined as **Exit Code 0**.

### Step 2: The Loop (Autonomous)

1. **Execute**: The agent runs the Metric command via terminal.
2. **Evaluate**: 
   - If **Exit Code 0**: The loop stops immediately. Proceed to Step 3.
   - If **Exit Code > 0**: The agent reads the error output in the terminal.
3. **Modify**: The agent uses the `replace_file_content` or `multi_replace_file_content` tools to adjust the Target code based strictly on the error output.
4. **Iterate**: The agent repeats the Execute -> Evaluate -> Modify cycle entirely autonomously.
5. **Hard Limit**: If the agent fails to reach Exit Code 0 after **5 consecutive attempts**, the loop aborts and returns control to the user, printing the final error state.

### Step 3: The Handoff

Upon successful completion (Exit Code 0):

1. The agent stops.
2. It presents a summary of what files were changed to satisfy the metric.
3. The user regains control of the session, knowing the code now passes the required constraints.

---

## Related Rules
- Terminal commands MUST adhere to the Terminal Blindness workaround (`cmd /c [command] & REM \`).
- The agent must NEVER run this command globally; it must be tightly scoped to the specific command the user provided.
