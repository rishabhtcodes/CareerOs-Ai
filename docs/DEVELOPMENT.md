# Development Guide

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20.0.0 |
| npm | ≥ 10 |
| Expo Go (optional) | Latest |

> **Database**: SQLite is the default for development — **zero setup required**. The database file is created automatically at `apps/api/prisma/dev.db` on first migration. PostgreSQL is recommended for production.

---

## Initial Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

# 3. Edit apps/api/.env — at minimum set JWT_SECRET
#    GEMINI_API_KEY is optional but highly recommended for AI features
#    See: apps/api/.env.example for all available variables

# 4. Generate the Prisma client
npx prisma generate --schema apps/api/prisma/schema.prisma

# 5. Create database tables
npm --workspace apps/api run prisma:migrate
```

---

## Running Services

Open two terminal sessions:

```bash
# Terminal 1 — API (http://localhost:4000)
npm run dev:api

# Terminal 2 — Mobile Expo server
npm run dev:mobile
```

The Expo server will print a QR code. Scan it with **Expo Go** or press:
- `a` — open Android emulator
- `i` — open iOS simulator
- `w` — open in browser (limited native API support)

---

## Environment Variables

### `apps/api/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development` \| `test` \| `production` |
| `PORT` | No | `4000` | API server port |
| `DATABASE_URL` | **Yes** | `file:./dev.db` | SQLite path or PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | — | Min 24 chars. Generate: `openssl rand -hex 32` |
| `CLIENT_ORIGIN` | No | `http://localhost:8081` | Allowed CORS origin |
| `GEMINI_API_KEY` | No | — | Google Gemini API key — powers AI coach, resume gen, job analysis |
| `GROQ_API_KEY` | No | — | Groq API key — Llama 3 fallback when Gemini is unavailable |

> **Without `GEMINI_API_KEY`**: The app works fully. Resume generation uses a structured template, job analysis falls back to keyword matching, and the AI coach uses a local rule-based response.

### `apps/mobile/.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `EXPO_PUBLIC_API_URL` | No | `http://localhost:4000/api` | API base URL |
| `EXPO_PUBLIC_APP_ENV` | No | — | App environment label |

---

## Prisma Workflows

```bash
# Generate Prisma client after schema changes
npm --workspace apps/api run prisma:generate

# Create and apply a new migration
npm --workspace apps/api run prisma:migrate

# Open Prisma Studio (visual database browser)
npx prisma studio --schema apps/api/prisma/schema.prisma

# Reset database — drops all data (dev only!)
npx prisma migrate reset --schema apps/api/prisma/schema.prisma
```

### Switching to PostgreSQL

1. In `apps/api/prisma/schema.prisma`, comment out the SQLite datasource and uncomment the PostgreSQL one.
2. Set `DATABASE_URL=postgresql://user:pass@host:5432/careeros_ai` in `apps/api/.env`.
3. Run `npm --workspace apps/api run prisma:migrate`.

---

## Checks & Validation

```bash
# TypeScript — all workspaces
npm run typecheck

# Lint — all workspaces
npm run lint

# Format
npm run format

# Health check (API must be running)
curl http://localhost:4000/health
```

---

## Adding a New API Feature

Follow the feature-first pattern:

```
apps/api/src/features/<domain>/
  <domain>.schemas.ts    # Zod input schemas
  <domain>.service.ts    # Business logic + Prisma calls
  <domain>.controller.ts # Request handlers (parse → service → respond)

apps/api/src/routes/
  <domain>.routes.ts     # Router.get/post/put/delete wiring only
```

1. Define Zod schemas in `<domain>.schemas.ts`
2. Write service functions (pure business logic, throw `ApiError` on failures)
3. Write controller handlers (`parse → service → res.json`)
4. Wire routes and mount in `routes/index.ts`
5. Add hook in `apps/mobile/src/hooks/use<Domain>.ts`
6. Add service calls in `apps/mobile/src/services/api/<domain>.ts`

---

## Project Scripts Reference

| Script | Description |
|---|---|
| `npm run dev:api` | Start API with `tsx watch` (auto-reload) |
| `npm run dev:mobile` | Start Expo dev server |
| `npm run typecheck` | `tsc --noEmit` across all workspaces |
| `npm run lint` | ESLint across all workspaces |
| `npm run format` | Prettier write |
| `npm --workspace apps/api run build` | Compile API to `dist/` |
| `npm --workspace apps/api run start` | Run compiled API (production) |
| `npm --workspace apps/api run prisma:generate` | Regenerate Prisma client |
| `npm --workspace apps/api run prisma:migrate` | Apply pending migrations |
