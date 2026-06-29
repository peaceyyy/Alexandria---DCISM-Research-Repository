# Phase 8: Integration QA and Demo Polish

**Phase Goal**: Stabilize Alexandria for an end-to-end MVP demo, handoff, and presentation.

## Phase Metadata

**Phase Type**: QA
**Estimated Complexity**: Medium
**Estimated Time**: 4-6 hours
**Prerequisites**: Phases 1-7
**Primary Systems Affected**: Full stack, documentation, demo data, QA
**Dependencies**: Working frontend, Supabase project, seed data, auth accounts

## Feature Description

This phase makes the project reliable enough to present. Homer coordinates validation and documentation. Leira and Ethan polish visible workflows. Shane verifies database policy and seed quality. The team should produce a known-good demo path plus a known-limits list.

## User Impact

**User Story**:
As the project team, we want a stable MVP demo, so that we can confidently show Alexandria's thesis discovery and management workflows.

**Value Delivered**:

- Core student and admin flows work end to end.
- Demo data shows the difference between recommendations and lessons learned.
- Security boundaries are visibly tested.

## Context References

| Document | Sections | Why Read |
| --- | --- | --- |
| `.agent/project_specification.md` | Testing and Validation Strategy | Required checks |
| `docs/Alexandria PRD.md` | Success Criteria, Scope | MVP boundary |
| `docs/design-decision-log.md` | All | Decision traceability |

## Implementation Tasks

### Task 1: Run Static Validation

**Action**: Run lint and build/type checks that exist for the frontend.
**Files**: `Alexandria/package.json`
**Why**: Catch regressions before demo.
**Verification**: `npm.cmd run lint` passes; build/type check passes if configured.

### Task 2: Run Role-Based Manual QA

**Action**: Test anonymous, Student visitor, Contributor, and Admin flows.
**Files**: Recommended follow-up: `docs/qa-checklist.md`
**Why**: Role boundaries are core to the MVP.
**Verification**: Each role sees only the expected screens/actions.

### Task 3: Verify Data Quality

**Action**: Review seeded thesis records for complete metadata, useful tags, recommendations, and lessons.
**Files**: Supabase seeds and demo notes.
**Why**: Demo quality depends on realistic records.
**Verification**: At least 8-12 published theses, 2 drafts, and 1 archived thesis are available.

### Task 4: Polish UI States

**Action**: Review loading, empty, error, unauthorized, validation, and success states.
**Files**: Frontend pages/components.
**Why**: Demo reliability depends on non-happy-path clarity.
**Verification**: Every major page has visible fallback states.

### Task 5: Prepare Demo and Handoff Docs

**Action**: Write setup steps, demo script, account list placeholders, and known limits.
**Files**: Recommended follow-up: `docs/demo-script.md`, `README.md`
**Why**: Makes the project easier to present and maintain.
**Verification**: A teammate can run the demo using the docs without private knowledge.

## Exit Criteria

- [ ] Lint/build checks pass or failures are documented with owner.
- [ ] Role-based QA checklist passes.
- [ ] Demo data is realistic and complete.
- [ ] Documentation explains setup, roles, and demo path.
- [ ] Known limits are documented honestly.

## What You Will Learn

**Technical Skills**:

- End-to-end validation across frontend, backend, database, and storage.
- Demo data and presentation readiness.

**Conceptual Understanding**:

- How to prove MVP scope without overbuilding.
- How to communicate known limits responsibly.

**Tools and Patterns**:

- QA checklists.
- Demo scripts and handoff notes.

## Notes and Gotchas

**Common Issues**:

- Do not call the MVP complete until protected PDF access and role boundaries are tested.
- Do not hide known limits; list them clearly.
- Seed data must demonstrate recommendations vs lessons learned.

**Dependencies**:

- Completed feature phases.
- Stable Supabase environment.
