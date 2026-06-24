# Phase 3: Auth and Role Enforcement

**Phase Goal**: Connect Supabase Auth to the Next.js app and enforce Alexandria's three app roles.

## Phase Metadata

**Phase Type**: Feature
**Estimated Complexity**: High
**Estimated Time**: 4-6 hours
**Prerequisites**: Phase 2
**Primary Systems Affected**: Frontend, Backend integration, Auth, Database policies
**Dependencies**: `@supabase/supabase-js`, `@supabase/ssr`, Supabase Auth, profiles table

## Feature Description

This phase makes identity real. Homer owns server-side Supabase helpers, `/api/me`, role checks, and protected route behavior. Ethan supports auth screens and admin shell integration. Shane verifies profile policies. Leira ensures public pages gracefully handle anonymous and authenticated states.

## User Impact

**User Story**:
As a student, I want to sign in with my school email, so that I can access protected thesis PDFs.

**Value Delivered**:

- Student visitors can self-register with `usc.edu.ph`.
- Admin and Contributor roles are recognized by the app.
- Anonymous users can browse metadata but not access protected actions.

## Context References

| Document | Sections | Why Read |
| --- | --- | --- |
| `.agent/project_specification.md` | Access Control, Auth/Profile Contracts, Environment Configuration | Auth requirements |
| `docs/Alexandria PRD.md` | Authentication and Authorization, PDF Access | Product behavior |
| `frontend/AGENTS.md` | All | Next.js 16 warning before implementation |

## Implementation Tasks

### Task 1: Install Supabase Client Libraries

**Action**: Add Supabase packages and verify compatibility with the current Next.js app.
**Files**: `frontend/package.json`, `frontend/package-lock.json`
**Why**: Required for browser and server auth/session work.
**Verification**: `npm.cmd install` succeeds and lint still passes.

### Task 2: Add Supabase Client Helpers

**Action**: Create browser and server Supabase client helpers, including per-request server clients.
**Files**: Recommended: `frontend/app/lib/supabase/*`
**Why**: Keeps auth/session code consistent.
**Verification**: Helpers can read the current session without exposing service-role credentials.

### Task 3: Add Middleware Session Handling

**Action**: Add middleware for Supabase SSR session refresh/persistence.
**Files**: `frontend/middleware.ts` and Supabase helper files.
**Why**: Server-rendered routes need correct session cookies.
**Verification**: Login state persists across refreshes.

### Task 4: Build Auth Routes and Screens

**Action**: Implement login, signup, callback, error, and logout flows.
**Files**: Auth pages/routes under `frontend/app`.
**Why**: Student visitors need PDF access and admins need protected workflows.
**Verification**: Signup/login/logout work with test accounts.

### Task 5: Enforce School Email Signup

**Action**: Restrict student self-registration to `usc.edu.ph`.
**Files**: Auth route/action, validation helper, environment example.
**Why**: Accepted decision limits student visitor accounts to the school domain.
**Verification**: `@usc.edu.ph` signup succeeds; non-matching email signup fails.

### Task 6: Add Role Helpers and `/api/me`

**Action**: Implement profile lookup, role helpers, and current-user response contract.
**Files**: Recommended: `frontend/app/api/me/route.ts`, `frontend/app/lib/auth/*`
**Why**: UI and server routes need one source for role checks.
**Verification**: Anonymous, student, contributor, and admin states return correct results.

## Exit Criteria

- [ ] Supabase Auth works in the Next.js app.
- [ ] Student signup is limited to `usc.edu.ph`.
- [ ] `/api/me` returns profile and role data.
- [ ] Admin/Contributor route protection exists.
- [ ] Anonymous users cannot access protected PDF/admin actions.

## What You Will Learn

**Technical Skills**:

- Supabase SSR auth in Next.js.
- Role-based route protection.

**Conceptual Understanding**:

- Authentication vs authorization.
- Why service-role keys must stay server-only.

**Tools and Patterns**:

- Per-request Supabase server clients.
- Centralized role checks.

## Notes and Gotchas

**Common Issues**:

- Read `frontend/AGENTS.md` and current Next.js docs before writing code.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Student visitors must not self-assign Contributor or Admin.

**Dependencies**:

- Supabase URL and anon key.
- Seeded profiles or a reliable profile creation trigger/flow.
