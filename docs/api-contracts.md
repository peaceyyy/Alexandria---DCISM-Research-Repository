# Alexandria API Contracts

## 1. Overview

This document defines the data-fetching and API contracts for the Alexandria MVP. These contracts describe the boundary between the frontend application and the data layer.

> **Status:** DRAFT — Last updated: 2026-06-26

### Architecture Strategy

Alexandria is MVP-scoped with a 1-month delivery window. The following approach balances shipping speed with future scalability:

- **MVP:** All data access is handled through the **Supabase JS client** (`@supabase/supabase-js`) directly from the frontend. No custom REST server is built.
- **Abstraction:** All data calls are wrapped in a **service layer** (`/lib/services/`). UI components call `ThesisService.getAll()` — never `supabase.from(...)` directly. This is the key decoupling mechanism.
- **Scalability path:** When the project grows department- or university-wide, the service implementations can be swapped to point at a dedicated REST or GraphQL backend. Frontend components remain unchanged.

This document defines the **contracts** those service functions must fulfill.

> **Implementation note:** The endpoint names below describe service intent and future backend route shape. For the MVP, frontend pages should call service functions, not fetch these route strings directly unless a route is explicitly implemented.

---

## 2. API Patterns & Conventions

### 2.1 Response Format

All service calls resolve to a consistent shape.

**Success:**

```ts
{ data: T, error: null, meta?: { total_count: number, page: number, limit: number } }
```

**Error:**

```ts
{ data: null, error: { code: string, message: string, details?: Record<string, unknown> } }
```

### 2.2 Authentication

- Authenticated operations require a valid Supabase Auth session.
- The Supabase client automatically attaches the JWT for RLS enforcement.
- System role (`admin`, `moderator`, `member`) is stored in `users.role` and enforced by Supabase RLS policies.
- USC identity (`student`, `alumni`, `professor`) is stored in `users.affiliation` — describes who they are at USC, not what they can do.
- Any authenticated `member` can submit a thesis for review.
- Only `admin` and `moderator` users can approve/accept, flag, or trash a submission.
- Members can edit their own submission only after a moderator/admin flags it.
- Members can attach/register their own thesis PDF or file URL.
- The database value `accepted` may be displayed as `Approved` in the UI.

### 2.3 Pagination

Offset-based using `page` and `limit`.

- Default `page`: `1`
- Default `limit`: `20`

### 2.4 Sort Order

Default sort for public repository browsing: **newest thesis year first** (`year DESC`).

---

## 3. Public / Discovery Endpoints

These are accessible without authentication. Full published thesis metadata is public.

---

### `GET /theses` — List Theses (Browse & Search)

Returns paginated thesis cards for repository browsing and keyword search.

- **Auth Required:** No
- **Query Parameters:**

  | Param              | Type   | Description                                   |
  | ------------------ | ------ | --------------------------------------------- |
  | `q`                | string | Search query (title, authors, tags, abstract) |
  | `year`             | int    | Filter by thesis year                         |
  | `department`       | string | Filter by department name (e.g. `DCISM`)      |
  | `research_area`    | string | Filter by research area                       |
  | `page`             | int    | Default `1`                                   |
  | `limit`            | int    | Default `20`                                  |

- **Response:**
  ```json
  {
    "data": [
      {
        "id": 1,
        "title": "Thesis Title",
        "authors": [{ "id": 1, "user_id": "uuid-or-null", "display_name": "Author One", "sort_order": 1 }],
        "year": 2026,
        "abstract_preview": "First 200 characters of abstract...",
        "tags": ["#react", "#ai"],
        "research_area": "Web Development"
      }
    ],
    "meta": { "total_count": 84, "page": 1, "limit": 20 }
  }
  ```

---

### `GET /theses/:id` — Thesis Detail

Returns the full detail payload for a single published thesis.

- **Auth Required:** No. Metadata is public; PDF file access requires auth through `download_path`.

- **Response:**
  ```json
  {
    "data": {
      "id": 1,
      "title": "Thesis Title",
      "abstract": "Full abstract text...",
      "year": 2026,
      "authors": [
        { "id": 1, "user_id": "uuid-or-null", "display_name": "Author One", "sort_order": 1 }
      ],
      "advisers": [
        { "id": 2, "user_id": "uuid-or-null", "display_name": "Dr. Smith", "sort_order": 1 }
      ],
      "department": "DCISM",
      "research_area": "Web Development",
      "tags": ["#react", "#ai", "#progressive-web-apps"],
      "publication_date": "2025-05-14",
      "publication_link": "https://...",
      "recommendations": "Explore mobile adaptation. Extend the recommendation engine with AI.",
      "lessons_learned": "Start database design early. Do not underestimate PDF storage configuration.",
      "file_access": {
        "has_primary_file": true,
        "requires_auth": true,
        "download_path": "/theses/1/file"
      },
      "related_theses": [
        { "id": 2, "title": "Related Thesis Title", "year": 2025, "authors": ["Author A"] }
      ]
    }
  }
  ```

> **Note on PDF access:** The `file_url` stored in the database is never returned directly. The backend proxies requests via `GET /theses/:id/file`, verifying the JWT before streaming the PDF from the school server.

> **Note on `related_theses`:** Populated by the frontend by matching overlapping tags from the current thesis against other accepted records. The backend returns the raw thesis data needed for this computation.

---

### `GET /filters` — Filter Options

Returns controlled vocabulary values for filter dropdowns.

- **Auth Required:** No
- **Response:**
  ```json
  {
    "data": {
      "research_areas": ["Machine Learning", "Web Development", "Information Systems"],
      "departments": ["DCISM", "CAS", "TC"],
      "years": [2026, 2025, 2024]
    }
  }
  ```

> **Note:** `research_areas` and `departments` are derived via `SELECT DISTINCT research_area FROM theses WHERE review_status = 'accepted'` and `SELECT DISTINCT department...` respectively.

---

## 4. Auth Endpoints

### `POST /auth/register`

Self-registration for members. Restricted to `usc.edu.ph` email addresses. Creates a Supabase Auth user; the `on_auth_user_created` trigger automatically inserts the `users` row.

- **Auth Required:** No
- **Request Body:**
  ```json
  { "email": "user@usc.edu.ph", "password": "...", "profile_name": "Jane Doe", "usc_id": 12345678, "affiliation": "student" }
  ```
- **Response:** `201 Created`
- **Errors:** `400 Bad Request` if email domain is not `usc.edu.ph` or `affiliation` is not one of `student`, `alumni`, `professor`.

### `POST /auth/login`

Returns a session for the user.

- **Auth Required:** No
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response:** `200 OK` with session data (handled by Supabase Auth SDK).

---

## 5. Protected Endpoints

These require an authenticated session. Role checks are enforced by RLS and service-layer guards.

---

### `GET /admin/theses` — Review Thesis List

Returns thesis records for the review/admin dashboard.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Parameters:** `page`, `limit`, `review_status` (`for_review` / `flagged` / `accepted` / `trashed` if added)
- **Response:** Paginated list with `id`, `title`, `review_status`, `year`, `updated_at`.

---

### `POST /upload/theses` — Submit Thesis Record

Creates a new thesis record with `review_status = 'for_review'`.

- **Auth Required:** Yes (Role: `member`, `admin`, or `moderator`)
- **Ownership:** The service must store the submitting user's id on the thesis record once the database has a submission owner field.
- **Request Body:**
  ```json
  {
    "title": "Thesis Title",
    "abstract": "...",
    "year": 2026,
    "department": "DCISM",
    "research_area": "Machine Learning",
    "authors": [
      { "user_id": "uuid-or-null", "display_name": "Author One", "sort_order": 1 },
      { "user_id": null, "display_name": "Author Two", "sort_order": 2 }
    ],
    "advisers": [
      { "user_id": "uuid-or-null", "display_name": "Dr. Adviser", "sort_order": 1 }
    ],
    "tags": ["#react", "#machine-learning"],
    "publication_date": "2025-05-14",
    "publication_link": "https://...",
    "recommendations": "Explore mobile adaptation. Extend the recommendation engine with AI.",
    "lessons_learned": "Start database design early. Do not underestimate PDF storage configuration."
  }
  ```

> **Author/adviser storage:** Both `authors` and `advisers` are stored in `thesis_authors`. Use `contribution_role = 'author'` or `contribution_role = 'adviser'` to separate them.
- **Response:** `201 Created` — returns the newly created thesis `id`.

---

### `PATCH /upload/theses/:id` — Update Thesis

Updates any field of a `for_review` or `flagged` thesis. Accepts partial payloads.

- **Auth Required:** Yes. `admin` and `moderator` can update review records. `member` can update their own submission only after it is `flagged`.
- **Request Body:** Any subset of the POST body above.
- **Response:** `200 OK`

---

### `POST /upload/theses/:id/files` — Register File URL

Called after the PDF has been placed on the school server. Stores the URL pointer in `thesis_files`.

- **Auth Required:** Yes. `member` may register a file for their own submission. `admin` and `moderator` may register a file for reviewable submissions.
- **Request Body:**
  ```json
  {
    "file_url": "https://dcism.usc.edu.ph/repository/thesis_final.pdf",
    "is_primary": true
  }
  ```
- **Response:** `201 Created`

---

### `POST /upload/theses/:id/files/replace` — Replace Primary PDF

Adds a new file URL row and marks it as primary. The old row is retained for history.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** Same as file registration above.
- **Response:** `200 OK`

---

### `POST /moderator/theses/:id/accept` — Accept Thesis

Validates that all required fields and at least one PDF are present, then sets `review_status = 'accepted'`. Logs action to `thesis_audits`.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Required fields checked before acceptance:**
  - Title, at least one author, at least one adviser, year, department, research area, abstract, at least one tag, primary PDF, recommendations, lessons_learned.
- **Response:** `200 OK`
- **Errors:** `400 Bad Request` with a list of missing fields if validation fails.

**Validation error shape:**

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Thesis is missing required fields.",
    "details": {
      "missing_fields": ["adviser", "primary_file", "recommendations"]
    }
  }
}
```

---

### `POST /moderator/theses/:id/flag` — Flag Thesis

Sets `review_status = 'flagged'`. Optionally records a reason in `thesis_audits`.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "reason": "Missing adviser information." }` (optional)
- **Response:** `200 OK`

---

### `POST /admin/theses/:id/trash` — Trash Thesis

Moves a thesis to trashed state. Hidden from all public browsing, search, and active review lists unless explicitly included.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Response:** `200 OK`

> **Note:** Trashed submissions are not recoverable through the admin UI for MVP.

---

### `DELETE /admin/theses/:id` — Soft Delete

Sets `deleted_at`. Not exposed in the normal admin UI. Internal recovery/audit path only.

- **Auth Required:** Yes (Role: `admin` only)
- **Response:** `204 No Content`

---

### `GET /admin/users` — User List

Returns a paginated list of all users with their role and affiliation. Used by the admin users management view.

- **Auth Required:** Yes (Role: `admin`)
- **Parameters:** `page`, `limit`, `role` (`admin` / `moderator` / `member`)
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "email": "jane@usc.edu.ph",
        "profile_name": "Jane Doe",
        "usc_id": 12345678,
        "role": "member",
        "affiliation": "student"
      }
    ],
    "meta": { "total_count": 42, "page": 1, "limit": 20 }
  }
  ```

---

### `PATCH /admin/users/:id/role` — Update User Role

Updates a user's system role in `users.role`. Used by the admin role access management view.

- **Auth Required:** Yes (Role: `admin`)
- **Request Body:** `{ "role": "moderator" }`
- **Response:** `200 OK`
- **Errors:** `400 Bad Request` if `role` is not one of `admin`, `moderator`, `member`.

---

## 6. HTTP Status Code Reference

| Code  | Meaning               | Used When                                         |
| ----- | --------------------- | ------------------------------------------------- |
| `200` | OK                    | Successful GET, PATCH, action endpoint            |
| `201` | Created               | Successful POST that creates a record             |
| `204` | No Content            | Successful DELETE                                 |
| `400` | Bad Request           | Validation failure (e.g., publish missing fields) |
| `401` | Unauthorized          | No valid session token                            |
| `403` | Forbidden             | Valid session but insufficient role               |
| `404` | Not Found             | Record does not exist                             |
| `500` | Internal Server Error | Unexpected backend failure                        |

---

## 7. Frontend DTOs To Implement First

These DTOs should exist in `frontend/lib/services/types.ts` before pages start wiring real data.

```ts
export type ReviewStatus = "for_review" | "flagged" | "accepted" | "trashed";
export type UserRole = "admin" | "moderator" | "member";
export type Affiliation = "student" | "alumni" | "professor";
export type ContributionRole = "author" | "adviser";

export type ThesisPerson = {
  id: number;
  user_id: string | null;
  display_name: string;
  contribution_role: ContributionRole;
  sort_order: number | null;
};

export type ThesisCard = {
  id: number;
  title: string;
  authors: ThesisPerson[];
  year: number;
  abstract_preview: string;
  tags: string[];
  research_area: string | null;
};

export type ThesisDetail = ThesisCard & {
  abstract: string;
  advisers: ThesisPerson[];
  department: string;
  publication_date: string | null;
  publication_link: string | null;
  recommendations: string | null;
  lessons_learned: string | null;
  file_access: {
    has_primary_file: boolean;
    requires_auth: boolean;
    download_path: string | null;
  };
  related_theses: ThesisCard[];
};
```

## 8. Remaining Contract Polish Before Frontend Wiring

- Add a thesis ownership column, recommended `submitted_by_user_id uuid REFERENCES public.users(id)`, so member-only edit/file rules can be enforced.
- Decide whether `GET /theses/:id/file` streams the PDF or redirects after auth. The frontend only needs `download_path`.
- Keep all public thesis reads filtered to `review_status = 'accepted'`.
- Keep trashed records out of normal admin/review lists unless a future audit view is added.
- Standardize frontend status labels: `accepted` displays as `Approved`.

---

## 9. Related Documents

- [Alexandria PRD](./Alexandria%20PRD.md)
- [Database Engineer Reference](./database-engineer-reference.md)
- [Design Decision Log](./design-decision-log.md)
