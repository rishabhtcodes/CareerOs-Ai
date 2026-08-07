# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- PDF and DOCX resume export
- Notification scheduling + in-app bell feed
- Calendar sync (Google Calendar)
- LinkedIn profile integration
- Rate limiting with `express-rate-limit`
- Resume version history / diff view
- Email verification flow

---

## [0.2.0] — 2026-08-07

### Added — Phase 2: Profile OS
- **Profile sub-screens** — full editor screens for experience, education, skills, projects, and achievements (all linked from the profile navigation list)
- **Profile API — full CRUD** for all sub-entities:
  - `POST/PUT/DELETE /api/profile/experience`
  - `POST/PUT/DELETE /api/profile/education`
  - `POST/PUT/DELETE /api/profile/projects`
  - `PUT /api/profile/skills` (bulk replace)
  - `POST/PUT/DELETE /api/profile/achievements`
  - `POST/DELETE /api/profile/certificates`
  - `POST/DELETE /api/profile/social-links`
- **GitHub Profile Import** — connect by username, fetch repos, stars, languages, commits; disconnect; view stats with progress bars

### Added — Phase 3: Resume Intelligence
- **Gemini 2.0 Flash resume generation** — builds rich, role-tailored markdown resumes from the full user profile (skills, experience, projects, education, achievements)
- **Real ATS scoring** — keyword density analysis against job description and profile skills (replaces the hardcoded 78 stub)
- **`GET /api/resume/:id`** — fetch full AI-generated resume content for detail view
- Graceful fallback to structured template when `GEMINI_API_KEY` is absent

### Added — Phase 4: Job Intelligence
- **Application CRUD** — `POST /api/jobs`, `PUT /api/jobs/:id`, `DELETE /api/jobs/:id`
- **Gemini-powered job analysis** — extracts matched skills, missing skills, and actionable suggestions from job description text; falls back to keyword matching when Gemini is unavailable
- Application status pipeline: `SAVED → APPLIED → SCREENING → INTERVIEW → OFFER → REJECTED`

### Added — Phase 5: AI Career Coach
- **Gemini 2.0 Flash coach** — upgraded model, richer profile context (education, certificates, active applications included in prompt)
- **Groq (Llama 3) adapter** — automatic fallback provider when Gemini is unavailable
- **`GET /api/ai/history`** — paginated conversation history endpoint
- Structured local fallback when both AI providers are offline
- `provider` field returned in coach response so clients can indicate which model answered

### Changed
- `apps/api/prisma/schema.prisma` datasource — SQLite as zero-config default in development; PostgreSQL path documented for production
- `.gitignore` — added SQLite db files, Expo `android/`/`ios/` EAS build outputs, agent workspace dirs
- `README.md` — full rewrite reflecting v0.2.0 feature set, expanded API reference table (34 endpoints), updated roadmap status

### Fixed
- `ai.routes.ts` — export name mismatch (`coachHandler` → `coach`) that would cause a startup crash
- `profile.controller.ts` — `highlights` and `techStack` JSON fields now correctly parsed in all response paths

---

## [0.1.0] — 2026-07-07

### Added
- **Monorepo** setup with npm workspaces (`apps/mobile`, `apps/api`, `packages/shared`)
- **`packages/shared`** — cross-platform TypeScript contracts: `CareerMetric`, `JobMatch`, `AiSuggestion`, `CareerRole`, `ApplicationStatus`, `ResumeType`
- **`apps/api`** — Express 4 server with:
  - Zod-validated environment schema (`config/env.ts`)
  - Prisma 5 singleton (`config/prisma.ts`)
  - Global error handler with `ApiError` class and Zod error support
  - JWT authentication service (register + login + bcrypt hashing)
  - 7 route modules: `auth`, `dashboard`, `profile`, `resume`, `jobs`, `ai`, `github`
  - Job description analyzer with keyword match scoring
  - Resume draft generator from user profile data
  - AI coach stub with `AIHistory` persistence
  - Health check endpoint (`GET /health`)
- **`apps/mobile`** — Expo SDK 51 + Expo Router app with:
  - Root layout: GestureHandler + QueryClientProvider + PaperProvider + Auth guard
  - 5 tab screens: Dashboard · Jobs · Resume · AI Coach · Profile
  - Premium dark design system (`AppTheme` tokens, glassmorphism cards)
  - Reusable UI: `GlassCard`, `GradientButton`, `StatCard`, `SectionHeader`, `Screen`, `Skeleton`, `EmptyState`
  - Axios API client with `setAuthToken` helper
  - Auth context with JWT SecureStore persistence
  - React Query hooks: `useDashboardSummary`, `useProfile`, `useResumes`, `useCoach`, `useGitHub`
- **`apps/api/prisma/schema.prisma`** — 17-model career graph with full cascade deletes and indexes
- **`docs/`** — Architecture, API, Development, and Roadmap documentation

[Unreleased]: https://github.com/rishabhtcodes/CareerOs-Ai/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/rishabhtcodes/CareerOs-Ai/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/rishabhtcodes/CareerOs-Ai/releases/tag/v0.1.0
