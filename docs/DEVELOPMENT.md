# Development Guide

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20.0.0 |
| npm | ≥ 10 |
| PostgreSQL | ≥ 14 |
| Expo Go (optional) | Latest |

---

## Initial Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

# 3. Edit apps/api/.env with your database URL and JWT secret
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

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` \| `test` \| `production` (default: `development`) |
| `PORT` | No | API server port (default: `4000`) |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | Min 24 chars. Use `openssl rand -hex 32` to generate |
| `CLIENT_ORIGIN` | No | Allowed CORS origin (default: `http://localhost:8081`) |
| `GEMINI_API_KEY` | No | Google Gemini API key (AI coach) |
| `GROQ_API_KEY` | No | Groq API key (alternative AI provider) |
| `CLOUDINARY_CLOUD_NAME` | No | For future PDF/image upload |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | No | For future email verification |

### `apps/mobile/.env`

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | No | API base URL (default: `http://localhost:4000/api`) |
| `EXPO_PUBLIC_APP_ENV` | No | App environment label |

---

## Prisma Workflows

```bash
# Generate Prisma client after schema changes
npm --workspace apps/api run prisma:generate

# Create and apply a new migration
npm --workspace apps/api run prisma:migrate

# Open Prisma Studio (database GUI)
npx prisma studio --schema apps/api/prisma/schema.prisma

# Reset database (drops all data — dev only)
npx prisma migrate reset --schema apps/api/prisma/schema.prisma
```

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

## Project Scripts Reference

| Script | Description |
|---|---|
| `npm run dev:api` | Start API with `tsx watch` (auto-reload) |
| `npm run dev:mobile` | Start Expo dev server |
| `npm run typecheck` | `tsc --noEmit` across all workspaces |
| `npm run lint` | ESLint across all workspaces |
| `npm run format` | Prettier write |
| `npm --workspace apps/api run build` | Compile API to `dist/` |
| `npm --workspace apps/api run start` | Run compiled API |
