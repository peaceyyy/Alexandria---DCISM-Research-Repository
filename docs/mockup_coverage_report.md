# Figma Mockups vs. PRD Coverage Report

This document cross-references the 15 screens discovered in the Figma design (Alexandria) against the requirements outlined in the `Alexandria PRD.md` and `DESIGN.md` documents. 

The goal is to identify which workflows and mockups are missing before development begins.

---

## 1. Screens Found in Figma

Based on the visual parsing of the Figma link, the following 15 screens currently exist:

**Column 1: Authentication & Entry**
1. Landing Page (Guest)
2. Log In Page
3. Sign In (Registration) Page

**Column 2: Catalog & Moderator Workflow**
4. Main Page (Research Catalog - Student/Guest)
5. Moderator Dashboard (Home)
6. Moderator Pending Reviews
7. Moderator Detailed Review Page
8. Moderator All Studies Log
9. Moderator Published Studies

**Column 3: Research Inspection & Submission**
10. Selected Page (Detailed View - Guest/Student)
11. Submission (Upload Form)

**Column 4: Profile & Admin Workspace**
12. Profile Page
13. Admin Dashboard
14. Admin Members Management
15. Admin Moderators Management

---

## 2. Cross-Reference with PRD Requirements

| PRD Section | Requirement | Figma Coverage | Status |
| :--- | :--- | :--- | :--- |
| **6.2, 6.3** | **Public Repository & Search:** Browse metadata, keyword search, filters, sort. | `Main Page` | ✅ Covered |
| **6.4** | **Thesis Detail View:** Complete metadata, abstract, tags, recommendations, lessons learned. | `Selected Page` | ✅ Covered |
| **6.6** | **Related Thesis Discovery:** Recommend similar projects based on keywords/tags. | `Selected Page` | ✅ Covered |
| **6.7** | **Authentication:** Login and student registration. | `Log In Page`, `Sign In Page` | ✅ Covered |
| **6.7** | **Admin Role:** Manage accounts, members, and moderators. | `Admin Dashboard`, `Members`, `Moderators` | ✅ Covered |
| **5 (Table)** | **Moderator Role:** Review and approve uploads (`for_review`, `flagged`, `accepted`). | `Pending Reviews`, `Detailed Review Page`, `All Studies` | ✅ Covered |
| **6.9** | **Archive/Unpublish Workflow:** Admins can archive/unpublish without hard deleting. | `Published Studies` | ✅ Covered |
| **6.1, 6.8** | **Upload & Management:** Create draft, upload PDF, add metadata. | `Submission Form` | ⚠️ Partially Covered |
| **6.5** | **PDF Access:** Authenticated preview and download only. | `Selected Page` | ⚠️ Partially Covered |

---

## 3. Missing Mockups & Edge Cases

Based on the PRD, the following screens and states are **missing from the Figma design** and should be addressed:

### A. "My Submissions" & Thesis Editing (Member & Admin)
While there is a "Submission Form" for initial upload, there is no interface for users to manage existing submissions:
* **My Submissions Page / Filter:** Members need a way to see their own pending (`for_review`) or `flagged` submissions. The public catalog only shows accepted theses.
* **Edit Thesis Page (Members):** If a thesis is flagged, the member should be able to click "Edit", bringing them back to a pre-filled Submission Form to correct errors.
* **Draft Management (Admins):** PRD 6.8 defines a Draft-to-Publish workflow where Admins save drafts and edit them before publishing.
* Both flows require an "Edit" interface that allows managing multiple ordered entries for "Recommendations" and "Lessons Learned" (PRD 6.1) and linking specific authors/advisers.

### B. PDF Access Restrictions (Anonymous State)
PRD 6.4 states: *"Anonymous users shall not be able to preview or download thesis PDFs. Full published thesis metadata shall remain visible."*
* **Missing State:** What does the `Selected Page` look like for an anonymous user? (e.g., A blurred PDF viewer with a "Log in to view" CTA).

### C. Password Recovery Flow
The Log In page includes a "Forgot Password?" link, but there are no mockups for:
* Password Reset Request (Email input).
* Check Your Email confirmation.
* Update Password form (After clicking the email link).

### D. Empty States & Error Pages
The PRD requires search and filtering, which naturally leads to empty states.
* **Empty Search Results:** What the `Main Page` shows when no theses match the filters.
* **Empty Dashboards:** What Moderators see when there are 0 Pending Reviews.
* **Error Pages:** 404 (Not Found), 500 (Server Error), or 403 (Unauthorized / Access Denied).

### E. Mobile & Tablet Views
`DESIGN.md` explicitly mentions responsive rules (e.g., *“On tablet and mobile: Collapse the right FAQ rail below content... Turn the left filters into a drawer or collapsible panel”*). 
* **Missing:** There are no dedicated mobile/tablet artboards to verify these responsive states visually.

### F. PDF Replacement UI
PRD 6.10 states administrators can replace a thesis PDF while keeping old metadata.
* **Missing:** An interface element (likely on the Edit Thesis page) to upload a replacement PDF and view previous versions.
