# No data in Umami

**App:** Umami  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Restore tracking when the dashboard stays empty despite live traffic.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Ability to view site HTML / tag manager
- Umami website ID and script URL from the property settings

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Umami.

## Steps
1. Confirm you selected the correct website property and a date range that should include hits.
2. Open the public site, DevTools → Network, filter for the Umami collect/script endpoint; confirm it is not blocked.
3. Verify the tracking script website ID matches the Umami property.
4. Disable ad blockers on a test browser; many blockers drop analytics beacons.
5. If only one environment fails (staging vs prod), confirm the script is deployed to that host.
6. Check Umami app logs / container health via Portainer if the API itself is down.

## Verify
A test pageview from your browser increments realtime or appears in today’s stats within a few minutes.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

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
- [Add a website property](../admin/add-website.md)
