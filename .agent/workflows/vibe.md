---
description: Vibe engineering - build fast, iterate, ship
---

# /vibe — Quick aesthetic check and design iteration

---

## description: Vibe engineering - build fast, iterate, ship

> **Purpose**: Rapid prototyping and visual iteration.
> **Skill**: [designing-ui](../skills/ui-ux-design/designing-ui/SKILL.md) (Standard Design Mode)

## When to Use

- "Check the vibe of this page"
- "Iterate on this color scheme"
- "Make it pop"

## Workflow

### Step 1: Vibe Check

- **Observe**: Screenshot or inspect current UI.
- **Compare**: Does it match `design.md` intent?
- **Critique**: Spacing, Typography, Contrast.

### Step 2: Iterate (Vibe Engineering)

**Loop**:

1.  **Code**: Apply quick CSS change.
2.  **Verify**: Check visually.
3.  **Refine**: Adjust hex value / margin.

### Step 3: Verify Against Standards

- **Load**: `anti-vibe-coding-checklist.md`.
- **Check**: No generic blue, inconsistent fonts, or bad contrast.

### Step 4: Ship (Deploy to Cloud Run)

> **Pro-Tip**: Use your "Build with AI" gcloud credits!

- **Execute**: Deploy the project to Google Cloud Run directly from source.
- **Command**:
  ```bash
  cmd /c gcloud run deploy <service-name> --source . --region us-central1 --allow-unauthenticated & REM \
  ```
- **Validate**: Open the deployed URL provided by Cloud Run to verify the live vibes.

---

## Related

- `/design` - For creating new components.
- `/ui-audit` - For strict verification.
