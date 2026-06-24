---
description: Coding documentation ingestion into references for agent knowledge
---

# /ingest — Ingest external documentation

---

## description: Documentation ingestion into references

> **Purpose**: Load external docs using web_search to context and store inside root docs references
> **Skill**: Document Processor (System)

**Project Workflows output convention**: Store ingested, generated, or project-specific references under `docs/references/`. Do not append project-facing reference material to `.agent/` or `.codex/`; those folders are template/instruction infrastructure.

## When to Use

- "Go over the codebase and retrieve relevant docs of the tech stack used"
- "Learn this library"
- "Update knowledge about [Framework]"
- "Read this documentation URL"

## Workflow

### Step 1: Define Source & Context

**Input**:

- URL (Docs Site)
- PDF / Markdown (Local File)
- GitHub Repo (README.md)
- **Implicit Strategy**: If no language or framework is explicitly specified, the agent MUST first identify the target tech stack.

**Action (Implicit Mode)**:

1. **Analyze Codebase**: Inspect configuration files (`package.json`, `requirements.txt`, `go.mod`, etc.) or read source code to determine the primary framework/library.
2. **Check Specifications**: Review project specs or architecture docs if available.
3. **Web Search**: Use `web_search` to find the official documentation URL for the identified technology.

### Step 2: Site Map & Structure Discovery

**Goal**: Optimize ingestion by leveraging the documentation's native structure.

**Action**:

1. **Find Site Map**: Attempt to locate `/sitemap.xml` or a "table of contents" page to understand the documentation hierarchy.
2. **Smart Traversal**: Many documentation sites (Docusaurus, GitBook, etc.) are structured for easy parsing. Look for "Introduction", "Core Concepts", and "API Reference".
3. **Target Relevant Sections**: Prioritize sections relevant to the current task or codebase context (e.g., if working on auth, focus on "Authentication" sections).

### Step 3: Read & Process

**Tool**: `read_url_content` (or `view_file` if local).
**Action**: Extract key concepts, API signatures, and usage examples.

### Step 4: Synthesis (Minimize Tokens)

**Format**: `llms.txt` Standard or concise Markdown.

- Remove fluff (marketing text, navigation, comments).
- Keep code blocks & strict API definitions.
- Summarize concepts.

### Step 5: Update Knowledge Base

1.  **Append** to `docs/references/llms.txt` (or create a specific topic file).
2.  **Link** in `docs/references/code-documentation/`.

---

## Output

- `docs/references/llms.txt` updated.
- `docs/references/code-documentation/**.md`.
