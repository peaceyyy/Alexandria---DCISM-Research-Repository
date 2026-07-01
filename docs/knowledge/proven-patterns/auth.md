# Auth Proven Patterns

## Proven Pattern: 2026-07-01
**Context**: Login and Sign-Up Frontend Implementation Phase
**Approach**: Service-layer separation (Dependency Injection of `AuthGateway`) combined with separation of pure validation logic (`auth-validation.ts`) and presentation.
**Why it passed**: 
- **SOLID**: The UI components take the `AuthGateway` as a prop (defaulting to the concrete implementation), making the UI agnostic to the backend (mock vs actual Supabase service). This satisfies the Dependency Inversion Principle.
- **KISS/Test-First**: Validation rules were extracted to pure functions allowing Vitest to rapidly test edge cases without mounting React components.
- **Spec-Compliant**: The forms correctly map to the Figma visual design while remaining decoupled from the actual Supabase client, meeting the constraint that the frontend never imports Supabase directly.
