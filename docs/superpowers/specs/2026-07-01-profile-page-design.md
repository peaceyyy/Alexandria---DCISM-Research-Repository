# Alexandria Profile Page Design

Date: 2026-07-01

## Goal

Restore a professional profile page based on the supplied screenshot while keeping the existing header role indicator as the entry point.

## Approved Interaction

- Guest indicator links to `/login`.
- Member, moderator, and admin indicators link to `/profile`.
- `/profile` is protected. A request without an authenticated user redirects to `/login`.
- Successful login and registration continue to redirect to Home (`/`).

## Visual Direction

Use a refined archive-card treatment that stays close to the screenshot and Alexandria's existing design system:

- charcoal `#14181C` page background;
- flat surfaces with thin, precise borders;
- restrained blue and cyan accents;
- Inter for functional UI;
- minimal shadow and no decorative glow;
- one centered profile card with a maximum readable width;
- responsive stacking on narrow screens.

The profile should feel like part of a serious academic repository rather than a generic settings dashboard.

## Page Structure

### Header

Use a compact, GitHub-inspired utility header while preserving Alexandria's visual language:

- Alexandria mark and wordmark on the left;
- compact repository search near the right-side utilities;
- search width around `280px` to `320px` on desktop rather than spanning the header;
- search may contract to an icon or move below the primary row on narrow screens;
- role indicator on the right as the only account utility.

The header should feel dense and deliberate: identity on the left, navigation space in the middle, then search and the account indicator grouped on the right. Theme controls, GitHub links, and inactive utility icons are excluded until they have product-backed behavior.

### Profile Card

The card contains:

1. A large fallback avatar.
2. User name and role badge.
3. Email address.
4. Affiliation.
5. Member-since date.
6. Access-level badges.
7. Change Password and Log Out actions.

### Role Presentation

- Member: member access only.
- Moderator: member and moderator access.
- Admin: member, moderator, and admin access.

The page communicates inherited access without presenting permission-management controls.

## Data Flow

1. The server page calls `getCurrentUser()`.
2. A missing user redirects to `/login`.
3. The authenticated profile is shaped into display data.
4. The server renders the profile page without mock role query parameters.

`CurrentUser` should expose the profile creation timestamp needed for the member-since field. The timestamp comes from `public.users.created_at`.

## Actions

### Log Out

Log Out uses the existing Supabase server-side logout service through an auth action, then redirects to Home.

### Change Password

Change Password remains visibly disabled and labeled as unavailable until a password-update or recovery contract is implemented.

## Components

- `app/profile/page.tsx`: protected server route and profile data loading.
- `components/profile/profile-page.tsx`: profile presentation.
- `components/auth/role-indicator.tsx`: role-aware link behavior.
- `lib/auth/profile-display.ts`: pure role/access and date-formatting helpers.
- `lib/auth/actions.ts`: logout action if not already exposed.

## Responsive Behavior

- Desktop: avatar and identity details appear in two columns.
- Tablet: card width contracts while preserving the two-column hierarchy.
- Mobile: avatar, details, badges, and actions stack vertically.
- Interactive targets remain at least 44 pixels high.
- Role, focus, and action meaning never rely on color alone.

## Error Handling

- Missing session: redirect to `/login`.
- Missing profile row: show the existing safe authentication error path rather than fabricated profile data.
- Logout failure: return a user-readable error state without exposing internal details.

## Manual Test Cases

- [ ] Click the Guest indicator and confirm it opens `/login`.
- [ ] Click a Member, Moderator, or Admin indicator and confirm it opens `/profile`.
- [ ] Open `/profile` without a session and confirm it redirects to `/login`.
- [ ] Confirm the profile shows the signed-in user's name, email, affiliation, role, and member-since date.
- [ ] Confirm Member shows only Member access.
- [ ] Confirm Moderator shows Member and Moderator access.
- [ ] Confirm Admin shows Member, Moderator, and Admin access.
- [ ] Confirm Change Password is visibly disabled and explains that it is unavailable.
- [ ] Confirm Log Out ends the session and returns to Home.
- [ ] Confirm the compact search stays near GitHub-like desktop proportions and does not dominate the header.
- [ ] Confirm the header remains usable without horizontal overflow on tablet and mobile.
- [ ] Confirm keyboard focus is visible on the role indicator, search, and profile actions.

## Out of Scope

- Avatar upload.
- Editing profile fields.
- Password recovery or password update implementation.
- Role assignment controls.
- Mock role switching through query parameters.

## Acceptance Criteria

- `/profile` renders the authenticated user's real profile data.
- Guests cannot view `/profile`.
- The header indicator is the route entry point.
- Member, moderator, and admin roles are visually distinct.
- Admin and moderator inherited access is clearly represented.
- The page follows the screenshot's composition and Alexandria's design tokens.
- The profile header contains no inactive utility controls or unsupported Lucide imports.
- No existing unrelated migration work is overwritten.
