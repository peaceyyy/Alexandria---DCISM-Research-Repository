---
description: Diagnose deployment environment configuration issues by adding a frontend widget
---

# /inject-debugger — Debug deployment environment issues

---

## description: Diagnose deployment environment configuration issues

> **Purpose**: Diagnose why frontend fails to connect to backend after deployment.
> **Scope**: Runtime detection, CORS, Environment Variables, API URL mismatches.

## When to Use

- "My deployed app can't connect to the backend"
- "API calls are failing in production but working locally"
- "Debug environment variables in the browser"

## Workflow

### Step 1: Runtime Environment Detection

**Create** `runtime-env.ts`:

- Detect if running on `localhost` vs production domain.
- Determine correct API URL based on `window.location.hostname`.
- Log detection results to console.

### Step 2: Visual Debug Widget

**Create** a temporary Debug Component:

- Overlay on the app (bottom right, high z-index).
- **Show**:
  - Build-time env (`process.env.NODE_ENV`)
  - Runtime-detected API URL
  - Current Hostname
  - Status of API connection (Test Ping)

### Step 3: Service Enhancement

**Modify** API Client:

- Log API Base URL on initialization.
- Log network errors with full details (Status, URL, CORS).
- Compare build-time URL vs runtime URL → Warn if mismatched.

### Step 4: Verification

- Deploy the debug branch.
- Open the app → Check the Debug Widget.
- **If Mismatch**:
  - Fix build pipeline env vars (Vercel/Netlify settings).
  - Update `runtime-env.ts` logic.

---

## Output

- `runtime-env.ts` utility
- Temporary Debug Widget
- Enhanced logging in API service
