---
name: securing-code
description: Audits code for security vulnerabilities, secret leaks, and sandbox violations. Use when "Mission Control" or "Ruthless Reviewer" is needed.
---

# Security & Ecology (The Guard)

## When to use this skill

- User asks "Is this safe?"
- User mentions "API keys", "secrets", or "credentials".
- Before running unknown scripts (Pre-Flight Check).
- Triggered by `/ruthless-reviewer` or `/audit`.

## Core Protocols

- [Token Hygiene](../../../../../protocols/guidelines/01-token-hygiene.md) (Secret Management)
- [Container Sandboxing](../../../../../protocols/guidelines/15-container-sandboxing.md) (Isolation)
- [Hybrid Token Conservation](../../../../../protocols/guidelines/02-hybrid-token-conservation.md) (Efficiency)

## Vibe Code Protocols (AI-Assisted)

- **[16-Point Security Checklist](vibe-security-checklist.md)**: Essential pre-flight check for AI-generated apps. Covers HTTPS, Auth, Injection, and more.

## Modes

### 🛡️ Default Mode (Audit)

- **Trigger**: "Is this safe?", "Check for security issues"
- **Action**: Light scan for obvious vulnerabilities (secrets, injection)

### 😈 Ruthless Reviewer Mode

- **Trigger**: `/ruthless-reviewer` command, or "Audit this code ruthlessly"
- **Action**: Deep security audit before deployment
- **Steps**:
  1. **Load Knowledge**:
     - `01-token-hygiene.md`
     - `15-container-sandboxing.md`
     - `vibe-security-checklist.md`
     - **`vulnerability-scanner/SKILL.md`** (Advanced Audit)
     - **`red-team-tactics/SKILL.md`** (Attack Simulation)
  2. **Audit**: Analyze code for specific flaws:
     - XSS / Injection attacks
     - Hardcoded secrets (API keys, tokens)
     - Insecure dependencies
     - Missing authentication/authorization
     - **Red Team Check**: Simulate attack paths defined in `red-team-tactics`
  3. **Block**: STOP commits if hardcoded secrets are found
  4. **Sanitize**: Refactor sensitive data to use environment variables

## Workflow

1.  **Scan**: Check files for hardcoded secrets, IP addresses, or dangerous patterns.
2.  **Isolate**: Ensure new dependencies or scripts are run in a safe context.
3.  **Report**: Flag specific lines that violate Token Hygiene.
