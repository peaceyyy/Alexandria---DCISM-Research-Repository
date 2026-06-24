# Antigravity Adapter

Status: native BALAI OS adapter.

BALAI OS was originally designed around Antigravity. The repo-level
`.agent/global_instructions.md` should be treated as the native Antigravity
global instruction source unless a later adapter-specific source supersedes it.

## Global Rules Target

The current sync script writes:

- Source: `.agent/global_instructions.md`
- Target: `%USERPROFILE%\.gemini\GEMINI.md`

## Workflow Target

The current sync script writes:

- Source: `.agent/workflows/*.md`
- Target: `%USERPROFILE%\.gemini\antigravity\global_workflows/*.md`

## Terminal Policy

Antigravity currently carries the terminal blindness and phantom quote
workaround documented in `misc/terminal-blindness-solution.md`.

Adapter rule:

```text
Use `cmd /c [command] & REM \` for terminal commands when running through
Antigravity.
```

This rule is adapter-specific. Portable workflows should not hardcode it unless
the workflow is explicitly Antigravity-only.

## Native Strengths

- BALAI slash workflows are already shaped around Antigravity global workflows.
- Existing personas, skills, and protocols use Antigravity terminology.
- Multi-agent orchestration references Antigravity-style agent routing.

## Known Friction

- Terminal command policy is runtime-specific and should not leak into generic
  workflows.
- Some workflows refer to old or optional tools such as Context7, GitHub MCP, or
  `read_url_content`; those should be mapped per adapter before use.
- Adapter-specific annotations should remain here rather than in core BALAI
  philosophy files.
