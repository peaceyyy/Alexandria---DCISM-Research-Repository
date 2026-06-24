---
description: Implement scalable, accessible multi-theme (Light/Dark) toggles and system preferences handling using CSS variables.
---

# / setup-theming 

> **Purpose**: A formal workflow for adding or migrating to dual-theme (Light/Dark) support. It builds scalable and accessible state management without being strictly "Dark First" or "Light First".
> **Personas Invoked**: **Sparks** (for the UI/UX token mapping) and **Kairou** (for state management architecture).

## Overview

Implementing multi-theme support at scale requires minimizing DOM re-renders and maintaining codebase consistency. The gold standard is utilizing **CSS Custom Properties (Variables)** controlled by a `data-theme` attribute on the `<html>` or `<body>` tag, managed via a global context provider.

---

## 1. Context & Setup (Kairou)

**Goal**: Prepare the environment and audit existing variables without enforcing destructive rewrites.

1.  **Locate Global Styles**: Find the root CSS file (e.g., `index.css`, `globals.css`).
2.  **Declare Color-Scheme Support**:
    -   *Crucial Step*: Explicitly declare `color-scheme: light dark;` in the `:root` to signal browser extensions (like Dark Reader) to back off from incorrectly auto-inverting colors.
3.  **Audit Existing CSS Variables**:
    -   *Constraint*: **Do not aggressively refactor** established CSS variable scopes if they are too broad. Work within the established naming conventions.
    -   *Action*: Identify root colors. If they are hardcoded hexadecimal/RGB values in component files, map them into the root CSS file as variables.

## 2. Semantic Mapping & Theme Overrides (Sparks)

**Goal**: Add the secondary theme adhering to aesthetic principles and accessibility rules.

1.  **Define Theme Blocks**: Use `:root` (or `[data-theme='light']`) for the base theme, and create the inverse block (e.g., `[data-theme='dark']`).
2.  **Core CSS Principle (The Orchestrated Pair Rule)**:
    -   *Never set a text color without an explicit, variable-based background-color.* Backgrounds and foregrounds must transition together as a readable unit to prevent "orphaned colors" when the theme switches.
3.  **Map Theme Equivalents**:
    -   *Light Themes*: Avoid harsh pure white (`#FFFFFF`). Use soft off-whites (e.g., `#FAFAFA`, `#F4F4F5`).
    -   *Dark Themes*: Use deep charcoals, neutral grays, cosmic blues. Avoid pure black (`#000000`) for backgrounds.
    -   *Elevation*: Shadows work better in Light Mode. For Dark Mode, elevation is often better communicated through lighter background overlays than box-shadows.
4.  **Accessibility Check**: Ensure WCAG contrast ratios (minimum 4.5:1 for body text) are maintained across all theme palettes.

## 3. State Management Implementation (Kairou)

**Goal**: Store and retrieve user preference securely and continuously.

1.  **Create Theme Provider** (e.g., React Context, Vue Provide/Inject, or vanilla JS closure):
    -   Manage the `theme` state (`light`, `dark`, `system`).
    -   Persist the selected theme string into `localStorage`.
2.  **FOIT Prevention (Flash of Incorrect Theme)**:
    -   Inject a minimal blocking script in the `<head>` of `index.html` (or `_document.js` / root layout) that reads `localStorage` and `window.matchMedia('(prefers-color-scheme: dark)')` to set the `data-theme` attribute *before* the body renders.
3.  **Hydration Match**: Ensure the initial state of the React/Vue component tree matches the server/blocking script to prevent hydration mismatches.

## 4. UI Toggle Component (Sparks)

**Goal**: Give the user control through a familiar, calm interface.

1.  **Component Creation**: Build a `ThemeToggle.jsx/tsx` component.
2.  **Design Patterns**:
    -   Use familiar iconography (Sun / Moon / System).
    -   *Sparks Principle*: Motion must be calm. Use a subtle crossfade or rotational transition. No bouncy or loud animations.
3.  **Accessibility**:
    -   Use an `<button>` wrapping the icon.
    -   Include `aria-label="Toggle theme"` and `aria-pressed={isDark}`.
    -   Ensure visible focus states in all themes.

## 5. Verification & Clean-Up (Janitor)

**Goal**: Test edge cases and clean up leftover hardcoded colors.

1.  Search the `src` directory for hardcoded color values (`#`, `rgb`, `hsl`) that slipped past the CSS variable mapping. Replace them with `var(--semantic-name)`.
2.  Test the toggle:
    -   Does it remember the state on page reload?
    -   Do newly rendered components respect the `data-theme` attribute without requiring an app reboot?
    -   Does changing the system OS theme correctly update the app when set to "system"?