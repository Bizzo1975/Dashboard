# View Umami analytics dashboard

**App:** Umami  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Open site analytics for Kecktech properties and read traffic at a glance.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Umami login (staff)
- URL: https://umami.kecktech.net
- Website tracking already installed on the property

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Umami.

## Steps
1. Open https://umami.kecktech.net and sign in (Authelia may front the app).
2. Select the website property (for example www.kecktech.net).
3. Set the date range (today / 7d / 30d) in the dashboard header.
4. Review overview cards: views, visits, bounce rate, and average visit duration.
5. Scroll to pages, referrers, and devices to see what content performs.
6. Use realtime (if enabled) during campaigns to confirm events are arriving.

## Verify
Charts populate for the selected property and date range (not stuck on empty with tracking known-good).

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Reading the wrong property or an empty date range
- Ad blockers dropping collect beacons during “tests”
- Deploying the script with a staging website ID on production

## Kecktech tips
- Verify Network calls to the Umami collect endpoint from a clean browser profile.
- Store website IDs in Vaultwarden notes for web projects.
- Use aggregates in meetings—avoid exporting personally sensitive raw data.

## Related
- [Filter pages and referrers](../how-to/filter-reports.md)
- [Add a website property](../admin/add-website.md)
- [No data in Umami](../troubleshoot/no-data.md)
