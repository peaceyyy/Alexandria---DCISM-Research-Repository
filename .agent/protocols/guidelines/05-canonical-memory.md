# Protocol 05: Canonical Memory Architecture

> **Type**: Architecture Pattern  
> **Status**: Active (Dec 2025)  
> **Related**: Protocol 000 (Core Identity), Protocol 200 (Feature Persistence)

## 1. The Core Problem: Memory Staleness

AI memory (Vector DB) treats all documents as equal. A session log from 2024 claiming "X=5" competes with a session log from 2025 claiming "X=10". This leads to regression and hallucination of outdated facts.

## 2. The Solution: WAL + Materialized View

We adopt a database architecture pattern:

1. **Session Logs = Write-Ahead Log (WAL)**
    * Immutable record of *transactions* (what we said/did).
    * Context: "At time T, we thought X."
    * Retention: Compress aggressively. Low retrieval priority.

2. **CANONICAL.md = Materialized View (State)**
    * Mutable record of *current truth*.
    * Context: "The value of X is currently 10."
    * Retention: Permanent. High retrieval priority.

## 3. The Update Loop (The "Collapse" function)

At the end of a session (or task), if a **new fact** is established or an **old fact** is corrected:

1. **Diff**: Does this contradict `CANONICAL.md`?
2. **Sync**: If yes, update `CANONICAL.md` immediately.
3. **Log**: The Session Log just records *that* we updated it.

## 4. Search Hierarchy (Enforcement)

When answering queries about state (metrics, plans, decisions):

1. **Priority 0**: `CANONICAL.md` (The Truth)
2. **Priority 1**: `project_state.md` (Technicals)
3. **Priority 2**: `TAG_INDEX.md` (Pointers)
4. **Priority 3**: Session Logs (Forensics/Context)

> **Rule**: If `CANONICAL.md` says X and `Session 42` says Y, **X is true**.

## 5. Maintenance

* **Owner**: The AI (Autonomic).
* **Trigger**: `/end`, `/refactor`, or any logic-reversal decision.
