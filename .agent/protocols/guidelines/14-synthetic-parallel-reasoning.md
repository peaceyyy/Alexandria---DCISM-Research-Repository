# Protocol 14: Synthetic Parallel Reasoning (Deep Think Emulation)

> **Purpose**: Replicate Gemini 3 Deep Think's parallel reasoning via protocol-level execution.
> **Status**: ACTIVE (Dec 2025)
> **Tags**: `#reasoning` `#architecture` `#parallel` `#protocol` `#synthetic` `#deep-think`

---

## 1. Overview

All non-trivial problems are processed through **three parallel tracks** before synthesis:

| Track | Role | Core Question |
|-------|------|---------------|
| **A: Domain-Native** | Apply arena-specific protocols | "What does domain expertise say?" |
| **B: Adversarial** | Challenge premises, find flaws | "What could go wrong?" |
| **C: Cross-Domain** | Isomorphic pattern search | "Where have I seen this before?" |
| **D: Zero-Point** | Metaphysical Inversion (Deep Think) | "What if the opposite is true?" |

---

## 2. Dispatch Flow

```
INPUT
  │
  ├──► Track A (Domain) ──┐
  ├──► Track B (Adversarial) ──┼──► SYNTHESIS ──► LAWS CHECK ──► OUTPUT
  ├──► Track C (Cross-Domain) ──┤
  └──► Track D (Zero-Point) ────┘
```

All four tracks run **simultaneously**, not sequentially.

---

## 3. Track Specifications

### Track A: Domain-Native Analysis

- Load relevant protocols from SKILL_INDEX based on arena
- Apply standard frameworks (SDR for Career, Arbitrage for Business, etc.)
- Output: Primary recommendation with supporting analysis

### Track B: Adversarial

- Challenge the user's premise (Protocol 40: Frame vs Structural)
- Identify ruin vectors (Law #1)
- Check for Type B (structural) vs Type A (variance) losses
- Output: Risk assessment, premise flaws, failure modes

### Track C: Cross-Domain

- Invoke Protocol 67 (Cross-Pollination)
- Search case studies for isomorphic patterns
- Pull insights from unrelated arenas
- Output: At least one non-obvious parallel from another domain

### Track D: Zero-Point (Deep Think)

- Invoke Protocol 140 (Inversion)
- Apply "Backwards Law" and "First Principles"
- Question the nature of the reality/problem itself
- Output: Metaphysical/Philosophical perspective reframing the "Game"

---

## 4. Synthesis Rules

When tracks converge → output the consensus.

When tracks **conflict** → apply priority order:

1. **Laws** (Law #1-4) — absolute veto
2. **Track B** (Adversarial) — if ruin risk identified, flag prominently
3. **Track A** (Domain) — primary recommendation
4. **Track C** (Cross-Domain) — enrichment, not override
5. **Track D** (Deep Think) — contextual grounding (the "Why")

---

## 5. Transparency Protocol

### Default (Simple Queries)

- Single integrated response
- No visible track breakdown

### Triggered (Complex/High-Stakes)

Show explicit track breakdown when:

- Tracks diverge significantly
- User invokes `/think` or `/ultrathink`
- Problem involves >5% ruin risk
- User explicitly asks for full analysis

### Format When Visible

```
## Track A (Domain): [Arena Name]
[Analysis]

## Track B (Adversarial)
[Challenges / Risks]

## Track C (Cross-Domain)
[Isomorphic pattern from X domain]

## Track D (Zero-Point)
[Metaphysical Inversion / First Principles]

## Synthesis
[Integrated recommendation]
```

---

## 6. Lateral Enrichment

Each track receives **lateral input** at runtime:

- Track A pulls risk data from Track B before finalizing
- Track B checks cross-domain failure patterns from Track C
- Track C searches within domain for sub-arena patterns
- Track D challenges the "Reality" of all prior tracks

This is NOT sequential handoff — it's **concurrent enrichment**.

---

## 7. Quick Reference

| Situation | Behavior |
|-----------|----------|
| Simple factual query | Skip parallel, direct answer |
| Strategic decision | Full 3-track with synthesis |
| `/think` invoked | 3-track visible + deep analysis |
| Ruin risk detected | Track B gets priority, explicit warning |

---

## References
- [Protocol 115: First Principles Deconstruction](examples/protocols/decision/11-first-principles-deconstruction.md)

- [Core_Identity.md](docs/ARCHITECTURE.md) — Laws #1-4
- [Protocol 67](../research/67-cross-pollination.md) — Cross-Domain Isomorphism
- [Protocol 140](examples/protocols/decision/12-base-rate-audit.md) — Zero-Point Inversion
- [Protocol 40](../decision/40-frame-vs-structural-problem.md) — Frame vs Structural

---

## Tagging

# protocol #framework #14-synthetic-parallel-reasonin
