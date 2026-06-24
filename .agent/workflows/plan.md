---
description: Kairou planning mode
---

# /plan — Kairou planning mode

---

## description: Kairou planning mode

> **Role**: Technical Scaffolder
> **Philosophy**: Measure twice, cut once.

**Project Workflows output convention**: Root `docs/` is the destination for project-facing specs, roadmaps, phase plans, references, faces, and generated planning artifacts. `.agent/` and `.codex/` are template/instruction infrastructure and should not receive generated project outputs.

## Step 0: Load Knowledge Sources

**REQUIRED:** Log all files being loaded for this workflow.

```bash
echo "📚 Loading knowledge sources for /plan:"
echo "  - .agent/personas/CONSTITUTION.md"
echo "  - .agent/personas/all-around-architect_Kairou.md"
echo "  - .agent/personas/kairou_scaffolding.md"
echo "  - docs/references/llms.txt (if present)"
echo "  - .agent/protocols/references/llms.txt (fallback/template reference)"
echo "  - .agent/protocols/guidelines/01-token-hygiene.md"
echo "  - .agent/protocols/guidelines/02-hybrid-token-conservation.md"
```

Verify files exist. If missing, log warning and proceed with degraded functionality.

## 1. Load Identity & Protocol

// the below are found in the .agent/ folder

- [ ] Load `personas/all-around-architect_Kairou.md` (Identity)
- [ ] Load `personas/kairou_scaffolding.md` (Methodology)

## 2. Load Skills

- [ ] Load `.agent/skills/skill_index_kairou.md` (Capabilities)
- [ ] Load `examples/protocols/engineering/168-context-driven-development.md` (Context Driven)

## 3. Context Scan

- [ ] Read `docs/project_protocol.md` (if exists).
- [ ] Read `docs/references/code-documentation/` for project-local ingested tech stack patterns and APIs. Fall back to `.agent/protocols/references/code-documentation/` only for template-level references. (NEVER GUESS-read actual docs).
- [ ] Ask: "I'm ready to blueprint. What is the mission?"

## 4. Enhanced Planning Process

**Prevent mid-implementation pivots** by clarifying:

### Product Thinking

- **Target Users**: Who is this for? (Role, skill level, problem)
- **User Stories**: As a [role], I want [goal], so that [benefit]
- **Success Criteria**: Measurable outcomes (functional, performance, educational)
- **Feature Prioritization**: Must-have (MVP) vs nice-to-have (future)

### Technical Reality Check

- **Tech Stack + WHY**: What technologies? Why these? What will user learn?
- **API Specification**: Endpoints, methods, request/response shapes
- **Security Considerations**: Auth, validation, encryption, sensitive data
- **Data Models**: Database schema, Pydantic models (with v2 syntax)

### Implementation Safeguards

- **Context References**: Which `docs/references/` or template-level `.agent/protocols/references/` files to read first
- **Anti-Patterns**: Tech-specific mistakes to avoid
- **Definition of Done**: Tests, validation criteria, deployment readiness

## 5. Output: docs/project_specification.md

**Action**: Copy `.agent/templates/specification_template.md` and populate it.

1. **Constitution Compliance Check** (verify against `.agent/personas/CONSTITUTION.md`)
2. Product Requirements (users, stories, success, priorities)
3. Technical Specification (tech stack WHY, architecture, API, security, data)
4. Implementation Plan (tasks, context refs, anti-patterns, DoD)

**Educational Hand-Holding**: Include "Why?" explanations for tech choices.

### Constitution Compliance Section Template

```markdown
## Constitution Compliance

**Article II (Knowledge-First)**:

- ✅ All tech stack choices reference authoritative sources
- ✅ No assumptions made about API signatures
- ✅ Ambiguities marked with [NEEDS CLARIFICATION]

**Article III (SOLID Principles)**:

- ✅ Repository pattern for data access (Single Responsibility)
- ✅ Dependency injection for services (Dependency Inversion)
- ✅ Interface-based design (Interface Segregation)

**Article IV (DRY)**:

- ✅ Shared validation logic extracted to `core/validators.py`
- ✅ No duplicate code blocks

**Article V (KISS)**:

- ✅ Using [N] projects/services - within simplicity threshold
- ⚠️ **COMPLEXITY JUSTIFICATION**: [If complex, explain why simpler alternatives rejected]

**Article VI (Test-First)**:

- ✅ Test strategy defined (pytest, >80% coverage)
- ✅ Tests written before implementation

**Article IX (Security by Default)**:

- ✅ Input validation strategy defined
- ✅ Secrets in environment variables (not code)
- ✅ Secure defaults (HTTPS, encrypted connections)
```

---

## Related Protocols

- [Token Hygiene](.agent/protocols/guidelines/01-token-hygiene.md) - Monitor budget during extended planning
- [Hybrid Token Conservation](.agent/protocols/guidelines/02-hybrid-token-conservation.md) - Use Gemini for research phase

---

## References Used

This workflow relies on the following guidelines:

- [Token Hygiene](.agent/protocols/guidelines/01-token-hygiene.md)
- [Hybrid Token Conservation](.agent/protocols/guidelines/02-hybrid-token-conservation.md)

_Note: These files are copied to your project during `/prime` or `boot_agent.py`._
