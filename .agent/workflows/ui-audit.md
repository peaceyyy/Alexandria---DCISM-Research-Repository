---
description: Perform a vibe check on UI/UX code against anti-patterns
---

# /ui-audit — Anti-Vibe Coding Checklist Audit

---

## description: Perform a vibe check on UI/UX code against anti-patterns

> **Skill**: [designing-ui](../skills/ui-ux-design/designing-ui/SKILL.md) (Standard Mode)
> **Knowledge**: [anti-vibe-coding-checklist.md](../references/anti-vibe-coding-checklist.md)

## When to Use

- "Check this UI for bad vibe"
- "Audit the design implementation"
- "Is this page aesthetic?"

## Workflow

### Step 1: Load Checklist

**Read**: `.agent/references/anti-vibe-coding-checklist.md`.
**Focus**: Colors, Typography, Spacing, Shadows, Layout.

### Step 2: Audit Implementation

**Look for Anti-Patterns**:

- Generic Blue (`#0000FF`).
- Default Browser Fonts (`Times New Roman`).
- Hardcoded CSS (No Design Tokens).
- Poor Contrast Ratio.
- Inconsistent Padding/Spacing.

### Step 3: Generate Strict Code Report

```markdown
## 🎨 UI/UX Audit Report

**Verdict**: ❌ FAIL / ✅ PASS

### 🚫 Anti-Patterns Found

1. **Generic Color**: `Button.css:12` uses `#0000FF` (Pure Blue).
   - [Fix]: Use tailored palette (`#3B82F6` or similar).

2. **Inconsistent Spacing**: `Card.jsx` uses `margin: 17px`.
   - [Fix]: Adhere to `4px` grid system (`16px`).

3. **Poor Typography**: `Hero.jsx` is missing font-weight hierarchy.
   - [Fix]: Make title `bold`, subtitle `medium`.

### ✅ Pass Criteria

- [ ] No default fonts.
- [ ] Accessible limits met.
- [ ] Design Tokens used.
```

---

## Related

- `/design` - To fix the issues found.
- `/vibe` - To iterate quickly.
