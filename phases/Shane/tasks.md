# Shane Task Board

Role: Database Engineer

Primary responsibility: Supabase schema, migrations, RLS policies, storage bucket policies, indexes, seed data, and query support for backend/frontend integration.

## Phase 1: Project Contracts and Team Workflow

Status: Not Started

Tasks:

- Read `docs/database-engineer-reference.md`.
- Draft ERD from accepted MVP tables.
- Confirm table names and relationship assumptions with Homer before implementation.
- Identify any schema questions that would block RLS or query support.

Handoff:

- Give Homer an ERD/migration outline for review.

## Phase 2: Supabase Foundation

Status: Not Started

Tasks:

- Create core schema for departments, advisers, research areas, tags, theses, thesis authors, thesis tags, thesis files, thesis recommendations, thesis lessons, profiles, and optional audit logs.
- Add constraints for roles and thesis statuses.
- Configure private/authenticated `thesis-pdfs` storage bucket.
- Write RLS policies for public published metadata, protected draft/archived data, role-based writes, profiles, and storage access.
- Add indexes for browse, search, filters, authors, tags, primary file lookup, and admin status views.
- Seed DCISM data, advisers, research areas, tags, sample theses, and sample role profiles.

Handoff:

- Give Homer migration scripts, seed scripts, policy notes, and any query caveats.

## Phase 3: Auth and Role Enforcement

Status: Not Started

Tasks:

- Verify `profiles` links correctly to Supabase `auth.users`.
- Support profile creation/upsert strategy for Student visitor accounts.
- Confirm Student visitors cannot self-assign Admin or Contributor roles through database policies.
- Test role-based reads/writes with Homer.

Handoff:

- Give Homer confirmed RLS behavior for role checks.

## Phase 4: Public Repository Backend

Status: Not Started

Tasks:

- Support thesis list/search/filter/sort query tuning.
- Confirm related-thesis query from shared tags and research area is practical.
- Add or revise indexes if public queries are slow.
- Confirm public endpoints can retrieve required data without exposing drafts, archived records, or storage objects.

Handoff:

- Give Homer query improvements and any schema changes needed.

## Phase 5: Public Repository Frontend

Status: Not Started

Tasks:

- Support frontend testing with better seed data if Leira needs edge cases.
- Add seed examples with long titles, multiple authors, diverse tags, recommendations, and lessons.
- Confirm archive/draft records remain hidden from public queries.

Handoff:

- Give Leira/Homer seed-data fixes and query notes.

## Phase 6: Admin Backend Workflows

Status: Not Started

Tasks:

- Support nested create/update patterns for thesis metadata.
- Verify PDF replacement metadata model works.
- Confirm archive/unpublish and soft delete behavior with public query filters.
- Review publish validation assumptions against relational data.
- Add audit-friendly metadata if agreed with Homer.

Handoff:

- Give Homer DB-side constraints and policy notes for admin workflows.

## Phase 7: Admin Frontend Workflows

Status: Not Started

Tasks:

- Support dashboard query tuning for status filters and search.
- Provide seed records for admin editing and validation testing.
- Fix RLS or schema issues discovered during admin UI testing.

Handoff:

- Give Ethan/Homer DB fixes and testing notes.

## Phase 8: Integration QA and Demo Polish

Status: Not Started

Tasks:

- Verify RLS blocks anonymous draft/archived reads.
- Verify anonymous PDF access is blocked.
- Verify Student visitor PDF access works for published records.
- Verify Admin/Contributor write policies behave as expected.
- Finalize demo seed data.

Handoff:

- Give Homer final database/security validation notes.
