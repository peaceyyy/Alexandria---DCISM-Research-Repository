---
description: Coordinate multiple agents for complex tasks. Use for multi-perspective analysis, comprehensive reviews, or tasks requiring different domain expertise.
---

# Multi-Agent Orchestration (BALAI OS Edition)

You are now in **ORCHESTRATION MODE**. Your task: coordinate specialized agents to solve this complex problem.

## Task to Orchestrate

$ARGUMENTS

---

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
>
> If you use fewer than 3 agents, you are NOT orchestrating - you're just delegating.
>
> **Validation before completion:**
>
> - Count invoked agents
> - If `agent_count < 3` → STOP and invoke more agents
> - Single agent = FAILURE of orchestration

### Agent Selection Matrix

| Task Type      | REQUIRED Agents (minimum)                                      |
| -------------- | -------------------------------------------------------------- |
| **Web App**    | `Sparks`, `backend-specialist`, `qa-automation-engineer`       |
| **API**        | `backend-specialist`, `security-auditor`, `database-architect` |
| **Full Stack** | `Kairou`, `Sparks`, `backend-specialist`, `devops-engineer`    |
| **Mobile**     | `Kairou`, `mobile-developer`, `backend-specialist`             |
| **Game**       | `Kairou`, `game-developer`, `seo-specialist`                   |
| **Debug**      | `Janitor`, `backend-specialist`, `qa-automation-engineer`      |
| **Security**   | `security-auditor`, `devops-engineer`, `backend-specialist`    |

---

## Pre-Flight: Mode Check

| Current Mode | Task Type          | Action                                                |
| ------------ | ------------------ | ----------------------------------------------------- |
| **plan**     | Any                | ✅ Proceed with `Kairou` first                        |
| **edit**     | Simple execution   | ✅ Proceed directly                                   |
| **edit**     | Complex/multi-file | ⚠️ Ask: "This task requires planning. Invoke Kairou?" |

---

## 🔴 STRICT 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential)

| Step | Agent                           | Action                       |
| ---- | ------------------------------- | ---------------------------- |
| 1    | `Kairou`                        | Create/Verify Roadmap & Spec |
| 2    | (optional) `code-archaeologist` | Codebase discovery if needed |

> 🔴 **NO OTHER AGENTS during planning!** Only Kairou and Archaeologist.

### ⏸️ CHECKPOINT: User Approval

```
After Plan is complete, ASK:

"✅ Plan created. Do you approve? (Y/N)"
```

### PHASE 2: IMPLEMENTATION (Parallel agents after approval)

| Parallel Group | Agents                                      |
| -------------- | ------------------------------------------- |
| Foundation     | `database-architect`, `security-auditor`    |
| Core           | `backend-specialist`, `Sparks`              |
| Polish         | `qa-automation-engineer`, `devops-engineer` |

> ✅ After user approval, invoke multiple agents in PARALLEL.

---

## Available Agents

### Protocols (Personas)

- **`Kairou`**: Planning, Archtecture
- **`Sparks`**: Frontend, Vibe, UI
- **`Janitor`**: Refactoring, Fixes
- **`Arc`**: Teaching

### Specialists (Agents)

- **`backend-specialist`**: Server, API
- **`database-architect`**: SQL, Schema
- **`mobile-developer`**: React Native, Flutter
- **`game-developer`**: Unity, Game Logic
- **`devops-engineer`**: CI/CD, Docker
- **`security-auditor`**: OWASP, Audit
- **`qa-automation-engineer`**: E2E, Testing
- **`seo-specialist`**: SEO, GEO
- **`task-orchestrator`**: Coordination

---

## Orchestration Protocol

### Step 1: Analyze Task Domains

Identify ALL domains this task touches.

### Step 2: Phase Detection

| If Plan Exists           | Action                            |
| ------------------------ | --------------------------------- |
| NO Plan                  | → Go to PHASE 1 (Invoke `Kairou`) |
| YES Plan + User Approved | → Go to PHASE 2 (Implementation)  |

### Step 3: Execute Based on Phase

**PHASE 1 (Planning):**

```
Use Kairou to create PLAN.md
→ STOP after plan is created
→ ASK user for approval
```

**PHASE 2 (Implementation):**

```
Invoke agents in PARALLEL:
Use Sparks to [frontend task]
Use backend-specialist to [backend task]
Use qa-automation-engineer to [verify]
```

**🔴 CRITICAL: Context Passing (MANDATORY)**

When invoking ANY subagent, you MUST include:

1. **Original User Request**
2. **Current Plan State**

### Step 4: Verification (MANDATORY)

The LAST agent must run verification.

### Step 5: Synthesize Results

Combine all agent outputs into unified report.

---

## 🔴 EXIT GATE

Before completing orchestration, verify:

1. ✅ **Agent Count:** `invoked_agents >= 3`
2. ✅ **Plan Exists:** Kairou was consulted
3. ✅ **Report Generated:** Orchestration Report with all agents listed

> **If any check fails → DO NOT mark orchestration complete.**
