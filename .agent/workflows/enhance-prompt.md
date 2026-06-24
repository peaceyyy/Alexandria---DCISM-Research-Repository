---
description: Enhances a draft prompt into an agent-ready, context-engineered prompt
---

# /enhance-prompt — Agentic Prompt Engineering

> **Purpose**: Refine user-drafted prompts into high-efficiency, low-token, context-engineered instructions for AI agents.
> **Related Protocols**: Protocol 85 (Token Hygiene), Protocol 240 (Context Engineering), Protocol 142 (Anti-Hallucination)
> **Relevant Skills**: `plan-writing`, `documentation-templates`

## 🧠 Core Principles

1. **Context Engineering (Protocol 240)**: Don't just instruct; equip the agent. Replace vague requests to "figure it out" with targeted "cheat sheets" (e.g., exact file references, dependency lists, and architectural guidelines).
2. **Token Hygiene (Protocol 85)**: Condense instructions. Remove conversational filler and polite fluff. Reference files via absolute/relative paths rather than pasting large blocks of code.
3. **Structural Grounding (Protocol 142)**: Ground all outcomes in verifiable files. Instruct the agent to base claims and implementations strictly on the local workspace rather than parametric memory.

---

## 🛠️ Workflow Steps

### Step 1: Deconstruct & Analyze Draft

1. **Identify the Core Objective**: Strip away the conversational wrapper to find the exact delta or analysis required.
2. **Audit Token Load**: Identify any pasted code, excessive context, or ambiguous descriptions that can degenerate into hallucinations.
3. **Map Dependencies**: What files, skills, or existing context does the agent actually need to complete this task?

### Step 2: Reconstruct using the "Agentic Framework"

Rewrite the prompt using a declarative, sectioned format:

- **[Context]**: Point the agent to the actual "open book" facts.
  - "Read `src/feature/api.ts` for the current endpoints."
  - "Load `.agent/skills/[relevant-skill]/SKILL.md`."
- **[Task]**: A rigorous, imperative statement of the goal.
  - "Refactor the authentication middleware to use JWT tokens."
- **[Constraints]**: Absolute boundaries to prevent scope creep.
  - "Do NOT modify the frontend components."
  - "Do NOT use default exports."
- **[Verification]**: How the agent must prove success.
  - "Cite the specific file locations for all changes."
  - "Run `npm run test` and confirm it passes."

### Step 3: Condensation & Polish (The Token Scrub)

- **Trim Fat**: Remove "Please", "Can you", "I think we should". Use imperative commands: "Update", "Refactor", "Analyze".
- **Enforce Links**: Replace all pasted snippets with direct paths (e.g., `path/to/script.ts`).

---

## 📝 Example Transformation

### ❌ Before (The Anti-Pattern)

_High token usage, prone to hallucination, lacks constraints._

> "Can you please help me fix the bugs in the login page? The forms aren't working right, and the API gives a 500 error when I submit. I think the issue is in the backend but I'm not sure. Here is the whole file for the frontend: [500 lines of pasted code]."

### ✅ After (The Context-Engineered Prompt)

_Low token usage, highly grounded, precise constraints._

> **Task**: Resolve the 500 error during form submission on the login page.
>
> **Context**:
>
> - Frontend: `src/components/Login.tsx`
> - Backend: `src/api/auth.ts`
>
> **Constraints**:
>
> - Check backend logs or logic first; do NOT rewrite the frontend layout.
> - Ensure error handling follows `.agent/skills/core-engineering/error-handling/SKILL.md`.
>
> **Verification**:
>
> - Provide exact diffs for any modified files.
> - Confirm the fix by validating the payload shape expected by `auth.ts`.
