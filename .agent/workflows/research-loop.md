---
description: Evidence-driven loop for improving BALAI workflows or skills from examples and benchmarks
---

# /research-loop — Evidence-Driven Workflow Improvement

---

## description: Evidence-driven loop for improving BALAI workflows or skills from examples and benchmarks

> **Purpose**: Improve BALAI OS instructions through measured experiments.
> **Primary Target**: `.agent/workflows/*.md`
> **Secondary Target**: `.agent/skills/**/SKILL.md`
> **Principle**: Candidate changes are tested in a sandbox and require user approval before replacing the source artifact.

## When to Use

- "Improve this workflow using a GitHub repo / YouTube transcript / docs page."
- "Make `/ingest` more reliable."
- "Test whether this workflow works in Codex and Antigravity."
- "Extract lessons from this golden example and apply them to a BALAI workflow."
- "Run an autoresearch-style loop on my agent instructions."

## Do Not Use When

- The user wants implementation code changed directly.
- There is no target workflow, skill, or benchmarkable behavior.
- The proposed improvement cannot be evaluated with examples, checks, or explicit criteria.
- The user has not approved replacing the real source artifact.

## Workflow

### Phase 1: Define The Experiment

Identify:

1. **Target Artifact**: the workflow or skill to improve.
2. **Research Source**: GitHub repo, docs URL, YouTube transcript, local file, prior session, or user-provided example.
3. **Benchmark Set**: 3-7 concrete checks the improved artifact must satisfy.
4. **Active Adapter**: Antigravity, Codex, Claude Code, Copilot, or generic BALAI.
5. **Stop Rule**: maximum iterations or time budget.

If the benchmark set is vague, stop and propose benchmarks first.

### Phase 2: Research And Extract Rules

Read only the source material needed for the target improvement.

Extract:

- Reusable principles.
- Specific failure modes to prevent.
- Required tool or adapter assumptions.
- Anti-patterns the current artifact should avoid.
- Concrete acceptance criteria.

Output the extracted rules before editing any candidate file.

### Phase 3: Driver's Seat Gate

Pause and ask for approval of:

- Target artifact.
- Benchmark set.
- Stop rule.
- Whether the loop may create a temporary sandbox candidate.

Do not proceed into iteration until the user approves these experiment terms.

### Phase 4: Create Sandbox Candidate

Copy or draft the target into a temporary candidate artifact.

Recommended names:

- `.agent/workflows/_research/<workflow-name>.candidate.md`
- `.agent/skills/_research/<skill-name>.candidate.md`

The candidate must preserve the original artifact's intent unless the user
explicitly approves a semantic change.

### Phase 5: Iterate

For each iteration:

1. **Simulate**: Run the target prompt, workflow scenario, or representative task against the candidate.
2. **Score**: Evaluate the result against every benchmark.
3. **Diagnose**: Identify the smallest instruction change that would improve the score.
4. **Revise Candidate**: Edit only the sandbox candidate.
5. **Stop Check**: Stop when all benchmarks pass or the stop rule is reached.

The loop must not modify the real target artifact during iteration.

### Phase 6: Diff And Review

Generate a comparison between:

- Original target artifact.
- Final sandbox candidate.

Report:

- Benchmarks passed and failed.
- Behavior changed.
- Adapter assumptions changed.
- Risks or unsupported assumptions.
- Recommended final action.

### Phase 7: Approval Gate

Ask the user whether to apply the candidate to the source artifact.

If approved:

1. Replace the source artifact with the candidate.
2. Delete or archive the temporary candidate if appropriate.
3. Run the active adapter's validation checks.

If not approved:

1. Leave the source artifact unchanged.
2. Keep or discard the candidate based on user preference.

## Output Format

```markdown
## Research Loop Report

**Target**: `.agent/workflows/example.md`
**Research Source**: [source]
**Active Adapter**: Codex / Antigravity / Other
**Iterations**: 3 / 5
**Verdict**: Apply / Revise / Reject

### Benchmarks

- [x] Benchmark 1
- [x] Benchmark 2
- [ ] Benchmark 3

### Extracted Rules

- Rule 1
- Rule 2

### Candidate Changes

- Change 1
- Change 2

### Risks

- Risk or stale assumption

### Next Action

Ask for approval to apply the candidate, or revise the benchmark set.
```

## Related

- `/train-skill-from-example` - Use when the target is specifically a skill and the golden example is already known.
- `/review-plan` - Use when the target is a planning artifact rather than an executable workflow.
- `/validate` - Use after applying a candidate to check the resulting system.
- `.agent/adapters/` - Use to resolve platform-specific execution details.
