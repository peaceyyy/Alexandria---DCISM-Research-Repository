# Session Log Template

> **Purpose**: Standardized session log format. Copy to logs/sessions/YYYY-MM-DD-session-XX.md`.
> **Last Updated**: 2025-12-25 (Coherence Repair v7.1)

---

# Session Log: YYYY-MM-DD (Session XX)

**Date**: YYYY-MM-DD
**Time**: HH:MM - HH:MM SGT
**Focus**: [Main topic of this session]

---

## 1. Agenda (The Plan)

- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

---

## 2. Key Decisions & Insights (The Minutes)

- **Decision**: [What was decided] — [Why]
- **Insight**: [What was learned] — [What it means]

> **Formatting**: Use dash `-` for all bullets. Avoid asterisk `*`.

---

## 3. Action Items (Next Steps)

| Action             | Owner     | Status  |
| ------------------ | --------- | ------- |
| [Task description] | AI / User | Pending |

---

## 4. Checkpoints

> Automatically appended by `quicksave.py`. Do not manually write.

### ⚡ [HH:MM SGT]

[Summary of what happened]

---

## 5. Session Performance Review (AAR)

- **Self-Correction**: [Did AI catch/correct any errors?]
- **Calibration**: [User pattern recognition, feedback quality]
- **Verdict**: [One-line summary of session quality]

---

## 6. Synthetic RLHF Log

### 6.1 User Model Updates

- **Learned**: [New insight about user]
- **Updated in User_Profile.md**: Yes / No

### 6.2 AI Calibration

- **What worked**: [Successful techniques]
- **What to adjust**: [Improvements for next session]

---

## 7. Artifacts & Outputs

- **Created**: [List of new protocols, case studies, files]
- **Modified**: [List of changed files]

> **Rule**: Link all created files using `[Name](file:///absolute/path)` format.

---

## 8. Cross-Session Links

- **Continues from**: [Previous session or context]
- **Related**: [Protocols, case studies, sessions]

---

## 9. Parking Lot (Deferred)

- [ ] [Items to address in future sessions]

---

## Tagging

# session #[topic-tags]

> **Formatting**: Use `#tag` without space after `#`. Hashtags are used in artifacts for indexing (per `generate_tag_index.py`).
