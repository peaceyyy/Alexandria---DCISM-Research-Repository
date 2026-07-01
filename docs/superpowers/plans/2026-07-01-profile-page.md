# Alexandria Profile Page Implementation Plan

> **For agentic workers:** Implement this plan inline in the current session. Do not dispatch subagents. The repository's human review gate prohibits automated verification until the user explicitly approves it.

**Goal:** Restore a protected, professional profile page based on the supplied screenshot and connect it to the existing header role indicator.

**Architecture:** The profile remains server-rendered. `getCurrentUser()` supplies the authenticated profile, `/profile` redirects guests to `/login`, and a server action performs logout. Presentation stays isolated in a profile component while pure display formatting remains in `lib/auth`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Supabase Auth.

---

### Task 1: Complete the authenticated profile contract

**Files:**

- Modify: `Alexandria/lib/auth/auth-contract.ts`
- Modify: `Alexandria/lib/services/types.ts`
- Modify: `Alexandria/lib/services/auth-service.ts`
- Modify: `Alexandria/lib/auth/mock-auth-gateway.ts`
- Modify: `Alexandria/lib/auth/actions.ts`
- Create: `Alexandria/lib/auth/profile-display.ts`

- [ ] Add `created_at: string` to both `CurrentUser` definitions.
- [ ] Map `public.users.created_at` in `getCurrentUser()`.
- [ ] Supply `created_at` in the mock gateway so its contract remains structurally valid.
- [ ] Add `logoutAction()` that calls the existing logout service, redirects failures back to `/profile?error=logout`, and redirects success to `/`.
- [ ] Add focused helpers for member-since formatting and inherited access labels.

### Task 2: Make the role indicator the account entry point

**Files:**

- Modify: `Alexandria/components/auth/role-indicator.tsx`

- [ ] Render the indicator as a Next.js link.
- [ ] Route guests to `/login`.
- [ ] Route member, moderator, and admin sessions to `/profile`.
- [ ] Preserve the existing visible role label, keyboard focus, and role-specific styling.

### Task 3: Restore the protected profile page

**Files:**

- Create: `Alexandria/app/profile/page.tsx`
- Create: `Alexandria/components/profile/profile-page.tsx`

- [ ] Load the current user on the server.
- [ ] Redirect missing sessions to `/login`.
- [ ] Pass real name, email, affiliation, role, creation date, and logout error state into the profile component.
- [ ] Build the compact header with Alexandria branding, a `280px` to `320px` search field, and the functional role indicator only.
- [ ] Build the centered archive-style profile card with a large fallback initial, role badge, account metadata, inherited access badges, disabled Change Password action, and functional Log Out form.
- [ ] Stack the card and actions on mobile while keeping all controls at least 44 pixels high.

### Task 4: Human review handoff

**Files:**

- Reference: `docs/superpowers/specs/2026-07-01-profile-page-design.md`

- [ ] Stop after code changes.
- [ ] Present every changed file for human review.
- [ ] Provide the manual test cases from the design specification.
- [ ] Do not run tests, lint, type-checking, builds, development servers, or browser automation.
