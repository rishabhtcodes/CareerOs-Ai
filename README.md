<div align="center">

<img src="assets/icon.png" width="120" height="120" alt="CareerOS AI Icon" />

<img src="https://img.shields.io/badge/version-0.1.0-8b5cf6?style=for-the-badge" alt="version" />
<img src="https://img.shields.io/badge/expo-SDK%2051-000020?style=for-the-badge&logo=expo" alt="expo" />
<img src="https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=node.js" alt="node" />
<img src="https://img.shields.io/badge/typescript-5.5-3178c6?style=for-the-badge&logo=typescript" alt="typescript" />
<img src="https://img.shields.io/badge/prisma-5-2d3748?style=for-the-badge&logo=prisma" alt="prisma" />
<img src="https://img.shields.io/badge/license-MIT-34d399?style=for-the-badge" alt="license" />

# CareerOS AI

**A premium mobile-first personal career operating system.**  
Maintain one master profile · Generate AI-targeted resumes · Analyze jobs · Track applications · Get AI career coaching.

</div>

---

## ✨ Features

| Feature | Status |
|---|---|
| 🧑‍💼 Master Career Profile | 🏗️ In Progress |
| 📄 AI Resume Generation (frontend / fullstack / AI / custom) | 🏗️ In Progress |
| 🔍 Job Description Analyzer + Match Scoring | 🏗️ In Progress |
| 📊 Application Tracker | 🏗️ In Progress |
| 🤖 AI Career Coach (Gemini / Groq) | 🏗️ In Progress |
| 🐙 GitHub Profile Import | 📋 Planned |
| 🔔 Notification & Reminder System | 📋 Planned |

---

## 🏗️ Architecture

This is a **TypeScript monorepo** managed with npm workspaces.

```
careeros-ai/
├── apps/
│   ├── mobile/          # Expo Router · React Native · TanStack Query
│   └── api/             # Express 4 · Prisma 5 · PostgreSQL · JWT
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
- **Prisma 5** ORM → PostgreSQL
- **JWT** auth with bcrypt password hashing
- **Zod** for request validation & env schema validation
- Feature-first layering: `routes → controllers → services`

### Shared (`packages/shared`)
- Common TypeScript interfaces (`CareerMetric`, `JobMatch`, `AiSuggestion`)
- Shared enums (`ApplicationStatus`, `ResumeType`, `CareerRole`)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 20**
- **PostgreSQL** (local or hosted, e.g. Supabase, Railway, Neon)
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
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/careeros_ai
JWT_SECRET=your-long-random-secret-min-24-chars
GEMINI_API_KEY=          # optional — for AI coach
GROQ_API_KEY=            # optional — alternative AI provider
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
│   └── errorHandler.ts     # ApiError class + global error middleware
├── routes/                 # Wire-only route files
│   ├── index.ts            # Mounts all routers under /api
│   ├── auth.routes.ts
│   ├── dashboard.routes.ts
│   ├── profile.routes.ts
│   ├── resume.routes.ts
│   ├── jobs.routes.ts
│   └── ai.routes.ts
└── features/               # Business logic, grouped by domain
    ├── auth/               # register · login · JWT
    ├── jobs/               # applications · job analysis
    ├── resume/             # resume draft generation
    └── ai/                 # career coach + AI history

apps/mobile/
├── app/
│   ├── _layout.tsx         # Root layout: QueryClient + Paper + Gestures
│   └── (tabs)/             # File-based tab navigation
│       ├── index.tsx       # Dashboard
│       ├── jobs.tsx        # Jobs
│       ├── resume.tsx      # Resume
│       ├── coach.tsx       # AI Coach
│       └── profile.tsx     # Profile
└── src/
    ├── features/           # Screen components (one folder per domain)
    ├── components/
    │   ├── layout/Screen   # Safe-area scrollable wrapper
    │   └── ui/             # GlassCard · GradientButton · StatCard · SectionHeader
    ├── services/api/       # Axios-based API service layer
    ├── hooks/              # React Query hooks
    └── constants/
        ├── theme.ts        # Design tokens + Paper theme
        └── mockData.ts     # Dev-only mock data (swap with hooks)
```

---

## 🗄️ Database Schema

17 Prisma models forming a **career graph**:

`User` · `Education` · `Experience` · `Project` · `Skill` · `Certificate` · `Achievement` · `SocialLink` · `ResumeTemplate` · `GeneratedResume` · `Application` · `JobAnalysis` · `GithubProfile` · `Notification` · `Settings` · `AIHistory`

See [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma) for the full schema.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ❌ | Register new account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/dashboard` | ✅ | Career summary metrics |
| `GET` | `/api/profile` | ✅ | Fetch user profile |
| `PUT` | `/api/profile` | ✅ | Update user profile |
| `GET` | `/api/resume` | ✅ | List generated resumes |
| `POST` | `/api/resume/generate` | ✅ | Generate a resume draft |
| `GET` | `/api/jobs` | ✅ | List job applications |
| `POST` | `/api/jobs/analyze` | ✅ | Analyze job description |
| `POST` | `/api/ai/coach` | ✅ | Send message to AI coach |
| `GET` | `/health` | ❌ | Health check |

All protected routes require `Authorization: Bearer <token>` header.

See [`docs/API.md`](docs/API.md) for details.

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

---

## 🗺️ Roadmap

- [x] **Phase 1** — Product foundation (mobile shell, API skeleton, Prisma schema, JWT auth)
- [ ] **Phase 2** — Profile OS (editor, education, experience, skills, projects, GitHub import)
- [ ] **Phase 3** — Resume Intelligence (AI generation, ATS scoring, PDF/DOCX export)
- [ ] **Phase 4** — Job Intelligence (URL parser, match scoring, application tracker)
- [ ] **Phase 5** — AI Career Coach (Gemini + Groq adapters, roadmap generation, interview prep)
- [ ] **Phase 6** — Growth (notifications, calendar sync, LinkedIn integration)

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
