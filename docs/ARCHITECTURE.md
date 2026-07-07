# CareerOS AI Architecture

## Product Shape

CareerOS AI is split into three layers:

- `apps/mobile`: Expo Router mobile app with feature-first screens and reusable UI components.
- `apps/api`: Express API with route, controller, service, and persistence boundaries.
- `packages/shared`: Cross-platform TypeScript contracts.

## Frontend Principles

- Screens are owned by `src/features/*`.
- Shared UI primitives live in `src/components`.
- API integrations live in `src/services/api`.
- Visual design is token-driven through `src/constants/theme.ts`.
- Mock data is intentionally isolated in `src/constants/mockData.ts` so it can be replaced by React Query hooks feature by feature.

## Backend Principles

- Routes wire endpoints only.
- Controllers validate request bodies and shape responses.
- Services hold business logic and persistence calls.
- Prisma models represent the career graph: profile, skills, resumes, applications, GitHub, notifications, settings, and AI history.

## Next Engineering Milestones

1. Add persistent mobile auth storage using SecureStore.
2. Add form screens for profile, experience, projects, and skills.
3. Connect dashboard UI to `/api/dashboard` once auth is wired.
4. Add Gemini/Groq provider adapters behind `features/ai`.
5. Add PDF/DOCX resume export workers.
6. Add notification scheduling and reminder jobs.
