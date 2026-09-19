# Edit a marketing page in Site Admin

**App:** Site Admin CMS  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Update copy on a public Kecktech page (home, about, blog shell, demos shell, etc.).

## Prerequisites
- Staff Authelia access
- URL: https://admin.kecktech.net/page/home

## Steps
1. Open https://admin.kecktech.net
2. Sign in via Authelia
3. Choose a page from the sidebar (including **Blog** and **Demos** shells)
4. Edit fields and save
5. Trigger **Rebuild** if the admin UI requires it for Astro dist

## Verify
Visit https://www.kecktech.net (or the edited path) and confirm the new copy.

## Related
- Use Apps Dashboard tiles
- ME Manager blog/posts bridge (Next CMS :8085)
