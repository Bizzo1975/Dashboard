# Filter pages and referrers

**App:** Umami  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Narrow Umami reports to a path or traffic source for a campaign review.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Access to the property dashboard
- Campaign URL or referrer hostname

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Umami.

## Steps
1. Open the property dashboard and choose the date range covering the campaign.
2. In Pages, click a path (for example `/demos`) to focus the view if the UI supports drill-down.
3. Check Referrers for sources such as search, direct, or partner sites.
4. Compare mobile vs desktop under Devices when diagnosing layout issues reported by users.
5. Export or screenshot key charts for the ticket or meeting notes.
6. Avoid sharing raw IP-level data externally; Umami is for aggregate product analytics.

## Verify
Filtered view shows only the expected paths/sources for the period.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Add a website property](../admin/add-website.md)
- [No data in Umami](../troubleshoot/no-data.md)
