# Add a website property in Umami

**App:** Umami  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Register a new site so its tracking script can send pageviews to Umami.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Umami admin role
- Canonical hostname for the site
- Place to install the script (Astro layout, CMS, etc.)

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Umami.

## Steps
1. Sign in at https://umami.kecktech.net.
2. Open Settings → Websites → Add website.
3. Enter name and domain (example: `www.kecktech.net`).
4. Save and copy the tracking snippet / website ID.
5. Store the ID in Vaultwarden notes for the web project if helpful.
6. Deploy the script to the site’s shared layout. Publish the site.
7. Generate a few pageviews and confirm they appear in the new property.

## Verify
The new property lists recent pageviews from your test browse.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Umami from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Umami provides privacy-friendly analytics for Kecktech web properties. Empty charts usually mean the tracking script/website ID is wrong or blocked—not that the site has zero visitors.

Canonical URLs:
- https://umami.kecktech.net

## UI map
Know these landmarks before you start:

- Website property switcher
- Date range controls
- Overview cards + Pages / Referrers / Devices
- Settings → Websites for tracking snippets

## Audience notes
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Reading the wrong property or an empty date range
- Ad blockers dropping collect beacons during “tests”
- Deploying the script with a staging website ID on production

## Kecktech tips
- Verify Network calls to the Umami collect endpoint from a clean browser profile.
- Store website IDs in Vaultwarden notes for web projects.
- Use aggregates in meetings—avoid exporting personally sensitive raw data.

## Related
- [View analytics dashboard](../getting-started/view-dashboard.md)
- [Filter pages and referrers](../how-to/filter-reports.md)
- [No data in Umami](../troubleshoot/no-data.md)
