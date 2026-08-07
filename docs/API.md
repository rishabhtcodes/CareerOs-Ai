# CareerOS AI — API Reference

Base URL: `http://localhost:4000`  
All product endpoints are mounted under `/api`.

---

## Authentication

CareerOS AI uses **JWT Bearer tokens** (valid for 7 days).

Include the token in all protected requests:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Auth

#### `POST /api/auth/signup`

Register a new account.

**Request body:**
```json
{
  "name": "Rishabh",
  "email": "rishabh@example.com",
  "password": "min8chars"
}
```

**Response `201`:**
```json
{
  "user": { "id": "...", "name": "Rishabh", "email": "rishabh@example.com" },
  "token": "<jwt>"
}
```

---

#### `POST /api/auth/login`

**Request body:**
```json
{ "email": "rishabh@example.com", "password": "yourpassword" }
```

**Response `200`:** same shape as signup.

---

### Dashboard

#### `GET /api/dashboard` 🔒

**Response `200`:**
```json
{
  "profileStrength": 72,
  "skills": 12,
  "projects": 4,
  "applications": 8,
  "recentResumes": [{ "id": "...", "title": "Frontend Resume", "atsScore": 84, "updatedAt": "..." }],
  "aiSuggestions": ["Add measurable outcomes to your top two projects.", "..."]
}
```

---

### Profile

#### `GET /api/profile` 🔒

Returns the authenticated user's full career profile including all sub-entities.

#### `PUT /api/profile` 🔒

**Request body (all fields optional):**
```json
{
  "headline": "Full Stack Engineer",
  "location": "Bengaluru, India",
  "bio": "...",
  "targetRole": "fullstack",
  "skills": ["React", "TypeScript", "Node.js"]
}
```

---

#### Experience

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile/experience` | Create experience entry |
| `PUT` | `/api/profile/experience/:id` | Update experience entry |
| `DELETE` | `/api/profile/experience/:id` | Delete experience entry |

**Experience body:**
```json
{
  "company": "Acme Corp",
  "role": "Frontend Engineer",
  "location": "Remote",
  "startDate": "2023-01-01T00:00:00Z",
  "endDate": null,
  "current": true,
  "description": "Built React dashboards...",
  "highlights": ["Reduced load time by 40%", "Led team of 3"]
}
```

---

#### Education

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile/education` | Create education entry |
| `PUT` | `/api/profile/education/:id` | Update education entry |
| `DELETE` | `/api/profile/education/:id` | Delete education entry |

**Education body:**
```json
{
  "school": "IIT Bombay",
  "degree": "B.Tech",
  "field": "Computer Science",
  "startDate": "2019-07-01T00:00:00Z",
  "endDate": "2023-05-01T00:00:00Z",
  "description": "..."
}
```

---

#### Projects

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile/projects` | Create project |
| `PUT` | `/api/profile/projects/:id` | Update project |
| `DELETE` | `/api/profile/projects/:id` | Delete project |

**Project body:**
```json
{
  "name": "CareerOS AI",
  "summary": "A career operating system...",
  "url": "https://careeros.dev",
  "repository": "https://github.com/user/careeros",
  "techStack": ["React Native", "Express", "Prisma"],
  "impact": "500+ users onboarded in first month"
}
```

---

#### Skills (bulk replace)

#### `PUT /api/profile/skills` 🔒

Replaces the entire skill list atomically.

```json
{
  "skills": [
    { "name": "TypeScript", "category": "Languages", "level": 5 },
    { "name": "React", "category": "Frameworks", "level": 4 }
  ]
}
```

---

#### Achievements

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/profile/achievements` | Add achievement |
| `PUT` | `/api/profile/achievements/:id` | Update achievement |
| `DELETE` | `/api/profile/achievements/:id` | Delete achievement |

---

#### Certificates

| Method | Endpoint |
|---|---|
| `POST` | `/api/profile/certificates` |
| `DELETE` | `/api/profile/certificates/:id` |

---

#### Social Links

| Method | Endpoint |
|---|---|
| `POST` | `/api/profile/social-links` |
| `DELETE` | `/api/profile/social-links/:id` |

---

### Resume

#### `GET /api/resume` 🔒

Returns all generated resumes (list, no content field for brevity).

#### `GET /api/resume/:id` 🔒

Returns full resume including AI-generated markdown content.

#### `POST /api/resume/generate` 🔒

Triggers Gemini 2.0 Flash resume generation from the user's complete profile.

**Request body:**
```json
{
  "type": "fullstack",
  "targetJobDescription": "Optional — paste job description to tailor the resume"
}
```

`type` values: `frontend` | `fullstack` | `python` | `ai` | `custom`

**Response `201`:**
```json
{
  "id": "...",
  "title": "Fullstack Resume",
  "type": "fullstack",
  "atsScore": 87,
  "content": "# Rishabh\nFull Stack Engineer...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Jobs

#### `GET /api/jobs` 🔒

Returns all job applications ordered by last updated.

#### `POST /api/jobs` 🔒

Create a job application.

```json
{
  "company": "Google",
  "role": "Software Engineer",
  "sourceUrl": "https://careers.google.com/...",
  "status": "SAVED",
  "notes": "Applied via LinkedIn",
  "appliedAt": "2026-08-01T00:00:00Z"
}
```

#### `PUT /api/jobs/:id` 🔒

Update status, notes, or match score.

```json
{ "status": "INTERVIEW", "notes": "Call scheduled for Monday" }
```

**Status pipeline:** `SAVED → APPLIED → SCREENING → INTERVIEW → OFFER → REJECTED`

#### `DELETE /api/jobs/:id` 🔒

Delete application.

#### `POST /api/jobs/analyze` 🔒

Analyze a job description against the user's profile using Gemini AI.

**Request body:**
```json
{
  "description": "We are looking for a React developer with TypeScript...",
  "sourceUrl": "https://example.com/jobs/123"
}
```

**Response `201`:**
```json
{
  "matchScore": 85,
  "extractedSkills": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["Docker", "Kubernetes"],
  "suggestions": [
    "Mirror the job title and top keywords in your resume headline.",
    "Add a Docker project to close the containerization skill gap."
  ]
}
```

---

### AI Coach

#### `POST /api/ai/coach` 🔒

Send a message to the AI career coach (Gemini 2.0 Flash → Groq Llama 3 → local fallback).

**Request body:**
```json
{ "message": "What projects should I build to get a fullstack role?" }
```

**Response `200`:**
```json
{
  "response": "Based on your profile...",
  "provider": "gemini"
}
```

#### `GET /api/ai/history` 🔒

Returns paginated conversation history.

Query params: `?limit=20` (default: 20, max: 50)

---

### GitHub

#### `GET /api/github` 🔒

Returns linked GitHub profile or `null`.

#### `POST /api/github/connect` 🔒

```json
{ "username": "rishabhtcodes" }
```

#### `DELETE /api/github/disconnect` 🔒

Unlinks GitHub. Returns `204 No Content`.

---

### Health

#### `GET /health`

No auth required.

```json
{ "ok": true, "service": "careeros-api" }
```

---

## Error Responses

| Status | Meaning |
|---|---|
| `400` | Bad request |
| `401` | Unauthorized — missing or invalid token |
| `404` | Resource not found |
| `409` | Conflict — e.g. email already registered |
| `422` | Validation error — Zod schema failed |
| `500` | Unexpected server error |

**Error body:**
```json
{
  "message": "Human-readable error description",
  "details": {}
}
```

**Zod validation error (`422`):**
```json
{
  "message": "Validation failed",
  "issues": {
    "fieldErrors": { "email": ["Invalid email"] },
    "formErrors": []
  }
}
```
