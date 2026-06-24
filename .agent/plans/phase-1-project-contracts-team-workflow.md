# Phase 1: Project Contracts and Team Workflow

**Phase Goal**: Convert the PRD into stable implementation contracts, team responsibilities, and mockable payloads.

## Phase Metadata

**Phase Type**: Foundation
**Estimated Complexity**: Medium
**Estimated Time**: 2-3 hours
**Prerequisites**: None
**Primary Systems Affected**: Documentation, frontend contracts, backend contracts, database planning
**Dependencies**: `.agent/project_specification.md`, `docs/Alexandria PRD.md`, `docs/database-engineer-reference.md`, `docs/design-decision-log.md`

## Feature Description

This phase turns the product decisions into a team operating contract. Homer owns coordination and API/data contracts. Shane uses the database reference to design the Supabase foundation. Leira and Ethan can begin interface work from agreed mock payloads without waiting for live database access.

## User Impact

**User Story**:
As a project team, we want clear contracts and ownership, so that frontend, backend, and database work can happen in parallel without drifting.

**Value Delivered**:

- Everyone knows which phase they are working on.
- Frontend work can start from mock data.
- Database decisions have a review path before implementation.
- Core product decisions remain traceable.

## Context References

| Document | Sections | Why Read |
| --- | --- | --- |
| `.agent/project_specification.md` | All | Main implementation contract |
| `docs/Alexandria PRD.md` | Product Decisions, Functional Requirements | Product scope and user behavior |
| `docs/database-engineer-reference.md` | Recommended Tables, RLS, Seed Data | Database handoff |
| `docs/design-decision-log.md` | All accepted decisions | Traceability for locked choices |
| `frontend/AGENTS.md` | All | Next.js version warning before coding |

## Implementation Tasks

### Task 1: Confirm Team Board Structure

**Action**: Keep `phases/general` for the big picture and role folders for teammate task boards.
**Files**: `phases/general/roadmap.md`, `phases/Homer/tasks.md`, `phases/Leira/tasks.md`, `phases/Ethan/tasks.md`, `phases/Shane/tasks.md`
**Why**: Prevents task ownership from being mixed with global phase context.
**Verification**: Each role file lists phase-specific responsibilities and handoff expectations.

### Task 2: Draft API Response Shapes

**Action**: Define the initial payload shapes for thesis cards, thesis detail, auth profile, admin list rows, and publish validation errors.
**Files**: Recommended follow-up: `docs/api-contracts.md` or `frontend/app/lib/mock-data/*`
**Why**: Allows frontend work to proceed before live endpoints are complete.
**Verification**: Leira and Ethan can build views without inventing their own data shapes.

### Task 3: Draft Environment Contract

**Action**: Document required environment variables without real credentials.
**Files**: Recommended follow-up: `frontend/.env.example`
**Why**: Makes Supabase setup reproducible across machines.
**Verification**: Required keys include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, optional `SUPABASE_SERVICE_ROLE_KEY`, and `ALEXANDRIA_ALLOWED_EMAIL_DOMAINS=usc.edu.ph`.

### Task 4: Define Review Flow

**Action**: Agree that schema, API contracts, and design decisions require review by Homer before downstream work depends on them.
**Files**: `phases/general/roadmap.md`
**Why**: Keeps the backend/project-management role as the integration point.
**Verification**: Every phase has explicit owner and reviewer fields.

## Exit Criteria

- [ ] Team task boards exist and are readable.
- [ ] API payload shapes are drafted or explicitly scheduled.
- [ ] Environment variable expectations are documented.
- [ ] Shane has a database starting point.
- [ ] Leira and Ethan have mockable frontend contracts.

## What You Will Learn

**Technical Skills**:

- Turning PRD decisions into API and database contracts.
- Planning frontend work against mock payloads.

**Conceptual Understanding**:

- Why backend contracts unblock parallel frontend and database work.
- How to keep product decisions traceable during implementation.

**Tools and Patterns**:

- Phase-based team handoffs.
- Documentation-first integration.

## Notes and Gotchas

**Common Issues**:

- Do not let frontend pages invent separate field names from the backend contract.
- Do not let schema changes bypass the PRD and decision log.

**Dependencies**:

- None beyond the existing repository docs.
