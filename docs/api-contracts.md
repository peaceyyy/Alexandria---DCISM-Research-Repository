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
- Roles (`admin`, `contributor`, `student_visitor`) are stored in `profiles.role` and enforced by Supabase RLS policies.

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

  | Param | Type | Description |
  |---|---|---|
  | `q` | string | Search query (title, authors, tags, abstract) |
  | `year` | int | Filter by thesis year |
  | `department_id` | uuid | Filter by department |
  | `research_area_id` | uuid | Filter by research area |
  | `adviser_id` | uuid | Filter by adviser |
  | `page` | int | Default `1` |
  | `limit` | int | Default `20` |

- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "title": "Thesis Title",
        "authors": ["Author One", "Author Two"],
        "year": 2026,
        "abstract_preview": "First 200 characters of abstract...",
        "tags": ["React", "AI"],
        "research_area": { "id": "uuid", "name": "Web Development" }
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
      "authors": ["Author One", "Author Two"],
      "adviser": { "id": "uuid", "full_name": "Dr. Smith" },
      "department": { "id": "uuid", "name": "Department of Computer Information Science and Mathematics", "code": "DCISM" },
      "research_area": { "id": "uuid", "name": "Web Development" },
      "tags": ["React", "AI", "Progressive Web Apps"],
      "recommendations": [
        { "id": "uuid", "content": "Explore mobile adaptation.", "sort_order": 1 },
        { "id": "uuid", "content": "Extend the recommendation engine with AI.", "sort_order": 2 }
      ],
      "lessons": [
        { "id": "uuid", "content": "Start database design early.", "sort_order": 1 },
        { "id": "uuid", "content": "Do not underestimate PDF storage configuration.", "sort_order": 2 }
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
      "awards": [
        { "id": "uuid", "title": "Best Thesis Award", "awarded_by": "DCISM", "year": 2026 }
      ],
      "related_theses": [
        { "id": "uuid", "title": "Related Thesis Title", "year": 2025, "authors": ["Author A"] }
      ]
    }
  }
  ```

> **Note on `signed_url`:** If the requesting user is authenticated, return a short-lived signed URL from Supabase Storage. If anonymous, return `null`. The frontend uses this to conditionally render the PDF preview/download controls.

---

### `GET /filters` — Filter Options

Returns controlled vocabulary values for filter dropdowns.

- **Auth Required:** No
- **Response:**
  ```json
  {
    "data": {
      "research_areas": [{ "id": "uuid", "name": "Web Development" }],
      "advisers": [{ "id": "uuid", "full_name": "Dr. Smith" }],
      "departments": [{ "id": "uuid", "name": "DCISM" }],
      "years": [2026, 2025, 2024]
    }
  }
  ```

---

## 4. Auth Endpoints

### `POST /auth/register`

Self-registration for student visitors. Restricted to `usc.edu.ph` email addresses.

- **Auth Required:** No
- **Request Body:**
  ```json
  { "email": "student@usc.edu.ph", "password": "...", "full_name": "Jane Doe" }
  ```
- **Response:** `201 Created`
- **Errors:** `400 Bad Request` if email domain is not `usc.edu.ph`.

### `POST /auth/login`

Returns a session for the user.

- **Auth Required:** No
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response:** `200 OK` with session data (handled by Supabase Auth SDK).

---

## 5. Admin / Protected Endpoints

These require an authenticated session. Role checks (`admin`, `contributor`) are enforced by RLS and service-layer guards.

---

### `GET /admin/theses` — Admin Thesis List

Returns all thesis records (draft, published, archived) for the admin dashboard.

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Parameters:** `page`, `limit`, `status` (`draft` / `published` / `archived`)
- **Response:** Paginated list with `id`, `title`, `status`, `year`, `updated_at`.

---

### `POST /admin/theses` — Create Draft Thesis

Creates a new thesis record in `draft` status.

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:**
  ```json
  {
    "title": "Thesis Title",
    "abstract": "...",
    "year": 2026,
    "department_id": "uuid",
    "adviser_id": "uuid",
    "research_area_id": "uuid",
    "authors": ["Author One", "Author Two"],
    "tags": ["uuid1", "uuid2"],
    "recommendations": [{ "content": "Rec bullet 1", "sort_order": 1 }],
    "lessons": [{ "content": "Lesson bullet 1", "sort_order": 1 }]
  }
  ```
- **Response:** `201 Created` — returns the newly created thesis `id`.

---

### `PATCH /admin/theses/:id` — Update Thesis

Updates any field of a draft or published thesis. Accepts partial payloads.

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:** Any subset of the POST body above.
- **Response:** `200 OK`

---

### `POST /admin/theses/:id/recommendations` — Add Recommendation

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:** `{ "content": "New recommendation", "sort_order": 3 }`
- **Response:** `201 Created` — returns `{ "data": { "id": "uuid", "content": "...", "sort_order": 3 } }`

---

### `PATCH /admin/theses/:id/recommendations/:rec_id` — Update Recommendation

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:** `{ "content": "Updated recommendation", "sort_order": 1 }`
- **Response:** `200 OK`

---

### `DELETE /admin/theses/:id/recommendations/:rec_id` — Remove Recommendation

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Response:** `204 No Content`

---

### `POST /admin/theses/:id/lessons` — Add Lesson

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:** `{ "content": "New lesson", "sort_order": 3 }`
- **Response:** `201 Created`

---

### `PATCH /admin/theses/:id/lessons/:lesson_id` — Update Lesson

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Request Body:** `{ "content": "Updated lesson", "sort_order": 1 }`
- **Response:** `200 OK`

---

### `DELETE /admin/theses/:id/lessons/:lesson_id` — Remove Lesson

- **Auth Required:** Yes (Role: `admin` or `contributor`)
- **Response:** `204 No Content`

---

### `POST /admin/theses/:id/files` — Register Uploaded File

Called **after** the client uploads a PDF directly to Supabase Storage. Stores the file pointer in `thesis_files`.

- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "file_name": "thesis_final.pdf",
    "bucket_name": "thesis-pdfs",
    "storage_key": "theses/uuid/thesis_final.pdf",
    "mime_type": "application/pdf",
    "file_size_bytes": 4194304
  }
  ```
- **Response:** `201 Created`

---

### `POST /admin/theses/:id/files/replace` — Replace Primary PDF

Replaces the current primary PDF. The old file metadata is **retained** for audit/history. The new file is marked `is_primary = true`.

- **Auth Required:** Yes (Role: `admin`)
- **Request Body:** Same as file upload.
- **Response:** `200 OK`

---

### `POST /admin/theses/:id/publish` — Publish Thesis

Validates that all required fields and at least one PDF are present, then transitions status from `draft` to `published`.

- **Auth Required:** Yes (Role: `admin`)
- **Required fields checked before publish:**
  - Title, authors, year, adviser, department, research area, abstract, tags, primary PDF, at least one recommendation, at least one lesson.
- **Response:** `200 OK`
- **Errors:** `400 Bad Request` with a list of missing fields if validation fails.

---

### `POST /admin/theses/:id/archive` — Archive Thesis

Moves a thesis to `archived` status. Hidden from all public browsing and search.

- **Auth Required:** Yes (Role: `admin`)
- **Response:** `200 OK`

---

### `DELETE /admin/theses/:id` — Soft Delete

Sets `deleted_at`. Not exposed in the normal admin UI. Internal recovery/audit path only.

- **Auth Required:** Yes (Role: `admin` only)
- **Response:** `204 No Content`

---

## 6. HTTP Status Code Reference

| Code | Meaning | Used When |
|---|---|---|
| `200` | OK | Successful GET, PATCH, action endpoint |
| `201` | Created | Successful POST that creates a record |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation failure (e.g., publish missing fields) |
| `401` | Unauthorized | No valid session token |
| `403` | Forbidden | Valid session but insufficient role |
| `404` | Not Found | Record does not exist |
| `500` | Internal Server Error | Unexpected backend failure |

---

## 7. Related Documents

- [Alexandria PRD](./Alexandria%20PRD.md)
- [Database Engineer Reference](./database-engineer-reference.md)
- [Design Decision Log](./design-decision-log.md)
