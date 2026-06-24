---
description: Metric-driven loop that iterates on code to pass a validation command, concluding with an educational debrief
---

// turbo-all

# /auto-resolve-errors — Autonomous Error Resolution & Tutor Loop

---

## description: Metric-driven loop that iterates on code to pass a validation command, concluding with an educational debrief.

> **Scope**: Modifies project code. Does NOT modify skills or agent config.
> **Philosophy**: The agent absorbs the repetitive trial-and-error typing, but surfaces the root cause and the lesson so the developer levels up.

## When to Use

- You have a failing test suite (`npm run test`) and want the agent to fix the implementation.
- You have massive TypeScript errors (`tsc --noEmit`) after a refactor.
- You don't know how to write a unit test for a feature and need the agent to teach you _before_ fixing the code.

## Workflow

### Step 1: The Pre-Flight (Learning to Test)

1. The user provides the Target file(s).
2. The user provides the Validation Metric (e.g., `cmd /c npm run test:utils & REM \`).
3. **If the user DOES NOT know the metric:** The agent MUST stop. The agent will draft the validation command/test suite, explain the underlying philosophy (e.g., "Here is how we mock the JWT"), and wait for the user to understand and approve the metric before proceeding.

### Step 2: The Loop (Autonomous Execution)

Once the metric is set, the agent enters a strict loop:

1. **Execute**: The agent runs the Metric command via terminal.
2. **Evaluate**:
   - If **Exit Code 0**: The loop stops immediately. Proceed to Step 3.
   - If **Exit Code > 0**: The agent reads the error output in the terminal.
3. **Modify**: The agent uses the `replace_file_content` tool to adjust the Target code based strictly on the error output.
4. **Iterate**: The agent repeats the Execute -> Evaluate -> Modify cycle entirely autonomously.
5. **Hard Limit**: If the agent fails to reach Exit Code 0 after **5 consecutive attempts**, the loop aborts and returns control to the user, printing the final error state.

### Step 3: The Post-Mortem (Learning the Fix)

Upon successful completion (Exit Code 0), the agent MUST NOT just hand over the code. The agent MUST present an **Educational Debrief** containing:

1. **The Root Cause**: The exact conceptual misunderstanding or bug that caused the initial failure.
2. **The Aha! Moment**: What the agent specifically changed to satisfy the metric (e.g., "React batching required functional state updates").
3. **The Lesson**: A brief, generalized rule the developer can take away to avoid this in the future without relying on the workflow.

---

## Related Rules

- Terminal commands MUST adhere to the Terminal Blindness workaround (`cmd /c [command] & REM \`).
- The agent must NEVER run this command globally; it must be tightly scoped to the specific command the user provided.
