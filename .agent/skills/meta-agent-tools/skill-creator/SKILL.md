---
name: skill-creator
description: Creates new skills for the Antigravity agent environment. Use when the user asks to build a new skill, add automation capabilities, or extend agent functionality with specialized tasks.
---

# Skill Creator

## When to use this skill

- User says "create a skill for..."
- User wants to automate a repetitive task
- User needs specialized agent behavior for domain-specific work (e.g., testing, deployment)
- User asks "can you make the agent better at X?"

## Core Structural Requirements

Every skill must follow this folder hierarchy:

- `<skill-name>/`
  - `SKILL.md` (Required: Main logic and instructions)
  - `scripts/` (Optional: Helper scripts)
  - `examples/` (Optional: Reference implementations)
  - `resources/` (Optional: Templates or assets)

## YAML Frontmatter Standards

The `SKILL.md` must start with YAML frontmatter:

- **name**: Gerund form (e.g., `testing-code`, `managing-databases`). Max 64 chars. Lowercase, numbers, and hyphens only. No "claude" or "anthropic" in the name.
- **description**: Written in **third person**. Must include specific triggers/keywords. Max 1024 chars. (e.g., "Extracts text from PDFs. Use when the user mentions document processing or PDF files.")

## Writing Principles

When writing the body of `SKILL.md`:

- **Conciseness**: Assume the agent is smart. Focus only on the unique logic of the skill.
- **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. Link to secondary files if needed (e.g., `[See ADVANCED.md](ADVANCED.md)`) only one level deep.
- **Forward Slashes**: Always use `/` for paths, never `\`.
- **Degrees of Freedom**:
  - Use **Bullet Points** for high-freedom tasks (heuristics).
  - Use **Code Blocks** for medium-freedom (templates).
  - Use **Specific Bash Commands** for low-freedom (fragile operations).

## Workflow for Complex Tasks

Include:

1.  **Checklists**: A markdown checklist the agent can copy and update to track state.
2.  **Validation Loops**: A "Plan-Validate-Execute" pattern.
3.  **Error Handling**: Tell the agent to run `--help` if unsure about script usage.

## Output Template

When creating a skill, output:

```markdown
### [Folder Name]

**Path:** `.agent/skills/[skill-name]/`

### [SKILL.md]

## \`\`\`markdown

name: [gerund-name]
description: [3rd-person description]

---

# [Skill Title]

## When to use this skill

- [Trigger 1]
- [Trigger 2]

## Workflow

[Insert checklist or step-by-step guide here]

## Instructions

[Specific logic, code snippets, or rules]

## Resources

- [Link to scripts/ or resources/]
  \`\`\`
```

## Supporting Files

If applicable, provide content for `scripts/` or `examples/` directories.
