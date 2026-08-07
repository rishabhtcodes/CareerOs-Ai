# CareerOS AI Roadmap

## Phase 1: Product Foundation ✅

- [x] Premium Expo mobile shell with glassmorphism dark design
- [x] Dashboard, jobs, resume, AI coach, and profile tab screens
- [x] Express 4 API skeleton with Helmet, CORS, Morgan
- [x] Prisma 5 career graph schema (17 models, SQLite dev / PostgreSQL prod)
- [x] JWT authentication (register + login + bcrypt, 7-day tokens)
- [x] Reusable UI components: GlassCard, GradientButton, StatCard, SectionHeader, Skeleton, EmptyState
- [x] TanStack React Query hooks for server state
- [x] Auth context with SecureStore JWT persistence

---

## Phase 2: Profile Operating System ✅

- [x] Personal details editor (headline, bio, location, target role)
- [x] Experience entries — full CRUD with highlights list
- [x] Education entries — full CRUD with date ranges
- [x] Skills — bulk replace with category and level
- [x] Projects — full CRUD with tech stack, URL, repo, impact
- [x] Achievements — full CRUD
- [x] Certificates — add/delete
- [x] Social links — add/delete
- [x] GitHub profile import — repos, stars, languages, commits stats
- [x] Profile strength scoring (computed from filled sections)

---

## Phase 3: Resume Intelligence ✅

- [x] Gemini 2.0 Flash AI resume generation — role-tailored markdown
- [x] Rich prompt with full profile context (experience, projects, education, achievements)
- [x] Real ATS scoring — keyword density analysis against job description
- [x] Resume detail view (`GET /api/resume/:id`)
- [x] 5 resume types: frontend · fullstack · python · ai · custom
- [x] Graceful fallback to structured template when API key is absent
- [ ] PDF / DOCX export
- [ ] Resume version history and diff view

---

## Phase 4: Job Intelligence ✅

- [x] Application tracker — full CRUD (create, update status, delete)
- [x] Status pipeline: SAVED → APPLIED → SCREENING → INTERVIEW → OFFER → REJECTED
- [x] Gemini-powered job description analyzer — matched skills, missing skills, suggestions
- [x] Keyword fallback when Gemini is unavailable
- [x] Match score calculation
- [ ] Job URL parser (auto-extract description from a URL)
- [ ] Application reminders and follow-up nudges

---

## Phase 5: AI Career Coach ✅

- [x] Gemini 2.0 Flash adapter with richer profile context
- [x] Groq (Llama 3) adapter — automatic fallback
- [x] Local deterministic fallback (works fully offline)
- [x] Conversation history persisted to `AIHistory` table
- [x] `GET /api/ai/history` endpoint
- [x] Suggested prompts in chat welcome state
- [ ] Roadmap generation (structured weekly/monthly plans)
- [ ] Interview preparation mode
- [ ] Skill gap analysis with recommended learning resources

---

## Phase 6: Growth Features 📋

- [ ] In-app notification system (bell feed, mark read)
- [ ] Push notification scheduling for application follow-ups
- [ ] Google Calendar sync for interview reminders
- [ ] LinkedIn profile import
- [ ] PDF / DOCX resume export with template selection
- [ ] Resume sharing links (public/private)
- [ ] Recruiter dashboard view
- [ ] Team collaboration mode
