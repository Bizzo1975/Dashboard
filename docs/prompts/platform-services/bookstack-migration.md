# BookStack Wiki Migration — Project Prompt

## Objective
Migrate Kecktech's wiki from Wiki.js to BookStack, matching the WordPress site's visual theme and preserving all existing content.

## Current State
- **Source:** Wiki.js running on Node.js + PostgreSQL
- **Content:** Markdown pages with images and file attachments
- **Access:** Internal + select public pages

## Target State
- **Platform:** BookStack (PHP 8.x + MySQL/MariaDB)
- **Deployment:** Docker Compose on Proxmox VM
- **Theme:** CSS and Blade template overrides matching WordPress site
- **Access:** Same permission model as current wiki

## Technical Architecture

### Docker Compose Stack
```yaml
services:
  bookstack:
    image: lscr.io/linuxserver/bookstack:latest
    environment:
      - APP_URL=https://wiki.kecktech.com
      - DB_HOST=bookstack-db
      - DB_DATABASE=bookstack
      - DB_USERNAME=bookstack
      - DB_PASSWORD=${BOOKSTACK_DB_PASS}
    volumes:
      - ./config:/config
    ports:
      - "6875:80"
    depends_on:
      - bookstack-db
  bookstack-db:
    image: mariadb:10
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASS}
      - MYSQL_DATABASE=bookstack
      - MYSQL_USER=bookstack
      - MYSQL_PASSWORD=${BOOKSTACK_DB_PASS}
    volumes:
      - dbdata:/var/lib/mysql
volumes:
  dbdata:
```

### Migration Script Requirements
The migration script should:
1. Connect to Wiki.js GraphQL API or PostgreSQL directly
2. Export all pages with metadata (title, path, tags, created/updated dates)
3. Export all images and file attachments
4. Map Wiki.js flat page structure into BookStack hierarchy:
   - Top-level path segments → Shelves
   - Second-level segments → Books
   - Third-level → Chapters
   - Individual pages → Pages
5. Use BookStack REST API to create structure and upload content
6. Re-link image references in page content to new BookStack paths
7. Generate a migration report (pages migrated, failures, orphaned attachments)

### Theming Requirements
- Extract CSS variables from WordPress theme: primary colors, fonts, spacing, header/footer layout
- Apply via BookStack Admin → Customization → Custom HTML Head and Custom Styles
- Override Blade templates in `/config/www/themes/custom/` for header/footer structure
- Ensure responsive behavior matches WordPress breakpoints

## Key BookStack API Endpoints
```
GET  /api/shelves          — List shelves
POST /api/shelves          — Create shelf
POST /api/books            — Create book
POST /api/chapters         — Create chapter
POST /api/pages            — Create page
POST /api/attachments      — Upload attachment
POST /api/image-gallery    — Upload image
```

## When Working On This:
- Prefer BookStack's REST API over direct database manipulation
- Test migration with a subset of pages first before full migration
- Preserve original created/updated timestamps where possible
- Create a rollback plan (keep Wiki.js running until BookStack is verified)
- Document any content that fails to migrate cleanly for manual review
