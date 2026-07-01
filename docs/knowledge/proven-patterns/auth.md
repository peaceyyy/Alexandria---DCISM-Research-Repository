# Auth Proven Patterns

## Proven Pattern: 2026-07-01
**Context**: Login and Sign-Up Frontend Implementation Phase
**Approach**: Service-layer separation (Dependency Injection of `AuthGateway`) combined with separation of pure validation logic (`auth-validation.ts`) and presentation.
**Why it passed**: 
- **SOLID**: The UI components take the `AuthGateway` as a prop (defaulting to the concrete implementation), making the UI agnostic to the backend (mock vs actual Supabase service). This satisfies the Dependency Inversion Principle.
- **KISS/Test-First**: Validation rules were extracted to pure functions allowing Vitest to rapidly test edge cases without mounting React components.
- **Spec-Compliant**: The forms correctly map to the Figma visual design while remaining decoupled from the actual Supabase client, meeting the constraint that the frontend never imports Supabase directly.

## Contract Ownership

- `Alexandria/lib/services/types.ts` is canonical for shared auth and service
  contracts.
- `Alexandria/lib/auth/auth-contract.ts` re-exports those contracts for auth UI
  consumers and owns only form-specific types.
- `registerMember()` creates the Supabase Auth identity and supplies profile
  metadata. The `on_auth_user_created` trigger alone inserts `public.users`.
- `usc_id` is required by the current form only for students. The shared user
  DTO stores it as `number | null`.
- `ThesisAuthorInput` is derived from `ThesisAuthor` so write payloads cannot
  require or override the database-generated author `id`.

See [API Contracts](../../api-contracts.md#canonical-type-ownership) and
[Backend Function Headers](../../backend_functions.md#1-typests--shared-types--dtos).
