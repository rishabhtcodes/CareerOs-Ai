<div align="center">

<img src="assets/icon.png" width="120" height="120" alt="CareerOS AI Icon" />

<img src="https://img.shields.io/badge/version-0.2.0-8b5cf6?style=for-the-badge" alt="version" />
<img src="https://img.shields.io/badge/expo-SDK%2051-000020?style=for-the-badge&logo=expo" alt="expo" />
<img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=node.js" alt="node" />
<img src="https://img.shields.io/badge/typescript-5.5-3178c6?style=for-the-badge&logo=typescript" alt="typescript" />
<img src="https://img.shields.io/badge/prisma-5-2d3748?style=for-the-badge&logo=prisma" alt="prisma" />
<img src="https://img.shields.io/badge/gemini-2.0%20flash-4285f4?style=for-the-badge&logo=google" alt="gemini" />
<img src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge" alt="license" />

# CareerOS AI

**A premium mobile-first personal career operating system.**  
Maintain one master profile · Generate AI-targeted resumes · Analyze jobs · Track applications · Get AI career coaching.

</div>

---

## ✨ Features

| Feature | Status |
|---|---|
| 🧑‍💼 Master Career Profile (edit, experience, education, skills, projects, achievements) | ✅ Complete |
| 📄 AI Resume Generation — Gemini 2.0 Flash powered, ATS scored | ✅ Complete |
| 🔍 Job Description Analyzer — Gemini AI match scoring + skill gap | ✅ Complete |
| 📊 Application Tracker — full CRUD, status pipeline | ✅ Complete |
| 🤖 AI Career Coach — Gemini 2.0 Flash + Groq fallback, history | ✅ Complete |
| 🐙 GitHub Profile Import — repos, stars, languages, commits | ✅ Complete |
| 🔔 Notification & Reminder System | 📋 Planned |
| 📤 PDF / DOCX Resume Export | 📋 Planned |
| 🔗 LinkedIn Integration | 📋 Planned |

---

## 🏗️ Architecture

This is a **TypeScript monorepo** managed with npm workspaces.

```
careeros-ai/
├── apps/
│   ├── mobile/          # Expo Router · React Native · TanStack Query
│   └── api/             # Express 4 · Prisma 5 · SQLite/PostgreSQL · JWT
├── packages/
│   └── shared/          # Shared TypeScript types & contracts
└── docs/                # Architecture, API, Development, Roadmap
```

### Mobile (`apps/mobile`)
- **Expo SDK 51** with **Expo Router** (file-based navigation)
- **TanStack React Query v5** for server state
- **React Native Paper** (MD3 Dark) + custom design tokens
- **React Hook Form + Zod** for forms
- **Lucide React Native** icons
- **Reanimated 3** + **Gesture Handler** for animations

### API (`apps/api`)
- **Express 4** with Helmet · CORS · Morgan
- **Prisma 5** ORM → SQLite (dev) / PostgreSQL (prod)
- **JWT** auth with bcrypt password hashing
- **Zod** for request validation & env schema validation
- **Gemini 2.0 Flash** for AI resume generation, job analysis, career coach
- **Groq (Llama 3)** as AI fallback provider
- Feature-first layering: `routes → controllers → services`

### Shared (`packages/shared`)
- Common TypeScript interfaces (`CareerMetric`, `JobMatch`, `AiSuggestion`)
- Shared enums (`ApplicationStatus`, `ResumeType`, `CareerRole`)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 20**
- **SQLite** (zero-config, included) or **PostgreSQL** (for production)
- **Expo Go** app on your phone _or_ Android/iOS simulator

### 1. Clone & Install

```bash
git clone https://github.com/rishabhtcodes/CareerOs-Ai.git
cd careeros-ai
npm install
```

### 2. Configure Environment

```bash
# API
cp apps/api/.env.example apps/api/.env

# Mobile
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL=file:./dev.db               # SQLite (default, zero-config)
# DATABASE_URL=postgresql://user:pass@localhost:5432/careeros_ai  # for PostgreSQL
JWT_SECRET=your-long-random-secret-min-24-chars
GEMINI_API_KEY=                          # recommended — powers AI coach, resume gen, job analysis
GROQ_API_KEY=                            # optional — Llama 3 fallback
```

### 3. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate --schema apps/api/prisma/schema.prisma

# Run migrations (creates tables)
npm --workspace apps/api run prisma:migrate
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — API server (http://localhost:4000)
npm run dev:api

# Terminal 2 — Expo mobile app
npm run dev:mobile
```

Scan the QR code with **Expo Go** or press `a` (Android) / `i` (iOS).

### 5. Verify

```bash
# Health check
curl http://localhost:4000/health

# TypeScript check across all workspaces
npm run typecheck
```

---

## 📁 Project Structure

```
apps/api/src/
├── app.ts                  # Express factory (middlewares, routes)
├── server.ts               # Entrypoint — binds port
├── config/
│   ├── env.ts              # Zod-validated environment variables
│   └── prisma.ts           # Prisma client singleton
├── middleware/
│   ├── auth.ts             # JWT requireAuth middleware
│   └── errorHandler.ts     # ApiError class + global error middleware
├── routes/                 # Wire-only route files
│   ├── index.ts            # Mounts all routers under /api
│   ├── auth.routes.ts
│   ├── dashboard.routes.ts
│   ├── profile.routes.ts   # ← Full CRUD: experience/education/projects/skills/achievements
│   ├── resume.routes.ts
│   ├── jobs.routes.ts      # ← Full CRUD + AI job analysis
│   ├── ai.routes.ts        # ← Coach + history
│   └── github.routes.ts
└── features/               # Business logic, grouped by domain
    ├── auth/               # register · login · JWT
    ├── dashboard/          # career metrics summary
    ├── profile/            # full profile + 6 sub-entity CRUD operations
    ├── resume/             # AI resume generation (Gemini 2.0 Flash) + ATS scoring
    ├── jobs/               # applications CRUD + AI job analyzer
    ├── ai/                 # career coach (Gemini + Groq) + history
    └── github/             # GitHub profile import

apps/mobile/
├── app/
│   ├── _layout.tsx         # Root layout: QueryClient + Paper + Gestures + Auth guard
│   ├── auth/               # Login + Register screens
│   ├── profile/            # Sub-screens: edit · experience · education · skills · projects · achievements · github
│   └── (tabs)/             # File-based tab navigation
│       ├── index.tsx       # Dashboard
│       ├── jobs.tsx        # Jobs
│       ├── resume.tsx      # Resume
│       ├── coach.tsx       # AI Coach
│       └── profile.tsx     # Profile
└── src/
    ├── features/           # Screen components (one folder per domain)
    │   ├── dashboard/      # DashboardScreen
    │   ├── profile/        # ProfileScreen + GitHubScreen
    │   ├── resume/         # ResumeScreen
    │   ├── jobs/           # JobsScreen (tracker + AI analyzer)
    │   └── ai/             # CoachScreen (Gemini chat UI)
    ├── components/
    │   ├── layout/Screen   # Safe-area scrollable wrapper
    │   └── ui/             # GlassCard · GradientButton · StatCard · SectionHeader · Skeleton · EmptyState
    ├── services/api/       # Axios-based API service layer
    │   ├── client.ts       # Axios instance + auth token setter
    │   ├── auth.ts         # signup / login
    │   ├── dashboard.ts    # fetchDashboardSummary
    │   ├── profile.ts      # full profile + sub-entity CRUD
    │   ├── resume.ts       # list + generate
    │   ├── jobs.ts         # applications CRUD + analyzeJob
    │   ├── ai.ts           # sendCoachMessage
    │   └── github.ts       # connect / disconnect / fetch
    ├── hooks/              # React Query hooks per domain
    │   ├── useDashboardSummary.ts
    │   ├── useProfile.ts   # + useUpdateProfile
    │   ├── useResumes.ts   # + useGenerateResume
    │   ├── useCoach.ts
    │   └── useGitHub.ts    # + useConnectGitHub + useDisconnectGitHub
    ├── context/
    │   └── AuthContext.tsx  # JWT session with SecureStore persistence
    └── constants/
        ├── theme.ts        # Design tokens + Paper theme
        └── mockData.ts     # Dev-only mock data
```

---

## 🗄️ Database Schema

17 Prisma models forming a **career graph**:

`User` · `Education` · `Experience` · `Project` · `Skill` · `Certificate` · `Achievement` · `SocialLink` · `ResumeTemplate` · `GeneratedResume` · `Application` · `JobAnalysis` · `GithubProfile` · `Notification` · `Settings` · `AIHistory`

The default development database is **SQLite** (`apps/api/prisma/dev.db`) — zero setup required. Switch to PostgreSQL for production by updating `DATABASE_URL` and uncommenting the PostgreSQL datasource in `schema.prisma`.

See [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma) for the full schema.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register new account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/dashboard` | ✅ | Career summary metrics |
| `GET` | `/api/profile` | ✅ | Fetch full user profile |
| `PUT` | `/api/profile` | ✅ | Update headline/bio/location/targetRole |
| `POST` | `/api/profile/experience` | ✅ | Add experience entry |
| `PUT` | `/api/profile/experience/:id` | ✅ | Update experience entry |
| `DELETE` | `/api/profile/experience/:id` | ✅ | Delete experience entry |
| `POST` | `/api/profile/education` | ✅ | Add education entry |
| `PUT` | `/api/profile/education/:id` | ✅ | Update education entry |
| `DELETE` | `/api/profile/education/:id` | ✅ | Delete education entry |
| `POST` | `/api/profile/projects` | ✅ | Add project |
| `PUT` | `/api/profile/projects/:id` | ✅ | Update project |
| `DELETE` | `/api/profile/projects/:id` | ✅ | Delete project |
| `PUT` | `/api/profile/skills` | ✅ | Replace skills (bulk) |
| `POST` | `/api/profile/achievements` | ✅ | Add achievement |
| `PUT` | `/api/profile/achievements/:id` | ✅ | Update achievement |
| `DELETE` | `/api/profile/achievements/:id` | ✅ | Delete achievement |
| `POST` | `/api/profile/certificates` | ✅ | Add certificate |
| `DELETE` | `/api/profile/certificates/:id` | ✅ | Delete certificate |
| `POST` | `/api/profile/social-links` | ✅ | Add social link |
| `DELETE` | `/api/profile/social-links/:id` | ✅ | Delete social link |
| `GET` | `/api/resume` | ✅ | List generated resumes |
| `GET` | `/api/resume/:id` | ✅ | Fetch full resume content |
| `POST` | `/api/resume/generate` | ✅ | AI-generate a resume (Gemini 2.0 Flash) |
| `GET` | `/api/jobs` | ✅ | List job applications |
| `POST` | `/api/jobs` | ✅ | Create job application |
| `PUT` | `/api/jobs/:id` | ✅ | Update application status/notes |
| `DELETE` | `/api/jobs/:id` | ✅ | Delete application |
| `POST` | `/api/jobs/analyze` | ✅ | AI job description analysis |
| `POST` | `/api/ai/coach` | ✅ | Send message to AI coach |
| `GET` | `/api/ai/history` | ✅ | Fetch AI conversation history |
| `GET` | `/api/github` | ✅ | Fetch linked GitHub profile |
| `POST` | `/api/github/connect` | ✅ | Connect GitHub by username |
| `DELETE` | `/api/github/disconnect` | ✅ | Unlink GitHub profile |
| `GET` | `/health` | ❌ | Health check |

All protected routes require `Authorization: Bearer <token>` header.

See [`docs/API.md`](docs/API.md) for detailed request/response schemas.

---

## 🛠️ Development Scripts

| Command | Description |
|---|---|
| `npm run dev:api` | Start API in watch mode (`tsx watch`) |
| `npm run dev:mobile` | Start Expo dev server |
| `npm run typecheck` | Type-check all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format with Prettier |
| `npm --workspace apps/api run prisma:generate` | Regenerate Prisma client |
| `npm --workspace apps/api run prisma:migrate` | Run DB migrations |
| `npx prisma studio --schema apps/api/prisma/schema.prisma` | Open Prisma Studio GUI |

---

## 🗺️ Roadmap

- [x] **Phase 1** — Product foundation (mobile shell, API skeleton, Prisma schema, JWT auth)
- [x] **Phase 2** — Profile OS (editor, education, experience, skills, projects, achievements, GitHub import)
- [x] **Phase 3** — Resume Intelligence (Gemini AI generation, ATS scoring, resume detail view)
- [x] **Phase 4** — Job Intelligence (application CRUD, AI match scoring, missing skill detection)
- [x] **Phase 5** — AI Career Coach (Gemini 2.0 Flash + Groq adapters, conversation history, richer context)
- [ ] **Phase 6** — Growth (notifications, PDF/DOCX export, calendar sync, LinkedIn integration)

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the full roadmap.

---

## 🤝 Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `git commit -m "feat: add resume ATS scoring"`
4. Push and open a Pull Request

---

## 🔒 Security

If you discover a security vulnerability, please see [`SECURITY.md`](SECURITY.md) for responsible disclosure instructions. **Do not open a public issue.**

---

## 📄 License

MIT © 2026 CareerOS AI

See [`LICENSE`](LICENSE) for the full text.
