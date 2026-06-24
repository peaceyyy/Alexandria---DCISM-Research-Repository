---
description: Unified analysis tool (Inspector + Investigator + Ruthless Reviewer)
---

# /analyze-system — Architecture tracing and deep debugging

---

## description: Unified analysis tool (Inspector + Investigator + Ruthless Reviewer)

> **Purpose**: Read-only deep dive into codebase to understand structure, flow, or bugs.
> **Skill**: [code-analysis](../skills/core-engineering/code-analysis/SKILL.md)
> **Output**: `docs/ARCHITECTURE.md` updates or reports under `docs/reports/`.

**Project Workflows output convention**: Generated architecture maps, incident reports, and security audit reports belong under root `docs/`, not `.agent/` or `.codex/`.

## Modes

### 🏗️ Architect Mode (Structure & Flow)

- **Goal**: Document how services/functions work together.
- **Output**: Mermaid diagrams, Flow charts.
- **Trigger**: "Trace this flow", "Map dependencies", "How does X work?"

### 🕵️ Investigator Mode (Debugging)

- **Goal**: Find root causes of complex bugs (Race conditions, Logic errors).
- **Output**: Incident Report with evidence under `docs/reports/incidents/`.
- **Trigger**: "Debug this error", "Why is it crashing?"

### 😈 Ruthless Mode (Security)

- **Goal**: Security audit (Secrets, Vulnerabilities).
- **Output**: Security Audit Report under `docs/reports/security-audits/`.
- **Trigger**: "Is this safe?", "Check for secrets"

---

## Workflow

### Step 1: Detect Intent

- **Understanding/Mapping** → Architect Mode
- **Debugging/Fixing** → Investigator Mode
- **Security Check** → Ruthless Mode

### Step 2: Execute Strategy

**Architect Mode**:

1.  **Trace Code Flow**: Follow imports, function calls, async chains.
2.  **Map Dependencies**: Identify service/module relationships.
3.  **Document**: Create grep-friendly descriptions for `docs/ARCHITECTURE.md`.

**Investigator Mode**:

1.  **Define Symptom**: What is broken?
2.  **Trace Execution**: Grep for calls, check logs, find branches.
3.  **Inspect State**: Permissions, file usage, data shapes.
4.  **Verdict**: Identify root cause.

**Ruthless Mode**:

1.  **Load Knowledge**: `securing-code` skill.
2.  **Audit**: Check for secrets, injection, insecure dependencies.
3.  **Sanitize**: Flag sensitive data issues.

---

## Output Formats

### Architect Output

```markdown
## [Service/Module Name]

**Flow**: Input → [Step 1] → [Step 2] → Output
**Dependencies**: [Service A], [Library B]
```

### Investigator Output

```markdown
## 🔍 Incident Report

**Symptom**: [Error/Crash]
**Root Cause**: [Why it happened]
**Verdict**: [Code Fix Recommendation]
```
