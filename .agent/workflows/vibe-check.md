---
description: Perform a comprehensive Vibe Check on the project using the vibe-check skill.
---

# /vibe-check

Perform a comprehensive "Vibe Check" on the project to ensure it meets modern aesthetic and UX standards.

## Usage

Run this workflow when you want to audit the current UI state, validate a new feature's design, or simply "check the vibe".

## Steps

1.  **Context Assembly**
    - Identify the active UI components or pages.
    - If specific files were mentioned in the prompt, use those.
    - If not, ask the user to specify the scope (e.g., "Entire App", "Landing Page", "User Dashboard").

2.  **Run Vibe Check**
    - Use the `vibe-check` skill.
    - **Critical**: You MUST read `SKILL.md` and `anti-vibe-coding-checklist.md` in `.agent/skills/ui-ux-design/vibe-check/` to understand the criteria.
    - Apply the audit against the selected files.

3.  **Generate Report**
    - Output the **Vibe Report** exactly as defined in the `SKILL.md`.
    - Be ruthless but constructive. High standards = better product.

4.  **Action Plan**
    - Ask the user if they want to apply the "Quick Wins" immediately.
    - If yes, proceed to apply fixes (using `designing-ui` skill for implementation).
