---
description: Decompose monolithic files into modular components
---

# /atomize — Decompose monolithic files into modular components

---
description: Decompose monolithic files into modular components
---
> **Role**: Structural Refactorer
> **Agents**: Kairou (Planner), Janitor (Executor)
> **Goal**: Split files > 500 lines into single-responsibility modules.

---

## Phase 1: The Incision Plan (Kairou)

> **Trigger**: User plans to split a file (e.g., `GodObject.py`).

1.  **Analyze**: Map the dependencies and responsibilities in the target file.
2.  **Propose**: Create a "Split Strategy".
    - `GodObject.py` -> `config.py`
    - `GodObject.py` -> `utils.py`
    - `GodObject.py` -> `core.py`
3.  **Gate**: Wait for User Approval on the file structure.

## Phase 2: The Transplant (Janitor)

1.  **Extract**: Move functions/classes to new destination files.
2.  **Import**: Update imports in the new files to resolve dependencies.
3.  **Stub**: Leave imports in the old file (temporarily) if needed to prevent breakage, or fully migrate consumers.

## Phase 3: The Cleanup (Janitor)

1.  **Sweep**: Remove the moved code from the original file.
2.  **Lint**: Ensure new files follow project standards.
3.  **Verify**: Run tests to confirm the "patient" survived the surgery.
