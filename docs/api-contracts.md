# Alexandria API Contracts

## 1. Overview

This document defines the data-fetching and API contracts for the Alexandria MVP. These contracts describe the boundary between the frontend application and the data layer.

> **Status:** DRAFT — Last updated: 2026-06-24

### Architecture Strategy

Alexandria is MVP-scoped with a 1-month delivery window. The following approach balances shipping speed with future scalability:

- **MVP:** All data access is handled through the **Supabase JS client** (`@supabase/supabase-js`) directly from the frontend. No custom REST server is built.
- **Abstraction:** All data calls are wrapped in a **service layer** (`/lib/services/`). UI components call `ThesisService.getAll()` — never `supabase.from(...)` directly. This is the key decoupling mechanism.
- **Scalability path:** When the project grows department- or university-wide, the service implementations can be swapped to point at a dedicated REST or GraphQL backend. Frontend components remain unchanged.

This document defines the **contracts** those service functions must fulfill.

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
{ data: null, error: { code: string, message: string } }
```

### 2.2 Authentication

- Authenticated operations require a valid Supabase Auth session.
- The Supabase client automatically attaches the JWT for RLS enforcement.
- System role (`admin`, `moderator`, `member`) is stored in `users.role` and enforced by Supabase RLS policies.
- USC identity (`student`, `alumni`, `professor`) is stored in `users.affiliation` — describes who they are at USC, not what they can do.

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
  | `department_id`    | uuid   | Filter by department                          |
  | `research_area_id` | uuid   | Filter by research area                       |
  | `adviser_id`       | uuid   | Filter by adviser                             |
  | `page`             | int    | Default `1`                                   |
  | `limit`            | int    | Default `20`                                  |

- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Thesis Title",
        "authors": [{ "profile_id": "uuid", "name": "Author One", "author_order": 1 }],
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

- **Auth Required:** No (metadata is public; `signed_url` for PDFs requires auth)

- **Response:**
  ```json
  {
    "data": {
      "id": "uuid",
      "title": "Thesis Title",
      "abstract": "Full abstract text...",
      "year": 2026,
      "authors": [
        { "profile_id": "uuid", "name": "Author One", "author_order": 1 },
        { "profile_id": "uuid", "name": "Dr. Smith" }
      ],
      "department": "DCISM",
      "research_area": "Web Development",
      "tags": ["#react", "#ai", "#progressive-web-apps"],
      "publication_date": "2025-05-14",
      "publication_link": "https://...",
      "recommendations": [
        { "id": "uuid", "header": "Mobile Adaptation", "recommendation": "Explore mobile adaptation.", "sort_order": 1 },
        { "id": "uuid", "header": "AI Extension", "recommendation": "Extend the recommendation engine with AI.", "sort_order": 2 }
      ],
      "lessons": [
        { "id": "uuid", "header": "Database Design", "lesson": "Start database design early.", "sort_order": 1 },
        { "id": "uuid", "header": "PDF Storage", "lesson": "Do not underestimate PDF storage configuration.", "sort_order": 2 }
      ],
      "files": [
        {
          "id": "uuid",
          "file_name": "thesis_final.pdf",
          "file_size_bytes": 4194304,
          "is_primary": true,
          "signed_url": "https://... (null for anonymous users)"
        }
      ],
      "links": [
        { "id": "uuid", "label": "GitHub Repository", "url": "https://github.com/..." }
      ],
      "related_theses": [
        { "id": "uuid", "title": "Related Thesis Title", "year": 2025, "authors": ["Author A"] }
      ]
    }
  }
  ```

> **Note on `signed_url`:** If the requesting user is authenticated, return a short-lived signed URL from Supabase Storage. If anonymous, return `null`. The frontend uses this to conditionally render the PDF preview/download controls.

> **Note on `related_theses`:** This field is populated by the frontend by matching overlapping tags from the current thesis against other accepted records. The backend returns the raw thesis data needed for this computation.

---

### `GET /filters` — Filter Options

Returns controlled vocabulary values for filter dropdowns.

- **Auth Required:** No
- **Response:**
  ```json
  {
    "data": {
      "research_areas": ["Machine Learning", "Web Development", "Information Systems"],
      "departments": [{ "id": "uuid", "name": "DCISM" }],
      "years": [2026, 2025, 2024]
    }
  }
  ```

> **Note:** `research_areas` is derived via `SELECT DISTINCT research_area FROM theses WHERE review_status = 'accepted'`.

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

### `GET /admin/theses` — Admin Thesis List

Returns all thesis records (any `review_status`) for the admin dashboard.

- **Auth Required:** Yes (Role: `admin`)
- **Parameters:** `page`, `limit`, `review_status` (`for_review` / `flagged` / `accepted`)
- **Response:** Paginated list with `id`, `title`, `review_status`, `year`, `updated_at`.

---

### `POST /upload/theses` — Create Thesis Record

Creates a new thesis record with `review_status = 'for_review'`.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:**
  ```json
  {
    "title": "Thesis Title",
    "abstract": "...",
    "year": 2026,
    "department": "DCISM",
    "research_area": "Machine Learning",
    "authors": [
      { "profile_id": "uuid", "author_order": 1 },
      { "profile_id": "uuid" }
    ],
    "tags": ["#react", "#machine-learning"],
    "publication_date": "2025-05-14",
    "publication_link": "https://...",
    "recommendations": [{ "header": "Future Work", "recommendation": "Rec bullet 1", "sort_order": 1 }],
    "lessons": [{ "header": "Dev Tip", "lesson": "Lesson bullet 1", "sort_order": 1 }]
  }
  ```
- **Response:** `201 Created` — returns the newly created thesis `id`.

---

### `PATCH /upload/theses/:id` — Update Thesis

Updates any field of a `for_review` or `flagged` thesis. Accepts partial payloads.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** Any subset of the POST body above.
- **Response:** `200 OK`

---

### `POST /upload/theses/:id/recommendations` — Add Recommendation

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "header": "Future Work", "recommendation": "New recommendation", "sort_order": 3 }`
- **Response:** `201 Created` — returns `{ "data": { "id": "uuid", "header": "...", "recommendation": "...", "sort_order": 3 } }`

---

### `PATCH /upload/theses/:id/recommendations/:rec_id` — Update Recommendation

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "header": "Updated Header", "recommendation": "Updated recommendation", "sort_order": 1 }`
- **Response:** `200 OK`

---

### `DELETE /upload/theses/:id/recommendations/:rec_id` — Remove Recommendation

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Response:** `204 No Content`

---

### `POST /upload/theses/:id/lessons` — Add Lesson

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "header": "Dev Tip", "lesson": "New lesson", "sort_order": 3 }`
- **Response:** `201 Created`

---

### `PATCH /upload/theses/:id/lessons/:lesson_id` — Update Lesson

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "header": "Updated Header", "lesson": "Updated lesson", "sort_order": 1 }`
- **Response:** `200 OK`

---

### `DELETE /upload/theses/:id/lessons/:lesson_id` — Remove Lesson

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Response:** `204 No Content`

---

### `POST /upload/theses/:id/files` — Register File URL

Called after the PDF has been placed on the school server. Stores the URL pointer in `thesis_files`.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
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
  - Title, at least one author, at least one adviser, year, department, research area, abstract, at least one tag, primary PDF, at least one recommendation, at least one lesson.
- **Response:** `200 OK`
- **Errors:** `400 Bad Request` with a list of missing fields if validation fails.

---

### `POST /moderator/theses/:id/flag` — Flag Thesis

Sets `review_status = 'flagged'`. Optionally records a reason in `thesis_audits`.

- **Auth Required:** Yes (Role: `admin` or `moderator`)
- **Request Body:** `{ "reason": "Missing adviser information." }` (optional)
- **Response:** `200 OK`

---

### `POST /admin/theses/:id/archive` — Archive Thesis

Moves a thesis to archived state. Hidden from all public browsing and search.

- **Auth Required:** Yes (Role: `admin`)
- **Response:** `200 OK`

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

## 7. Related Documents

- [Alexandria PRD](./Alexandria%20PRD.md)
- [Database Engineer Reference](./database-engineer-reference.md)
- [Design Decision Log](./design-decision-log.md)
