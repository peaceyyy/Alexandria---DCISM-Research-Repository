# Alexandria Coding Standards

## Purpose and Scope

This document defines the coding standards for Alexandria. It applies to all
application code in `Alexandria/`, including TypeScript, React components,
Next.js routes, styles, tests, and supporting configuration files where the
convention is relevant.

These standards complement the repository's existing framework conventions and
do not replace required Next.js, React, TypeScript, Supabase, or accessibility
requirements.

## Project Source-of-Truth Rules

Keep this document focused on coding practice. The approved project documents
below define the values and constraints that code must use rather than
re-create:

- [Preset Values and Data Consistency Guide](./preset-values-and-data-consistency.md)
  defines controlled metadata, stored keys, display labels, and unresolved
  domain decisions.
- [API Contracts](./api-contracts.md) defines service-layer DTOs, result
  envelopes, authorization boundaries, and ownership of shared types.
- [Frontend Design Guide](./DESIGN.md) defines visual tokens, component
  direction, responsive behavior, and accessibility limits.

When a documented value or rule is unclear, do not invent a local alternative.
Check the applicable source document and shared code first; if it remains an
open decision, ask the team before adding a new value, validation rule, or
display label.

## Naming Conventions

- Write class names, React component names, TypeScript types, and interfaces in
  `UpperCamelCase`.
- Write functions, methods, React hooks, parameters, and local variables in
  `lowerCamelCase`.
- Write named constant values in `UPPER_SNAKE_CASE` when they represent a stable
  application-wide value. Keep React-provided names and established framework
  APIs in their original form.
- Use descriptive names that communicate the value's purpose. Prefer
  `getCurrentUser` over vague names such as `getData`.
- Do not use two names that differ only by letter case. For example, do not use
  both `userId` and `UserId` in the same scope or feature.
- Keep stored keys and display labels distinct. Use stable keys such as
  `for_review` or `ai_engineering` in data and logic; map them to user-facing
  labels at the display boundary.

## Commenting and Formatting Conventions

- Use two spaces for TypeScript and JavaScript code indentation. Do not use
  tabs.
- Indent nested JSX/HTML markup by four spaces relative to its surrounding code
  block.
- Leave a blank line between classes, functions, methods, and distinct logical
  blocks so each unit is easy to scan.
- Use braces for `if`, `else`, `for`, `do`, and `while` statements, including
  when the body is empty or contains a single statement.
- Place opening braces on the same line as the associated statement, function,
  class, or block-like construct (Kernighan and Ritchie / Egyptian-bracket
  style).
- End every statement with a line break.
- For multi-line comments, begin every continuation line with `*`, aligned with
  the first `*` in the comment block.

## Recommended Practices

- Reuse the shared domain sources for controlled values. Do not duplicate
  department arrays, research-area IDs, status keys, roles, or affiliation
  lists in individual pages, components, mock data, or validation schemas.
- Use the canonical service contracts in `Alexandria/lib/services/types.ts`.
  UI components should consume service functions and frontend-safe DTOs instead
  of accessing raw database rows or calling Supabase directly.
- Use the CSS custom properties in `Alexandria/app/globals.css` and the
  associated Tailwind tokens for interface colors and semantic states. Do not
  introduce one-off raw colors, border opacities, or status-chip colors in
  component classes.
- Follow the design guide's accessible production limits even when a mockup
  shows smaller text or tighter controls.
- Align related names, values, and comments when the alignment improves
  readability; do not introduce spacing that makes formatting inconsistent.
- Choose descriptive function names that state the action or result clearly.
- Keep comments for intent, business rules, non-obvious behavior, and public
  contracts. Do not use comments to restate self-explanatory code.
- Do not commit commented-out code. Remove obsolete code and rely on version
  control to preserve its history.
- Keep each statement on its own line and format changes consistently with the
  surrounding file.

## Agreement

We, the members of CISHANE, certify that these coding standards are authentic
team conventions created to meet the requirements and quality standards set by
the Software Engineering course coordinator. We will adhere to these
conventions and practices to promote readable, maintainable, and high-quality
software.

Any non-conformance identified during code reviews or the year-end process
audit will be handled in accordance with the Software Engineering course
rubrics for software quality.
