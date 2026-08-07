# CareerOS AI Architecture

## Product Shape

CareerOS AI is a TypeScript monorepo split into three layers:

- `apps/mobile` — Expo Router (SDK 51) mobile app with feature-first screens and reusable UI components.
- `apps/api` — Express 4 API with route → controller → service → persistence boundaries.
- `packages/shared` — Cross-platform TypeScript contracts (types, enums, interfaces).

---

## Frontend Architecture (`apps/mobile`)

### Screens
- Screens are owned by `src/features/<domain>/`.
- Each screen is a single focused file (e.g. `DashboardScreen.tsx`).
- Profile sub-screens live under `app/profile/` as Expo Router file-based routes.

### State Management
- **Server state** — TanStack React Query v5. Every API call has a corresponding hook in `src/hooks/`.
- **Auth state** — React Context (`AuthContext`) with JWT persisted to SecureStore.
- **UI/form state** — local `useState` / React Hook Form.

### API Layer
- All HTTP calls live in `src/services/api/` as typed async functions.
- `client.ts` exports a single Axios instance. Auth token is injected via `setAuthToken()`.

### Design System
- All colours, spacing, and border radii come from `src/constants/theme.ts` (`AppTheme`).
- No raw hex values in component files — always use `AppTheme.colors.*`.
- Glassmorphism via `GlassCard`, gradient CTAs via `GradientButton`.

---

## Backend Architecture (`apps/api`)

### Layering
```
HTTP Request
  → Route (wire only — no logic)
    → Controller (parse/validate request, shape response)
      → Service (business logic, Prisma calls)
        → Prisma (ORM → SQLite / PostgreSQL)
```

### Error handling
- All errors thrown as `ApiError(statusCode, message)`.
- `ZodError` returns `422 Validation failed` with field-level details.
- No `res.status(...).json(...)` inline in controllers — always `throw` or `next(error)`.

### AI Integration
- `features/ai/ai.service.ts` — provider chain: **Gemini 2.0 Flash → Groq Llama 3 → local fallback**
- `features/resume/resume.service.ts` — Gemini 2.0 Flash for resume generation; template fallback offline
- `features/jobs/jobs.service.ts` — Gemini for job analysis; keyword matching fallback

### Database
- **Development** — SQLite (`apps/api/prisma/dev.db`), zero-config.
- **Production** — PostgreSQL. Set `DATABASE_URL` to a Postgres connection string and uncomment the PostgreSQL datasource block in `schema.prisma`.
- Migration workflow: `npm --workspace apps/api run prisma:migrate`

### Auth
- JWT RS256 (HS256 with long secret). Tokens issued for 7 days.
- `requireAuth` middleware decodes token, injects `req.user.sub` (userId).

---

## Shared Package (`packages/shared`)

- Only TypeScript types, interfaces, and simple constants.
- No runtime logic — fully tree-shakeable.
- Every export must be consumed by at least one of the two apps.
- Key exports: `CareerMetric`, `JobMatch`, `AiSuggestion`, `ApplicationStatus`, `ResumeType`, `CareerRole`

---

## Data Flow: Resume Generation

```
User taps "Generate" (ResumeScreen)
  → POST /api/resume/generate { type, targetJobDescription }
    → resumeController.generateResume
      → resumeService.createResumeDraft(userId, input)
        → prisma: load full user profile (skills, experience, projects, education, achievements)
        → build rich Gemini prompt with profile data
        → callGemini(prompt) → markdown content
        → calculateAtsScore(content, jd, skills) → integer score
        → prisma: INSERT GeneratedResume { content, atsScore }
  → 201 { id, title, atsScore, content }
    → queryClient.invalidateQueries(["resumes"])
      → ResumeScreen re-renders with new resume card
```

---

## Next Engineering Milestones

1. **PDF / DOCX export** — use `puppeteer` (PDF) and `docx` npm package (Word); trigger from `GET /api/resume/:id/export?format=pdf`
2. **Notification system** — `POST /api/notifications` + `PUT /api/notifications/:id/read`; push via Expo Notifications
3. **Rate limiting** — `express-rate-limit` on auth endpoints (10 req/15 min)
4. **Job URL parser** — Cheerio/Playwright scraper behind `POST /api/jobs/parse-url`
5. **Token refresh** — sliding window JWT refresh for long sessions
