# BALAI OS Adapter Layer

The adapter layer separates BALAI OS intent from platform-specific execution.

Core BALAI files define what an agent should do: personas, workflows, skills,
protocols, approval gates, and verification expectations. Adapter files define
how those same expectations should be carried out in a specific agent runtime.

Use this folder when a rule depends on the host tool rather than BALAI itself.

## Current Adapters

| Adapter | Status | Purpose |
| --- | --- | --- |
| `antigravity.md` | Native | Documents the original BALAI OS runtime assumptions. |
| `codex.md` | Draft | Maps BALAI OS behavior onto Codex Desktop constraints. |
| `claude-code.md` | Placeholder | Reserved for a future Claude Code mapping. |

## What Belongs Here

- Terminal execution policy.
- File editing policy.
- Web, browser, GitHub, YouTube, and MCP capability mapping.
- Slash-command, prompt, skill, hook, or workflow format differences.
- Sandbox, approval, and credential handling rules.
- Known stale assumptions or unsupported behavior for the platform.

## What Does Not Belong Here

- Persona philosophy.
- Domain-specific coding guidance.
- Project architecture rules.
- Workflow intent or success criteria that should be portable.

## Portability Rule

Workflows should describe intent in portable terms, then defer platform mechanics
to the active adapter.

Example:

```text
Run the validation metric using the active adapter's terminal policy.
```

instead of:

```text
Run `cmd /c npm test & REM \`.
```

Antigravity can still implement that validation with its terminal workaround,
while Codex can use its normal shell tool and sandbox approval model.

## Canonical BALAI Folder

BALAI OS uses `.agent/` as its canonical project-local folder.

If a platform expects a different folder name or export shape, handle that in
the relevant adapter or sync script rather than changing workflow artifact paths.
