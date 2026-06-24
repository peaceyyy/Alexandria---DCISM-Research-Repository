# 21 — Decision Elicitation Protocol

> **Purpose**: Gather high-quality user input during the planning phase by distinguishing between *technical choices* (answered via MCQ) and *experiential/contextual choices* (answered via open-ended questions).
> **Trigger**: Any time Kairou drafts an `implementation_plan.md` and encounters unresolved architectural, library, or structural decisions.

---

## Core Rule: Questions Are NOT Commentary

Decision questions are **blocking gates**, not suggestions. They must be answered before the plan is finalized. Each question is annotated in the plan artifact using Antigravity's annotation system.

---

## Question Type Classification

### Type 1: MCQ — Technical Decisions

Use when the decision space is **bounded and well-understood** — e.g., choosing a database, an auth strategy, a caching layer, a rendering model.

**Criteria for MCQ:**
- There are 2–4 meaningful options
- Each option has a distinct trade-off profile
- The "right" answer depends on constraints (scale, team, cost, speed)

**Format:**

```
> [!IMPORTANT]
> **[Decision Label]** — *Choose one. Your answer will be baked into the plan.*
>
> - A) **[Option Name]** — [1-sentence rationale for why this is even an option]
> - B) **[Option Name]** — [1-sentence rationale for why this is even an option]
> - C) **[Option Name]** — [1-sentence rationale for why this is even an option]
>
> ❓ *Kairou's lean: Option [X] — because [brief architectural reason].*
```

**Rules:**
- Always 2–4 options. Never 5+.
- Each option's mini-explanation must address **why it's a viable candidate**, not argue against the others.
- The `Kairou's lean` line is **mandatory** — Kairou always has an informed recommendation. It must state *why*.
- The lean must NOT be a hedge. "It depends" is not a lean.

---

### Type 2: Open-Ended — Experiential / Contextual Decisions

Use when the decision space is **unbounded** and depends on user knowledge, team conventions, existing infrastructure, or aesthetic judgment.

**Criteria for Open-Ended:**
- There is no universally "correct" answer
- The user has direct experience or existing constraints that Kairou cannot infer
- The answer shapes the *approach*, not just the *choice*

**Format:**

```
> [!NOTE]
> **[Decision Label]** — *Your context shapes the answer here.*
>
> [1–2 sentence framing of the question — what is Kairou trying to understand?]
>
> ❓ *Example answers: "[example A]" / "[example B]" / "I don't have a preference"*
```

**Rules:**
- The framing must give the user enough context to answer intelligently.
- Always provide example answers — never leave a blank prompt.
- These questions surface user knowledge, team norms, or experiential data that Kairou doesn't have.

---

## Integration with Antigravity Annotation System

All decision blocks use Antigravity's standard GFM alert annotations:

| Alert Type | Used For |
|---|---|
| `[!IMPORTANT]` | MCQ / technical binary decisions |
| `[!NOTE]` | Open-ended / contextual questions |
| `[!WARNING]` | Decisions with high risk of lock-in or irreversibility |
| `[!CAUTION]` | Decisions that involve external costs, breaking changes, or security |
| `[!TIP]` | Kairou's architectural lean or recommended default |

Decisions are placed **inline within the plan**, immediately before the tasks they affect — not in a separate "Questions" section at the bottom.

---

## Placement Rule

Decision questions are placed **before the tasks that depend on them**:

```
## Phase 2: Data Layer

> [!IMPORTANT]
> **Database Engine** — ...MCQ...

- [ ] Task 2.1: Initialize DB schema
- [ ] Task 2.2: Write migration files
```

This ensures the plan remains incomplete (and clearly so) until the user resolves the gate.

---

## Density Rule

> **Rule**: Maximum **3 decision blocks per plan phase**. If more are needed, collapse lower-stakes decisions into a single block with a table.

| Decision | Option A | Option B | Lean |
|---|---|---|---|
| Session store | Redis | DB-backed | Redis (latency) |
| Rate limiting | Express middleware | API Gateway | Gateway (decoupled) |

---

## Completion Signal

When all decisions are resolved, the plan's header annotation changes from:

```
> [!WARNING]
> **Plan Status: PENDING DECISIONS** — X questions require your input before implementation begins.
```

to:

```
> [!TIP]
> **Plan Status: READY** — All decisions resolved. Implementation may begin.
```
