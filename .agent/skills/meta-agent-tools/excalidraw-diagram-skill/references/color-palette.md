# Color Palette & Brand Style

**This is the single source of truth for all colors and brand-specific styles.** To customize diagrams for your own brand, edit this file — everything else in the skill is universal.

---

## Shape Colors (Semantic)

Colors encode meaning, not decoration. Each semantic purpose has a fill/stroke pair.

| Semantic Purpose  | Fill      | Stroke                        |
| ----------------- | --------- | ----------------------------- |
| Primary/Neutral   | `#1e1e3f` | `#3b82f6`                     |
| Secondary         | `#1e1e3f` | `#8b5cf6`                     |
| Tertiary          | `#1e293b` | `#38bdf8`                     |
| Start/Trigger     | `#1e1e3f` | `#3b82f6`                     |
| End/Success       | `#064e3b` | `#10b981`                     |
| Warning/Reset     | `#4c1d95` | `#d946ef`                     |
| Decision          | `#1e1e3f` | `#d946ef`                     |
| AI/LLM            | `#1e1e3f` | `#3b82f6`                     |
| Inactive/Disabled | `#1e293b` | `#475569` (use dashed stroke) |
| Error             | `#7f1d1d` | `#f43f5e`                     |

**Rule**: To avoid a "rainbow" effect, stick mostly to Primary/Neutral colors (`#1e1e3f` fill with strong blue/purple strokes) for standard flow nodes. Reserve distinct colored fills (Green, Red, dark purple) only for emphasis like buttons or critical actions.

---

## Text Colors (Hierarchy)

Use color on free-floating text to create visual hierarchy without containers.

| Level            | Color     | Use For                                            |
| ---------------- | --------- | -------------------------------------------------- |
| Title (Header)   | `#3b82f6` | Section headings, major panels                     |
| Subtitle         | `#8b5cf6` | Subheadings, secondary labels                      |
| Body/Description | `#f8fafc` | ALL explanations, annotations, internal node text  |
| Highlights/Misc  | `#d946ef` | Emphasized actions/triggers inside flows           |
| Code Snippet     | `#f8fafc` | Code output (with single accent colored if needed) |

---

## Evidence Artifact Colors

Used for code snippets, data examples, and other concrete evidence inside technical diagrams.

| Artifact          | Background | Text Color                                    |
| ----------------- | ---------- | --------------------------------------------- |
| Code snippet      | `#020617`  | Syntax-colored (language-appropriate)         |
| JSON/data example | `#020617`  | `#2dd4bf` (teal) or `#d946ef` (fuchsia chaos) |

---

## Default Stroke & Line Colors

| Element                                       | Color                                                         |
| --------------------------------------------- | ------------------------------------------------------------- |
| Arrows                                        | Use the stroke color of the source element's semantic purpose |
| Structural lines (dividers, trees, timelines) | Primary stroke (`#3b82f6`) or Slate (`#64748b`)               |
| Marker dots (fill + stroke)                   | Primary fill (`#8b5cf6`)                                      |

---

## Background

| Property          | Value     |
| ----------------- | --------- |
| Canvas background | `#0f0f23` |
