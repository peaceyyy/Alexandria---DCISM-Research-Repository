---
description: Holistic codebase improvement (perf, DRY, readability)
---

# /optimize — Performance, Structure, and Readability Improvement

---

## description: Holistic codebase improvement (perf, DRY, readability)

> **Purpose**: Transform existing code for better quality WITHOUT changing behavior.
> **Scope**: Performance, Clean Code (DRY), Readability.

## When to Use

- "Optimize this function for speed"
- "Clean up this messy module"
- "Reduce duplicate code (DRY)"
- "Make this code more readable"

## Workflow

### Step 1: Detect Intent

**Type**:

- **Perf**: Speed, Memory, Complexity (O(n)).
- **Structure**: DRY, Separation of Concerns, Modularity.
- **Readability**: Naming, Comments, Formatting.

### Step 2: Analyze Current State

- **Load**: Source code file.
- **Identify Violations**: (e.g., N+1 query, Repeated block, Magic numbers).
- **Propose Strategy**: "Extract helper function to `utils.ts`".

### Step 3: Apply Optimization

**Protocol**:

1.  **Isolate**: Focus on target function/module.
2.  **Verify Tests**: Ensure tests pass BEFORE changes.
3.  **Refactor**: Apply the change (e.g., Stream API -> Loop, or Extract Method).
4.  **Verify Behavior**: Ensure tests pass AFTER changes.

### Step 4: Validate Improvement

- **Compare**: Before vs After.
- **Metrics**: "Function reduced from 50 lines to 15".
- **Performance**: "Complexity reduced to O(log n)".

---

## Output Format

```markdown
## ⚡ Optimization Report

**Target**: `path/to/file.py`

### Changes Applied

- **Extracted**: `process_data()` helper function.
- **Removed**: 3 duplicated blocks.
- **Optimized**: Replaced nested loops with map/filter.

### Impact

- Logic: **Unchanged** ✅
- Lines of Code: -25 📉
- Readability: ⭐⭐⭐⭐⭐
```

---

## Related

- `/analyze` - To find _what_ to optimize.
- `/validate` - To prove correctness.
