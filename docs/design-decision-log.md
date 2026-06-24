# Alexandria Design Decision Log

This log records accepted product, database, backend, and access-control decisions for the Alexandria MVP. Use it as the source of traceability when updating the PRD, database schema, backend API, and frontend flows.

## 2026-06-24

### Decision 001: Use Supabase/PostgreSQL as the MVP database platform

Status: Accepted

Context: Alexandria needs a database for thesis metadata, tags, advisers, research areas, admin records, and search/filter behavior.

Decision: Use Supabase/PostgreSQL as the MVP database platform.

Consequences:

- Database work should target PostgreSQL.
- Schema design should include foreign keys, indexes, migrations, and Row Level Security.
- Backend implementation should assume Supabase project configuration is required.
- The database engineer should draft the schema against Supabase/PostgreSQL rather than SQLite or a generic local-only database.

### Decision 002: Use Supabase Auth for authentication

Status: Accepted

Context: The project needs authenticated PDF access and admin-only management workflows.

Decision: Use Supabase Auth as the hosted authentication provider.

Consequences:

- Identity should come from Supabase `auth.users`.
- App-specific display and role fields should live in a `profiles` table.
- Admin/Contributor permissions should be checked through backend logic and database policies.
- Backend-owned password storage is out of scope for the MVP.

### Decision 003: Use Supabase Storage for PDF files

Status: Accepted

Context: Alexandria needs to store and serve thesis PDFs for preview and download.

Decision: Store uploaded PDFs in Supabase Storage/object storage. Store object metadata and references in the database.

Consequences:

- The database should store file metadata in `thesis_files`.
- The actual PDF should not be stored directly inside the main thesis table.
- The storage bucket should be private or authenticated for the MVP.
- External PDF/repository links remain a fallback only if object storage becomes impractical.

### Decision 004: Require authentication for PDF preview and download

Status: Accepted

Context: The repository should expose thesis metadata for discovery while controlling access to thesis documents.

Decision: Both PDF preview and PDF download require authentication.

Consequences:

- Anonymous users may browse/search published thesis metadata.
- Anonymous users must not preview or download PDFs.
- The frontend needs login-aware PDF preview/download states.
- The backend/storage layer should use authenticated reads or signed URLs.

### Decision 005: Use draft then publish for admin-created records

Status: Accepted

Context: Admin-created thesis records may be incomplete while metadata, PDF files, tags, and knowledge-transfer entries are being prepared.

Decision: New admin-created thesis records start as `draft`, then are manually published.

Consequences:

- Public repository views should only show `published` records.
- Draft records should be visible/editable to authorized Admin/Contributor users.
- A publish action should validate required metadata and file presence.
- The thesis table should include a publication status such as `draft`, `published`, and `archived`.

### Decision 006: Upload PDF and manually enter metadata

Status: Accepted

Context: The team does not plan to depend on automated PDF metadata extraction for the MVP.

Decision: Admins upload the PDF and manually enter required metadata.

Consequences:

- The admin UI should include PDF upload and metadata form fields.
- The backend should not assume metadata can be extracted from the PDF.
- Required fields must be validated before publishing.
- Future OCR or extraction features remain out of scope.

### Decision 007: Store author names only

Status: Accepted

Context: The MVP only needs thesis author display and author-name search. Author contact management is unnecessary.

Decision: Store ordered author names per thesis. Do not create reusable author profiles or collect author email/contact fields for MVP.

Consequences:

- The database can use `thesis_authors` with `thesis_id`, `author_name`, and `author_order`.
- The MVP should not include an `authors` profile table.
- Author search should search `thesis_authors.author_name`.
- If future author profiles become necessary, a later migration can normalize authors.

### Decision 008: Store recommendations and lessons as multiple ordered entries

Status: Accepted

Context: Recommendations and lessons learned are core knowledge-transfer features. They need to be readable and editable as separate points.

Decision: Store each recommendation and lesson learned as its own ordered row.

Consequences:

- Use `thesis_recommendations` and `thesis_lessons`.
- Each row should include content and sort order.
- The frontend should display these as ordered or bullet-style lists.
- One large freeform text field is not the MVP model.

### Decision 009: Compute related theses dynamically

Status: Accepted

Context: Related thesis discovery is required, but AI-powered recommendations and manual override tooling are excluded from the MVP.

Decision: Compute related theses dynamically using shared tags, keywords, and/or research area.

Consequences:

- A materialized `thesis_related` table is optional and should not be required for the first MVP schema.
- Related-thesis queries should exclude the current thesis and prioritize shared tags/research area.
- AI recommendations and semantic search remain future features.

### Decision 010: Keep public metadata browsing but restrict document access

Status: Accepted

Context: Students should be able to discover relevant work quickly, while document access remains controlled.

Decision: Published thesis metadata is publicly discoverable, but document preview/download requires authentication.

Consequences:

- Public pages can show title, author names, year, abstract preview, adviser, department, research area, and tags.
- Detail pages can show complete metadata and knowledge-transfer content.
- PDF controls should prompt login for anonymous users.
- Storage policies must not allow anonymous PDF reads.

### Decision 011: Allow school-email student self-registration

Status: Accepted

Context: Students need authenticated access for PDF preview and download without requiring manual administrator onboarding for every student.

Decision: Anyone with a `usc.edu.ph` email address may create a Student visitor account.

Consequences:

- Student PDF access can scale without admin-created accounts.
- Admin and Contributor accounts should still be controlled by administrators.
- Authentication implementation must validate or restrict signup to the `usc.edu.ph` email domain.
- Public anonymous users remain able to browse metadata without an account.

### Decision 012: Keep full published metadata public

Status: Accepted

Context: Alexandria's discovery goal depends on students quickly evaluating whether a thesis is relevant.

Decision: Full published thesis metadata is public, while PDF preview and download remain authenticated.

Consequences:

- Anonymous users can view thesis detail metadata, recommendations, lessons learned, tags, adviser, department, and research area.
- PDF access is the primary protected boundary.
- The frontend should not hide detail pages behind login.
- RLS/backend policies must distinguish metadata reads from storage object reads.

### Decision 013: Archive/unpublish instead of hard delete in normal UI

Status: Accepted

Context: Thesis repository data is institutional knowledge and should not be casually destroyed.

Decision: The normal admin removal action is archive/unpublish, with internal soft delete support.

Consequences:

- Public views should exclude archived records.
- Admin views may show archived records for recovery or review.
- The database should include status and/or soft delete fields.
- Hard delete should not be part of the ordinary admin workflow.

### Decision 014: Use Admin, Contributor, and Student visitor roles

Status: Accepted

Context: The system needs more than one privileged content role, while staying simple enough for MVP implementation.

Decision: Use three product roles: Admin, Contributor, and Student visitor.

Consequences:

- Admins manage accounts, roles, publishing, archive/unpublish actions, and system-level controls.
- Contributors help create and edit repository content.
- Student visitors browse metadata and access PDFs after authentication.
- Role checks should be reflected in backend logic and database policies.

### Decision 015: Use `draft`, `published`, and `archived` thesis statuses

Status: Accepted

Context: The repository needs a minimal status model for preparation, public visibility, and retirement.

Decision: Use `draft`, `published`, and `archived` as the MVP thesis statuses.

Consequences:

- Draft records are editable but not public.
- Published records are publicly discoverable.
- Archived records are hidden from public browsing/search.
- A separate review status is not part of MVP.

### Decision 016: Require recommendations and lessons, with separate meanings

Status: Accepted

Context: Recommendations and lessons learned are the project differentiator from a simple file repository.

Decision: Published thesis records must include both recommendations and lessons learned. Recommendations describe study gaps, research opportunities, limitations, and future work. Lessons learned describe practical execution guidance, process advice, tooling issues, team workflow advice, defense preparation, and implementation pitfalls.

Consequences:

- Publish validation should require at least one recommendation and at least one lesson learned.
- The UI should label the two sections distinctly.
- The database should keep recommendations and lessons in separate ordered tables.
- Seed/sample data should demonstrate the difference clearly.

### Decision 017: Retain old PDF metadata when replacing files

Status: Accepted

Context: PDFs may need correction or replacement, but the MVP does not need full student-facing version history.

Decision: When a PDF is replaced, keep old file metadata for audit/history and mark the newest valid file as primary.

Consequences:

- The database should support primary/non-primary file metadata.
- Admins can trace replacements.
- Students only need access to the current primary file.
- Full downloadable version history is excluded from MVP.

### Decision 018: Use search, filters, and sort for MVP discovery

Status: Accepted

Context: Students need to locate relevant theses quickly using multiple discovery paths.

Decision: MVP discovery includes keyword search, filters, and sorting.

Consequences:

- Search should cover title, author names, tags, abstract keywords, and year.
- Filters should include research area, adviser, department, and year.
- Sorting controls should be present in repository/search views.
- Full-text ranking can be added later if basic search feels weak.

### Decision 019: Default repository sort is newest thesis year first

Status: Accepted

Context: Students often need recent thesis examples first, and year is a familiar academic signal.

Decision: Repository browsing defaults to newest thesis year first.

Consequences:

- Repository and search result queries need deterministic year-descending ordering.
- Secondary ordering, such as title or created date, may be used to break ties.
- Best-match ranking is not the default MVP browse behavior.

### Decision 020: Use controlled research areas and flexible tags

Status: Accepted

Context: The project needs clean filtering without making keyword tagging too rigid.

Decision: Research areas are controlled values. Tags remain flexible keywords.

Consequences:

- Research area values should be managed by admins or seed data.
- Tags can be added to capture specific technologies, domains, and methods.
- Related-thesis discovery can use both curated research areas and flexible tags.
- The admin UI should make research area selection more controlled than tag entry.
