# Kecktech Platform Services — Master Project Context

## Business Context

Kecktech is a family IT services business in Park City, Kansas, operating a solar-powered private data center. The business provides White Glove remote support, Hardware-as-a-Service (HaaS) using refurbished enterprise gear, and custom application development for SMB clients. All services follow Green IT and Circular Economy principles.

## Developer Context

- **Primary Developer:** Jon (GitHub: Bizzo1975)
- **Dev Environment:** Windows 11, Docker, Cursor AI
- **Infrastructure:** Proxmox VMs accessed via Tailscale and Cloudflare tunnel
- **Core Stack:** TypeScript, Next.js 14+, PostgreSQL, Prisma, Redis, Tailwind CSS
- **Flagship Project:** Nexus (AI-powered SDLC factory, ~55% complete)
- **Workflow:** Bizzo Development Workflow Framework — 10-stage lifecycle, 5-project max rule
- **Project Management:** Notion Command Center with linked databases

## Platform Services Architecture

All platform services are self-hosted on Proxmox and served behind Cloudflare tunnels. The four active pillars are:

### Pillar 1: Wiki (BookStack)
- PHP/MySQL stack, Docker Compose deployment
- Migrated from Wiki.js
- Themed to match WordPress site CSS
- See: `prompts/platform-services/bookstack-migration.md`

### Pillar 2: Video/Audio Platform (PeerTube + Paywall)
- Node.js/PostgreSQL, FFmpeg transcoding, HLS streaming
- Nginx auth proxy (Phase 1) → Next.js paywall gateway (Phase 2)
- Stripe integration for premium content
- See: `prompts/platform-services/peertube-video-platform.md`

### Pillar 3: Chat Service (Rocket.Chat)
- Self-hosted via Docker Compose with MongoDB
- Jitsi integration for voice channels
- Themed to match WordPress site
- See: `prompts/platform-services/rocketchat-service.md`

### Pillar 4: Custom App Portfolio (10 Base Templates)
- All built on shared Next.js/PostgreSQL/Prisma/Tailwind foundation
- Each app is a starting template customized per client engagement
- See individual prompts in `prompts/custom-apps/`

## Shared Technical Standards

### All Projects Must Follow:
- **TypeScript** — strict mode, no `any` types without justification
- **Next.js 14+** with App Router (not Pages Router)
- **Prisma ORM** for all database access (no raw SQL except migrations)
- **NextAuth.js** for authentication (OAuth, credentials, SSO-ready)
- **Tailwind CSS** for styling (client-themeable via CSS variables)
- **Role-Based Access Control (RBAC)** — every app ships with admin/user/viewer roles minimum
- **Docker Compose** deployment — every app must include a production-ready `docker-compose.yml`
- **Environment variables** — never hardcode credentials, API keys, or secrets
- **Responsive design** — mobile-first, tested on 320px-1920px viewports
- **API-first** — all business logic exposed via typed API routes for future integrations

### Code Quality:
- ESLint + Prettier configured per project
- Meaningful commit messages (conventional commits preferred)
- README.md with setup instructions, environment variable docs, and architecture overview
- Error boundaries and graceful error handling throughout
- Loading states and optimistic updates for all mutations

### Database Conventions:
- UUIDs for primary keys (not auto-increment integers)
- `createdAt` / `updatedAt` timestamps on all tables
- Soft deletes (`deletedAt` nullable timestamp) for user-facing data
- Prisma migrations committed to version control

### Deployment Pattern:
```yaml
# Standard docker-compose.yml pattern for all apps
services:
  app:
    build: .
    environment:
      - DATABASE_URL=postgresql://...
      - NEXTAUTH_SECRET=...
      - NEXTAUTH_URL=...
    ports:
      - "3000:3000"
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=appname
      - POSTGRES_USER=appuser
      - POSTGRES_PASSWORD=${DB_PASSWORD}
volumes:
  pgdata:
```

## When Helping With This Project:

1. **Always reference the specific pillar/app prompt** for detailed context before writing code
2. **Follow the shared technical standards above** — they apply to every component
3. **Consider the solo developer context** — prefer simple, maintainable solutions over clever abstractions
4. **Self-hosted first** — never default to cloud SaaS dependencies; everything runs on Kecktech infrastructure
5. **Reusability matters** — code written for one app should be extractable for others where possible
6. **Security is non-negotiable** — no hardcoded credentials, proper input validation, CSRF protection, rate limiting
7. **Document as you go** — inline comments for complex logic, JSDoc for exported functions, README updates for setup changes
