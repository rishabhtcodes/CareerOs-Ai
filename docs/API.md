# API Reference

Base URL: `http://localhost:4000`  
All product endpoints are mounted under `/api`.

---

## Authentication

CareerOS AI uses **JWT Bearer tokens**.

Include the token in all protected requests:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for **7 days**. Token refresh is on the roadmap.

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

Login and receive a JWT.

**Request body:**
```json
{
  "email": "rishabh@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "user": { "id": "...", "name": "Rishabh", "email": "rishabh@example.com" },
  "token": "<jwt>"
}
```

---

### Dashboard

#### `GET /api/dashboard` 🔒

Returns career summary metrics for the authenticated user.

**Response `200`:**
```json
{
  "profileCompletion": 86,
  "resumeCount": 3,
  "applicationCount": 23,
  "skillCount": 47
}
```

---

### Profile

#### `GET /api/profile` 🔒

Returns the authenticated user's full career profile.

#### `PUT /api/profile` 🔒

Updates profile fields.

**Request body (all fields optional):**
```json
{
  "headline": "Full Stack Engineer",
  "location": "Bengaluru, India",
  "bio": "...",
  "targetRole": "fullstack"
}
```

---

### Resume

#### `GET /api/resume` 🔒

Returns all generated resumes for the authenticated user.

#### `POST /api/resume/generate` 🔒

Generates a resume draft from the user's profile.

**Request body:**
```json
{
  "type": "fullstack",
  "targetJobDescription": "Optional job description text for tailoring"
}
```

**`type` values:** `frontend` | `fullstack` | `python` | `ai` | `custom`

---

### Jobs

#### `GET /api/jobs` 🔒

Returns all job applications for the authenticated user.

#### `POST /api/jobs/analyze` 🔒

Analyzes a job description against the user's skill profile.

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
  "extractedSkills": ["React", "TypeScript"],
  "missingSkills": ["System design", "Testing"],
  "suggestions": [
    "Mirror the job title and top keywords in your resume headline.",
    "Add project bullets that show business impact and technical ownership."
  ]
}
```

---

### AI Coach

#### `POST /api/ai/coach` 🔒

Send a message to the AI career coach. Currently uses a local deterministic fallback. Gemini and Groq adapters are in progress.

**Request body:**
```json
{
  "message": "What projects should I build to get a fullstack role?"
}
```

**Response `200`:**
```json
{
  "response": "Based on your current profile, focus on fullstack positioning..."
}
```

---

### Health

#### `GET /health`

No auth required.

**Response `200`:**
```json
{ "ok": true, "service": "careeros-api" }
```

---

## Error Responses

| Status | Meaning |
|---|---|
| `400` | Bad request |
| `401` | Unauthorized — missing or invalid token |
| `409` | Conflict — e.g. email already registered |
| `422` | Validation error — Zod schema failed |
| `500` | Unexpected server error |

**Error body format:**
```json
{
  "message": "Human-readable error description",
  "details": {}
}
```

**Zod validation error format (`422`):**
```json
{
  "message": "Validation failed",
  "issues": {
    "fieldErrors": { "email": ["Invalid email"] },
    "formErrors": []
  }
}
```
