# Root Landing and Auth Link Integration

Date: 2026-06-30

## Goal

Make the existing Alexandria landing page the working root route that greets
every visitor and provides valid navigation to login and sign-up.

## Current State

- `Alexandria/app/page.tsx` already implements the landing page at `/`.
- The login button already points to `/login`.
- The sign-up button points to the non-canonical `/signup` route.
- The canonical auth routes defined by the active auth implementation plan are
  `/login` and `/sign-up`.
- The old `frontend/` directory contains placeholder auth pages, but the user
  will handle deleting that directory.

## Design

1. Keep `Alexandria/app/page.tsx` as the root landing route.
2. Change the landing sign-up link from `/signup` to `/sign-up`.
3. Add minimal placeholder pages at:
   - `Alexandria/app/login/page.tsx`
   - `Alexandria/app/sign-up/page.tsx`
4. Keep the placeholders intentionally small so the active auth implementation
   can replace them at the same route paths without another navigation change.
5. Do not copy the unfinished home, selected-page, or shared-header work.
6. Do not modify or delete anything under the legacy `frontend/` directory.

## Documentation

Update the Alexandria README and page-to-backend mapping to state:

- `Alexandria/` is the canonical Next.js application directory.
- `/` is the public landing page.
- `/login` and `/sign-up` are the canonical auth entry routes.
- The auth pages are placeholders pending the active auth implementation.

## Verification

Use a test-first route assertion:

1. Confirm it fails while `/sign-up` is missing or the landing page still links
   to `/signup`.
2. Add the two route pages and correct the landing link.
3. Confirm the route assertion passes.
4. Run `npm.cmd run lint` from `Alexandria/`.
5. Run `npm.cmd run build` from `Alexandria/` and confirm Next.js emits `/`,
   `/login`, and `/sign-up`.

## Out of Scope

- Deleting the legacy `frontend/` directory
- Implementing authentication forms or Supabase calls
- Migrating the unfinished catalog or selected-thesis pages
- Changing backend service contracts
