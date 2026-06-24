---
description: Extract rules from a Golden Example to optimize a target SKILL.md autonomously
---

# /train-skill-from-example — Autonomous Skill Optimization

---

## description: Extract rules from a Golden Example to optimize a target SKILL.md autonomously

> **Scope**: Modifies `.agent/skills/` files ONLY. Never touches project code.
> **Goal**: Permanently improve the agent's instructions without requiring domain expertise from the user.

## When to Use

- The agent is writing outdated or incorrect code for a specific framework.
- You want to teach the agent a new architecture, but don't know how to write the constraints yourself.
- You have a perfect "Golden Example" (a GitHub repo, Context7 docs, or a local file) that you want the agent to mimic from now on.

## Workflow

### Phase 1: The Sandbox (Extraction & Benchmark Generation)

1. **Target Identification**: The user specifies the target skill file (e.g., `react-native-skill.md`) and the Golden Example source (e.g., a GitHub URL or Context7 framework ID).
2. **Extraction**: The agent uses external MCPs (`github` or `upstash-context7`) to ingest the Golden Example.
3. **Drafting Benchmarks**: The agent extracts 3-5 rigid, actionable rules (benchmarks) that define why the Golden Example is "good".
4. **DRIVER'S SEAT GATE**: The agent PAUSES. It prints the proposed benchmarks to the user. **The loop does not proceed without human approval of these benchmarks.**

### Phase 2: The Grind (The Autonomous Loop)

Once the user approves the benchmarks:

1. **Copy**: The agent duplicates the target skill file to a temporary sandbox file (e.g., `react-native-skill_TEST.md`).
2. **Simulate**: The agent generates a dummy code snippet using the instructions in the `_TEST.md` file.
3. **Evaluate**: It scores the dummy code against the rigid benchmarks from Phase 1.
4. **Iterate**:
   - If the score is `< 100%`: The agent rewrites the instructions in the `_TEST.md` file to be stricter/clearer, and repeats the simulation.
   - If the score is `100%`: The loop ends successfully.
5. **Hard Limit**: The agent will automatically abort and report to the user if it cannot hit 100% after 10 iterations.

### Phase 3: The Handoff

1. The autonomous loop completes.
2. The agent generates a `git diff` comparing the original `SKILL.md` to the optimized `_TEST.md` sandbox file.
3. **DRIVER'S SEAT GATE**: The agent presents the diff to the user.
4. If the user approves, the agent overwrites the real `SKILL.md` file. The sandbox file is deleted.

---

## Output

- A strictly optimized `SKILL.md` file that has been mathematically proven (via simulation) to generate code that matches the Golden Example.
