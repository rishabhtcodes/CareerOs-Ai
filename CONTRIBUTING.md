# Contributor Guide

Thank you for your interest in contributing to **CareerOS AI**! Please read this guide before submitting any changes.

---

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. Harassment of any kind will not be tolerated.

---

## How to Contribute

### Reporting Bugs

1. Search existing [Issues](../../issues) to avoid duplicates.
2. Open a new issue using the **Bug Report** template.
3. Include: OS, Node version, Expo SDK version, steps to reproduce, expected vs actual behaviour, and any relevant logs.

### Suggesting Features

1. Open an issue using the **Feature Request** template.
2. Describe the use case and the value it adds.
3. Keep requests focused — one feature per issue.

### Submitting a Pull Request

1. **Fork** the repository and clone your fork.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a branch off `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
4. Make your changes following the [coding standards](#coding-standards) below.
5. Run checks before pushing:
   ```bash
   npm run typecheck
   npm run lint
   ```
6. Commit using **Conventional Commits**:
   ```
   feat: add ATS scoring to resume generation
   fix: correct match score calculation in jobs service
   docs: update API endpoint table in README
   chore: bump expo to SDK 52
   ```
7. Push your branch and open a PR against `main`.
8. Fill in the PR template and link any related issues.

---

## Coding Standards

### General
- **TypeScript strict mode** is enabled — no `any`, no `as unknown as X` hacks.
- All files use `.ts` or `.tsx` extensions.
- Keep functions small and focused (single responsibility).
- Prefer named exports over default exports in library code.

### Backend (`apps/api`)
- Follow the **route → controller → service** pattern. Routes wire only. Controllers validate and shape. Services contain business logic and DB calls.
- All HTTP errors must go through `ApiError` — never `res.status(...).json(...)` inline.
- Validate all request bodies with `Zod` schemas before passing to services.
- New Prisma model changes require a new migration: `npm --workspace apps/api run prisma:migrate`.

### Mobile (`apps/mobile`)
- Screens live in `src/features/<domain>/`. One screen per file.
- Shared UI primitives belong in `src/components/ui/`.
- All colours and spacing must use `AppTheme` tokens from `src/constants/theme.ts` — no raw hex values in component files.
- Server state uses **TanStack React Query**. Add a hook in `src/hooks/` that wraps the API service call.
- Mock data lives **only** in `src/constants/mockData.ts`. Never import it from feature files in production paths.

### Shared (`packages/shared`)
- Only TypeScript types, interfaces, and simple constants — no runtime logic.
- Every export must be used by at least one of the two apps.

---

## Branch Naming

| Prefix | Use for |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Tooling, dependencies, config |
| `refactor/` | Code changes with no feature/fix |
| `test/` | Adding or updating tests |

---

## Commit Message Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #123]
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`  
**Scopes:** `api`, `mobile`, `shared`, `prisma`, `auth`, `resume`, `jobs`, `ai`, `profile`

---

## Setting Up Locally

See the [Quick Start](README.md#-quick-start) section in the README for full setup instructions.

---

## Questions?

Open a [Discussion](../../discussions) if you have questions about the architecture or roadmap.
