# Custom Wiki Architecture (BookStack Fallback)

## Purpose

Provide a fully branded wiki at `help.kecktech.net` that matches `kecktech.net` header/theme requirements while keeping BookStack-class capabilities.

## Runtime Topology

- `custom-wiki` (Next.js app, App Router, TypeScript strict).
- `custom-wiki-db` (PostgreSQL).
- Traefik route:
  - `help.kecktech.net` -> `custom-wiki:3011`.
  - `bookstack.kecktech.net` remains available for rollback and source migration reads.

## Data Model Coverage

Implemented Prisma schema includes:

- Content hierarchy: `Shelf`, `Book`, `Chapter`, `Page`.
- Revision history: `PageRevision`.
- Access controls: `Role`, `Permission`, `RoleBinding`.
- Users and API tokens: `User`, `ApiToken`.
- Search and metadata: `ContentTag`.
- Collaboration: `Comment`.
- Compliance and traceability: `AuditLog`.
- Media storage metadata: `Attachment`.
- Soft-delete support: `deletedAt` on user-facing records.

## API Surface (Implemented)

- `GET /api/health` service health.
- `GET /api/search?term=` full-text style search across page title/content/tags.
- `POST /api/import/pages` idempotent import/upsert endpoint for migration and ongoing article sync.
- `GET /api/pages/:pageId/comments` list discussion comments.
- `POST /api/pages/:pageId/comments` create comments (token-gated).

## Security Model

- Bearer API token validation against hashed token records (`ApiToken.tokenHash`).
- Audited import/comment creation in `AuditLog`.
- Token expiration enforcement.

## Migration Path

- Script: `custom-wiki/scripts/migrate-bookstack.js`.
- Pulls BookStack page records via BookStack API token.
- Pushes records into custom wiki via token-gated import endpoint.
- Supports iterative reruns for staged cutover.
