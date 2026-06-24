---
description: Standardized session log creation based on templates
---

# /session-log — Session persistence and tracking

---

## description: Standardized session log creation based on templates

> **Purpose**: Maintain consistency in session logs for coherence and tracing.
> **Integrates**: `.agent/templates/session_log_template.md`

**Project Workflows output convention**: Generated session logs belong under root `docs/`, not `.agent/` or `.codex/`.

## Workflow

### Step 1: Initialize Log

**Action**: Create a new session log file.

```bash
# Example for a session on 2026-03-08
cmd /c copy ".agent\templates\session_log_template.md" "docs\session-logs\2026-03-08-session-01.md" & REM \
```

### Step 2: Fill Metadata

- **Date**: Port from current local time.
- **Focus**: Define the main objective of this session (e.g., "Integrating template workflows").

### Step 3: Log Agenda & Minutes

- [ ] Define what we plan to do.
- [ ] Record key decisions as they happen.

### Step 4: Finalize Artifacts

- Update the "Artifacts & Outputs" section with links to all files created or modified.

---

## Related

- `/onboard` - Usually precedes the first session log.
- `/report-task` - Complements logs with task-specific reports.
- `/handoff` - Use for compact next-agent continuation context.
