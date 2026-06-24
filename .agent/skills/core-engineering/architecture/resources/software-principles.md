---
name: software-principles
description: Guide for quality focused software architecture coding patterns.
---

# Software Principles & Coding Standards

This resource complements the main Architecture skill with specific coding patterns based on Clean Architecture and Domain Driven Design.

## 1. Library-First Approach

- **ALWAYS search for existing solutions before writing custom code**
  - Check npm for existing libraries that solve the problem
  - Evaluate existing services/SaaS solutions
  - Consider third-party APIs for common functionality
- Use libraries instead of writing your own utils or helpers. For example, use `cockatiel` instead of writing your own retry logic.
- **When custom code IS justified:**
  - Specific business logic unique to the domain
  - Performance-critical paths with special requirements
  - When external dependencies would be overkill
  - Security-sensitive code requiring full control

## 2. Architecture & Design

- **Clean Architecture & DDD Principles:**
  - Follow domain-driven design and ubiquitous language
  - Separate domain entities from infrastructure concerns
  - Keep business logic independent of frameworks
  - Define use cases clearly and keep them isolated
- **Naming Conventions:**
  - **AVOID** generic names: `utils`, `helpers`, `common`, `shared`
  - **USE** domain-specific names: `OrderCalculator`, `UserAuthenticator`, `InvoiceGenerator`
  - Follow bounded context naming patterns
  - Each module should have a single, clear purpose
- **Separation of Concerns:**
  - Do NOT mix business logic with UI components
  - Keep database queries out of controllers
  - Maintain clear boundaries between contexts

## 3. Anti-Patterns to Avoid

- **NIH (Not Invented Here) Syndrome:**
  - Don't build custom auth when Auth0/Supabase exists
  - Don't write custom state management instead of using Redux/Zustand
- **Poor Architectural Choices:**
  - Mixing business logic with UI components
  - Database queries directly in controllers
- **Generic Naming Anti-Patterns:**
  - `utils.js` with 50 unrelated functions
  - `helpers/misc.js` as a dumping ground
  - `common/shared.js` with unclear purpose

## 4. Code Quality

- **Early return pattern**: Always use early returns when possible.
- **Decompose**:
  - Long components (>80 lines) -> Split.
  - Large files (>200 lines) -> Split.
- **Functions**:
  - Use arrow functions for conciseness.
  - Keep functions focused and under 50 lines.
  - Avoid deep nesting (max 3 levels).
- **Error Handling**: Proper error handling with typed catch blocks.
