# Codex Adapter

Status: draft adapter for Codex Desktop.

This adapter maps BALAI OS onto Codex's current execution model. It should be
used as a compatibility guide, not as a replacement for Codex's active system
instructions.

## Operating Model

- Shared BALAI instructions live in this repo under `.agent/`.
- Project-specific artifacts should be written to the target project's local
  `.agent/` tree when the user asks for project-local BALAI output.
- Do not assume Antigravity terminal behavior in Codex.
- Preserve user changes in dirty worktrees; never revert unrelated work.

## Terminal Policy

Codex can run PowerShell directly in the configured workspace.

Adapter rules:

- Prefer `rg` or `rg --files` for search.
- Use PowerShell-native commands on Windows.
- Request escalation when sandbox, network, credential, GUI, or destructive
  boundaries require it.
- Do not use the Antigravity `cmd /c ... & REM \` workaround unless the user is
  explicitly asking for Antigravity command text.

## File Editing Policy

Adapter rules:

- Use `apply_patch` for manual file edits.
- Keep edits scoped to the requested artifact.
- Read existing files before changing them.
- Do not edit project-local `.agent` or unrelated agent folders unless the
  user explicitly asks.

## Web And External Source Policy

Codex can research public web pages and can inspect local or public GitHub
content when accessible.

Adapter rules:

- Use current web research for fast-moving facts, docs, pricing, product
  capabilities, and tool comparisons.
- Prefer official docs for technical platform behavior.
- YouTube links can be analyzed when transcript or page content is accessible;
  otherwise ask for or accept a pasted transcript.
- GitHub repositories can be inspected through web access or by reading a local
  checkout.

## MCP And Backend Policy

Codex can use only the connectors and MCP tools exposed in the active session.

Adapter rules:

- Do not assume Context7, GitHub MCP, Supabase MCP, or database tools are
  available unless they appear in the active tool list.
- Supabase backends require explicit credentials or an installed connector/CLI
  plus user approval before live access.
- Treat production data and credentials as high-permission operations.

## Workflow Mapping

Existing BALAI workflows can be mirrored into Codex skills or prompts, but the
mirror is structural compatibility only.

Adapter rules:

- Keep the original workflow intent intact.
- Replace unavailable tool names with Codex-native capabilities at runtime.
- Surface stale assumptions instead of silently pretending a workflow is fully
  portable.
- For verification loops, run commands using Codex sandbox rules and report
  exact failures.

## Known Friction

- Some migrated workflows still mention Antigravity terminal workarounds.
- Some workflow bodies assume tools such as `read_url_content`,
  `github_search_code`, Context7, or GitHub MCP.
- Multi-agent orchestration may need Codex sub-agent/tool availability before it
  can behave like the Antigravity-native version.
