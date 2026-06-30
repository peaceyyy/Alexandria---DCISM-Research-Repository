# Login Screen Acceptance Specification

Status: implementation-ready  
Owner: Designer agent  
Route: `/login`  
Updated: 2026-06-30

## Acceptance Intent

The user-supplied Login and Sign-up composite is a directional reference, not
a pixel-for-pixel implementation contract. The frontend should preserve its
recognizable Alexandria character:

- dark charcoal canvas;
- compact Alexandria header and utility controls;
- blue brand wordmark and restrained supporting copy;
- Login/Sign-up segmented navigation;
- a narrow, left-aligned auth form;
- large blue orbit geometry clipped along the right edge.

Production accessibility, responsive behavior, and complete interaction states
take precedence over reproducing the reference's exact measurements or tiny
text.

The supplied reference is a `1271x449` composite preview. It must not be
upscaled and mislabeled as a pixel-accurate `1440x1024` baseline. The real
`/login` route will be captured at `1440x1024` after sub-phase
`07-frontend-login`; that capture becomes the review image for visual QA.

## Shared Shell Boundary

Use
`../02-design-visual-foundation/visual-foundation.md` without changing its
shared shell contract:

- default dark theme;
- Inter for functional UI and Khula for display branding/action text;
- local Alexandria mark;
- three decorative, non-interactive blue orbits;
- `420px` maximum form width;
- persistent labels and minimum `16px` input text;
- visible focus treatment;
- minimum `44x44` mobile targets.

Login-specific states may change copy, status messages, field semantics, and
control states. They must not introduce a form card, decorative glow, shadows,
or extra background artwork.

## Default Desktop State

At the reference desktop width:

- The Login tab is selected and exposes `aria-current="page"`.
- The Sign-up tab links to `/sign-up`.
- The form contains Student email, Password, Forgot Password?, and Login.
- Email uses `type="email"` and `autocomplete="email"`.
- Password uses `type="password"` and `autocomplete="current-password"`.
- The password visibility control sits inside the field shell without reducing
  the input's usable width.
- The Login action is visually primary and enabled.
- Theme and GitHub controls remain in the shared header.
- Form controls remain on the charcoal canvas; there is no enclosing card.
- The blue orbits stay behind the content and never overlap the form.

Suggested field placeholders:

- Email: `Enter your student email`
- Password: `Enter your password`

Placeholders supplement visible labels; they do not replace them.

## Layout and Message Rules

- Field shells are at least `60px` high on desktop and `44px` high everywhere.
- Keep `16px` between field groups.
- Put field errors directly below their field with `6px` top spacing.
- Error and status messages remain in document flow. Never position them
  absolutely.
- Reserve no fixed-height error overlay. Let the form grow and the page scroll
  when messages appear.
- Long messages wrap within the `420px` form width without clipping.
- Use at least `8px` between a field error and the next label/control.
- The Forgot Password? control has a minimum `44px` hit target even if its text
  remains visually compact.
- The Login button is at least `46px` high and may become full-width on narrow
  screens.

## State Acceptance Matrix

### 1. Default Dark Desktop

- Page background is `#14181C`.
- Primary text is white; muted supporting text uses the approved accessible
  gray token.
- Login tab and primary action use the approved blue action token.
- Fields show persistent blue borders and readable placeholder text.
- No validation, service-error, registration-success, or recovery message is
  visible.

### 2. Keyboard Focus

- Tab order follows header utilities, Login/Sign-up navigation, Email,
  Password, password visibility, Forgot Password?, then Login.
- Every focused control shows a `3px` focus ring with `3px` offset.
- Blue-bordered controls include a canvas-colored separation layer so the focus
  ring remains visible.
- Focus does not move or resize adjacent controls.
- Pressing Enter from either field submits the form.

### 3. Invalid Email

- Triggered when Email is empty, malformed, or outside `usc.edu.ph`.
- Exact copy: `Use your @usc.edu.ph email address.`
- Message is associated with Email through `aria-describedby`.
- Email sets `aria-invalid="true"`.
- Error text uses an accessible danger color and appears below the Email field.
- The Password field moves down naturally; the error never overlaps it.
- The auth gateway is not called.

### 4. Missing Password

- Triggered when Password is empty at submission.
- Exact copy: `Enter your password.`
- Message is associated with Password through `aria-describedby`.
- Password sets `aria-invalid="true"`.
- The message appears below the field and above Forgot Password?.
- If Email is also invalid, both field errors appear simultaneously.
- The auth gateway is not called.

### 5. Password Visible

- Activating the visibility control switches the field to readable text without
  changing field width or height.
- The control's accessible name changes from `Show password` to
  `Hide password`.
- Use one consistent eye/eye-off icon family.
- The caret position and field focus are preserved.
- Activating the control never submits the form.

### 6. Submitting

- The Login button label changes to `Logging in...`.
- The button is disabled and the form exposes a pending state with
  `aria-busy="true"`.
- Prevent duplicate submissions.
- Keep entered values visible.
- Do not show a spinner unless it can be added without changing the button's
  dimensions.
- Existing validation errors are cleared only after local validation passes.

### 7. Incorrect Credentials

- Exact service-error copy:
  `The email or password is incorrect.`
- Render one form-level message with `role="alert"`.
- Keep the submitted email so the user can correct only what is necessary.
- Restore the Login button to its enabled `Login` state.
- Focus the alert or ensure it is announced without forcing a disruptive scroll.
- Do not render raw Supabase error objects, codes, or stack traces.

### 8. Registration-Success Notice

- Triggered by `/login?registered=1`.
- Exact copy: `Account created. Log in with your USC email.`
- Render with `role="status"` above the Email field.
- Use the success token; do not use the danger or warning treatment.
- The notice does not prefill credentials.
- It remains readable if validation messages appear later.

### 9. Password-Recovery Deferred Notice

- Forgot Password? remains a button, not a dead link.
- Exact copy:
  `Password recovery is not available in this frontend phase.`
- Render with `role="status"` beneath the recovery control.
- No navigation, Supabase call, or invented backend endpoint occurs.
- Repeated activation does not duplicate the notice.

### 10. Light Theme

- Light mode uses the approved theme adaptation from the visual foundation.
- Background, text, border, focus, and control tokens retain WCAG AA contrast.
- Orbit colors remain blue at reduced opacity.
- The Alexandria mark retains its dark backing shape.
- Theme switching does not reset form values, validation, or status messages.
- The default first render remains dark unless a saved user preference exists.

### 11. Mobile Default

At `390x844` and down to `320px`:

- The page has no horizontal scrolling.
- Header controls remain operable and do not overlap.
- Hero copy wraps or scales without clipping.
- The form uses the available width.
- Orbits remain a subtle background hint and never sit behind controls.
- All interactive targets are at least `44x44`.
- The Login button may span the form width.
- The page scrolls vertically when required.

### 12. Mobile Error

- Email and Password errors stack below their respective fields.
- A form-level alert stacks above the Login action or in the documented
  form-message slot.
- No message overlaps a field, recovery control, button, or orbit.
- At 200% browser zoom, every message remains readable and reachable.
- Focusing the first invalid field does not create horizontal scroll.

## Interaction Copy

| Element | Copy |
| --- | --- |
| Selected tab | `Login` |
| Alternate tab | `Sign Up` |
| Email label | `Student email` |
| Password label | `Password` |
| Recovery control | `Forgot Password?` |
| Primary action | `Login` |
| Pending action | `Logging in...` |
| Invalid email | `Use your @usc.edu.ph email address.` |
| Missing password | `Enter your password.` |
| Incorrect credentials | `The email or password is incorrect.` |
| Registration success | `Account created. Log in with your USC email.` |
| Recovery deferred | `Password recovery is not available in this frontend phase.` |

## Implementation Handoff

Sub-phase `07-frontend-login` may implement this state set when its other
dependencies are complete. Its visual review must capture:

- dark desktop at `1440x1024`;
- dark mobile at `390x844`;
- at least one validation state;
- registration-success and recovery-deferred notices;
- light theme;
- keyboard focus.

The implementation is accepted when the state behavior, accessibility, and
Alexandria visual identity above are present. Exact pixel matching to the
directional composite is not required.
