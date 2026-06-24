# Specification Template (Suggestion-Based)

**Created**: [DATE]  
**Persona**: Kairou (Architect)  
**Constitution**: Compliant with `.agent/personas/CONSTITUTION.md`

---

## Instructions for AI

When creating this specification:

1. **Research before recommending** - Use `search_web` for current best practices
2. **Provide context-aware suggestions** - Base recommendations on project requirements
3. **Explain rationale** - WHY is this the best choice for THIS project?
4. **Offer alternatives** - Present 2-3 options with use cases
5. **Allow open-ended responses** - User can accept, choose alternative, or ask for more info

---

## Product Requirements

### Target Users

[Who is this for? Role, skill level, problem they're solving]

### User Stories

**Story 1**: As a [role], I want [goal], so that [benefit]

**Priority**: P1 (Must-have for MVP)

**Acceptance Criteria**:

- [ ] Given [state], when [action], then [outcome]
- [ ] Given [state], when [action], then [outcome]

---

## Technical Specification

### Backend Framework

**Current Context**: You're building a [project type] that needs [specific requirements].

**Recommendation**: [Framework Name]

**Why [Framework Name]**:

- ✅ **[Benefit 1]**: [Explanation of how it helps THIS project]
- ✅ **[Benefit 2]**: [Specific advantage for user's use case]
- ✅ **[Benefit 3]**: [Why it's better than alternatives for this scenario]
- ✅ **Learning value**: [What user will learn from using this]

**Alternative Options**:

- **[Alternative 1]**: [When to choose this instead]. Choose if [specific scenario].
- **[Alternative 2]**: [When to choose this instead]. Choose if [specific scenario].
- **[Alternative 3]**: [When to choose this instead]. Choose if [specific scenario].

**Your Decision**:

- [ ] Accept recommendation ([Framework Name])
- [ ] Choose alternative: **\*\***\_**\*\***
- [ ] Need more information about: **\*\***\_**\*\***

---

### Database Choice

**Current Context**: Based on your requirements for [data characteristics, scale, complexity].

**Recommendation**: [Database Name]

**Why [Database Name]**:

- ✅ **[Benefit 1]**: [How it solves user's specific data needs]
- ✅ **[Benefit 2]**: [Advantage for this use case]
- ✅ **[Benefit 3]**: [Why it's the best fit]
- ✅ **Learning value**: [Industry relevance, career value]

**Alternative Options**:

- **[Alternative 1]**: [Use case]. Choose if [scenario].
- **[Alternative 2]**: [Use case]. Choose if [scenario].
- **[Alternative 3]**: [Use case]. Choose if [scenario].

**Your Decision**:

- [ ] Accept recommendation ([Database Name])
- [ ] Choose alternative: **\*\***\_**\*\***
- [ ] Need more information about: **\*\***\_**\*\***

---

### Authentication Approach

**Current Context**: Your app needs [user management requirements, security level, scale].

**Recommendation**: [Auth Approach]

**Why [Auth Approach]**:

- ✅ **[Benefit 1]**: [Security advantage]
- ✅ **[Benefit 2]**: [Implementation simplicity/complexity trade-off]
- ✅ **[Benefit 3]**: [Scalability or UX benefit]
- ✅ **Learning value**: [Modern auth patterns]

**Alternative Options**:

- **[Alternative 1]**: [When to use]. Choose if [scenario].
- **[Alternative 2]**: [When to use]. Choose if [scenario].
- **[Alternative 3]**: [When to use]. Choose if [scenario].

**Your Decision**:

- [ ] Accept recommendation ([Auth Approach])
- [ ] Choose alternative: **\*\***\_**\*\***
- [ ] Need more information about: **\*\***\_**\*\***

---

## Architecture & Design

### System Architecture

**Recommendation**: [Architecture Pattern]

**Why [Architecture Pattern]**:

- ✅ **[Benefit 1]**: [How it supports project goals]
- ✅ **[Benefit 2]**: [Maintainability/scalability advantage]
- ✅ **[Benefit 3]**: [Team size/skill level fit]

**Alternative Approaches**:

- **[Alternative 1]**: [When to use]. Choose if [scenario].
- **[Alternative 2]**: [When to use]. Choose if [scenario].

**Your Decision**:

- [ ] Accept recommendation ([Architecture Pattern])
- [ ] Choose alternative: **\*\***\_**\*\***
- [ ] Need more information about: **\*\***\_**\*\***

---

## Constitution Compliance

**Article II (Knowledge-First)**:

- ✅ All tech stack choices reference authoritative sources
- ✅ No assumptions made about API signatures
- ✅ Recommendations based on current best practices (researched via web)

**Article III (SOLID Principles)**:

- ✅ [Specific SOLID application in this project]
- ✅ [Example of separation of concerns]

**Article IV (DRY)**:

- ✅ [How shared logic will be extracted]
- ✅ No duplicate code blocks planned

**Article V (KISS)**:

- ✅ Using [N] projects/services - within simplicity threshold
- ⚠️ **COMPLEXITY JUSTIFICATION**: [If complex, explain why simpler alternatives rejected]

**Article VI (Test-First)**:

- ✅ Test strategy defined ([framework], >80% coverage)
- ✅ Tests written before implementation

**Article IX (Security by Default)**:

- ✅ Input validation strategy defined
- ✅ Secrets in environment variables (not code)
- ✅ Secure defaults (HTTPS, encrypted connections)

---

## Self-Review Checklist

**Requirement Completeness**:

- [ ] All technical decisions have recommendations with rationale
- [ ] Alternatives provided for major choices
- [ ] User can make informed decisions (not quizzed)
- [ ] Requirements are testable and unambiguous

**Constitution Compliance**:

- [ ] Article II: All tech decisions reference current documentation
- [ ] Article III: SOLID principles applied
- [ ] Article V: Simplicity justified
- [ ] Article VI: Test strategy defined

**Token Hygiene**:

- [ ] Loaded knowledge sources logged
- [ ] Used llms.txt for reference discovery
- [ ] Read only necessary files
