# Protocol 01: Token Hygiene

> **Source**: Harvested from `ykdojo/claude-code-tips` (Dec 2025)
> **Principle**: "AI context is like milk; it's best served fresh and condensed!"

---

## Core Philosophy

Token budget is a non-renewable resource within a session. Proactive monitoring prevents context degradation before symptoms appear (hallucinations, lost instructions, repetition).

---

## Metrics

| Threshold | Zone | Action |
|-----------|------|--------|
| 0-50% | 🟢 Green | Normal operation |
| 50-70% | 🟡 Yellow | Consider handoff doc |
| 70-85% | 🟠 Orange | Create handoff, prepare fresh start |
| 85%+ | 🔴 Red | STOP. Handoff mandatory. |

---

## Proactive Compaction Protocol

**Trigger**: Yellow zone (50%+) OR 10+ substantive exchanges

**Action**:

1. Create `HANDOFF.md` summarizing:
   - Goal
   - Progress (what worked, what didn't)
   - Next steps
2. Start fresh session
3. Load handoff: `> path/to/HANDOFF.md`

---

## Token Budget Check

Run periodically:

```bash
python3 .agent/scripts/token_budget.py
```

---

## Anti-Patterns

| Bad | Good |
|-----|------|
| Letting context fill to 90%+ | Proactive handoff at 70% |
| Repeating full context each turn | Reference by file path |
| Loading all modules on /start | Adaptive loading (Protocol 77) |

---

## Integration

- Works with: Protocol 77 (Adaptive Latency), Protocol 45 (Context Compaction)
- Enforced by: `/end` workflow (session telemetry)

---

## Tags

# token #context #hygiene #compaction #harvested

---

## Tagging

#protocol #framework #process #01-token-hygiene
