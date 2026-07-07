# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x (current) | ✅ |

---

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in CareerOS AI, please report it responsibly:

1. **Email**: Send a detailed report to the project maintainer via GitHub's private security advisory system.  
   Go to: **Security → Report a vulnerability** (on the repository page).

2. **Include in your report:**
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - The potential impact (data exposure, authentication bypass, etc.)
   - Any suggested remediation if you have one

3. **Response time**: You can expect an acknowledgement within **72 hours** and a status update within **7 days**.

4. **Disclosure**: We follow responsible disclosure. Once a fix is released, we will publish a security advisory crediting your report (unless you prefer to remain anonymous).

---

## Security Best Practices for Self-Hosted Deployments

If you are deploying CareerOS AI yourself:

- **Never commit `.env` files** — only `.env.example` with placeholder values belongs in the repository.
- **JWT_SECRET** must be at least 32 random characters. Use a generator: `openssl rand -hex 32`
- **DATABASE_URL** must use a least-privilege PostgreSQL user — not the superuser/postgres account.
- **API keys** (Gemini, Groq, Cloudinary, SMTP) must never be exposed client-side.
- Enable **HTTPS** in production. The `CLIENT_ORIGIN` env var must be an `https://` URL.
- Use **Helmet** (already configured) and review its CSP policy for your deployment.
- Add **rate limiting** (`express-rate-limit`) before going public — it is listed in the roadmap but not yet implemented.

---

## Known Limitations (Pre-Production)

The following features are stubs and are **not production-ready** in v0.1.x:

- AI provider integration (Gemini, Groq) — currently uses a local fallback
- Email verification — `emailVerifiedAt` field exists but flow is not implemented
- Refresh token rotation — currently using single long-lived JWT (7 days)
- Rate limiting — not yet implemented

These will be addressed in upcoming phases. Do not expose v0.1.x to the public internet without understanding these limitations.
