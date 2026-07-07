# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Auth screens (login / register) in Expo mobile app
- JWT persistence via SecureStore + auth context
- JWT auth middleware guarding all protected API routes
- Dashboard and Profile feature implementations in API
- Connect mobile screens to live API data via React Query hooks
- Gemini + Groq provider adapters for AI coach
- Profile editor screens (education, experience, skills, projects, certs)
- Rate limiting with `express-rate-limit`
- PDF and DOCX resume export
- GitHub profile import via Octokit

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
  - 6 route modules: `auth`, `dashboard`, `profile`, `resume`, `jobs`, `ai`
  - Job description analyzer with keyword match scoring
  - Resume draft generator from user profile data
  - AI coach stub with `AIHistory` persistence
  - Health check endpoint (`GET /health`)
- **`apps/mobile`** — Expo SDK 51 + Expo Router app with:
  - Root layout: GestureHandler + QueryClientProvider + PaperProvider
  - 5 tab screens: Dashboard · Jobs · Resume · AI Coach · Profile
  - Premium dark design system (`AppTheme` tokens, glass morphism cards)
  - Reusable UI: `GlassCard`, `GradientButton`, `StatCard`, `SectionHeader`, `Screen`
  - Axios API client with `setAuthToken` helper
  - Auth, dashboard, and AI service layer files
  - `useDashboardSummary` React Query hook
  - Mock data isolated in `constants/mockData.ts`
- **`apps/api/prisma/schema.prisma`** — 17-model career graph with full cascade deletes and indexes
- **`docs/`** — Architecture, API, Development, and Roadmap documentation

[Unreleased]: https://github.com/YOUR_USERNAME/careeros-ai/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/YOUR_USERNAME/careeros-ai/releases/tag/v0.1.0
