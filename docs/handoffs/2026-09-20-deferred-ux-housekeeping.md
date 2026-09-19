# Handoff: Deferred UX Housekeeping — P1-6 & P1-7

**Date**: 2026-09-20  
**Workspace**: `c:\Users\Peace\Documents\vscode\Personal Projects\Alexandria - DCISM Thesis Repository`  
**Next Focus**: P1-6 Route-level state inventory + P1-7 Component unification sweep  

---

## Current State

These two tasks were explicitly deferred during the September 2026 sidebar polish session. All higher-priority items from the vibe critique report (P0-1 through P1-5) are either implemented or actively being addressed. P1-6 and P1-7 are **documentation and planning tasks** — no code is written until the inventory identifies a real gap.

The critique report that defines these tasks lives at:  
`docs/reports/ui-vibe-critique-report.md`

---

## Decisions Made

- P1-6 and P1-7 are **not blocked** by any pending code work — they are purely additive planning artifacts.
- Both tasks must produce a doc first; implementation follows only where a real gap is identified. Do not write code speculatively.
- Suggested execution order once resumed: P1-6 first (state matrix uncovers missing states), then P1-7 (component sweep uncovers unification candidates).

---

## Task Definitions

### P1-6 — Route-Level State Inventory Matrix

**Goal**: Produce a read-only table (one row per route, one column per state) that maps every public and authenticated route to its possible UI states.

**Columns**: `loading`, `empty`, `error`, `permission-denied`, `success`, `destructive/busy`

**Routes to cover at minimum**:
- `/` (landing)
- `/home` (browse + mine filter)
- `/home/[id]` (thesis detail)
- `/upload` (7-step wizard)
- `/profile`
- `/login` / `/register`
- Admin routes (if in scope)

**Output location**: `docs/references/state-inventory.md`

**Rule**: Only flag states that have *no* implemented handling. Do not re-audit already-polished states from the closed findings section of the critique report.

---

### P1-7 — Controlled Component Unification Sweep

**Goal**: Inventory repeated UI pattern families and agree a single contract for each before migrating.

**Suggested sweep order** (from the critique report):
1. Back / return controls
2. Icon-only utility actions (tooltips, aria-labels, size contract)
3. Confirmation shells (currently partially unified under `ConfirmDialog`)
4. Repeated status notice / inline error patterns

**Method**:
- For each family: find 3+ instances, note visual/behavior differences, agree a contract, document genuine exceptions.
- Do not introduce a new visual language or a universal component with page-name variants.

**Output location**: `docs/references/component-unification.md`

---

## Files and Artifacts

- `docs/reports/ui-vibe-critique-report.md` — source backlog and design rules
- `docs/DESIGN.md` — token and component contracts to reference during sweep

---

## Verification

- Ran: None (documentation tasks; no tests apply at planning stage)
- Still needed: Visual spot-check of each route in both themes before filling in the state matrix

---

## Open Questions

- Are admin routes in scope for the state inventory, or only the public/member shell?
- For P1-7, should `ConfirmDialog` be the canonical merge target for all confirmation surfaces, or does the review/admin context warrant a separate variant?

---

## Suggested BALAI Workflows

- `/plan` — use Kairou to scaffold the state matrix before writing `state-inventory.md`
- `/review-code` — read-only scan of each route file to populate the matrix quickly
- `/analyze-system` — use for the component unification sweep to surface all instances of a pattern family

---

## Risks

- State inventory scope creep: limiting columns to the six defined states prevents it from becoming a full QA test plan.
- Unification sweep causing unnecessary churn: enforce the "3+ instances before agreeing a contract" rule strictly.

---

## First Move For Next Agent

Read `docs/reports/ui-vibe-critique-report.md` §P1-6 and §P1-7, then list all route files under `Alexandria/app/` before touching any code. Use that list to scaffold the state matrix rows before filling in any cells.
