# Browse the public website

**App:** Kecktech Website  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Find services, demos, and contact options on the public Kecktech marketing site.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Any modern browser
- URL: https://www.kecktech.net

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Kecktech Website.

## Steps
1. Open https://www.kecktech.net.
2. Use the top navigation for primary sections (services, demos, help, contact—labels match the live site).
3. Open **Demos** to explore product showcases such as Marketlist, FloorOS, ARGO, Cleaner, and FarmBot.
4. Open **Help** to jump to https://help.kecktech.net for how-to articles.
5. Use the contact form or listed phone/email when you need sales or support intake.
6. On mobile, open the menu control to reach the same destinations.

## Verify
Home page loads with brand header and you can open Demos and Help without broken links.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Kecktech Website from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
The public marketing site (Astro) covers services, demos, help entry points, and contact. Content edits usually go through Site Admin at https://admin.kecktech.net.

Canonical URLs:
- https://www.kecktech.net

## UI map
Know these landmarks before you start:

- Top navigation: services / demos / help / contact (labels follow the live site)
- Demos index linking to product showcases
- Contact form posting through the site API / mail pipeline
- Footer legal links including privacy

## Audience notes
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Assuming the contact form replaces a tracked Zammad ticket for outages
- Cached CDN/HTML hiding a just-published edit
- Blockers preventing form POST or analytics—not always a server outage

## Kecktech tips
- Existing customers should prefer https://support.kecktech.net for support.
- After CMS edits, hard-refresh the public path.
- Demo links should match demos.json / live demo hosts.

## Related
- [Use the contact form](../how-to/contact-form.md)
- [Page or form errors](../troubleshoot/page-not-loading.md)
- [Edit pages in Site Admin](../../site-admin/how-to/edit-a-page.md)
