# Website page or form not loading

**App:** Kecktech Website  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Recover from blank pages, 5xx errors, or contact form failures on the public site.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Note the exact URL and error text
- Try a second network (phone hotspot) to rule out local DNS

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Kecktech Website.

## Steps
1. Hard refresh (Ctrl+F5) or try a private window to bypass stale cache/CDN assets.
2. If only one path fails (for example `/demos`), try Home to see whether the whole site is down.
3. Contact form errors: confirm required fields, disable blockers for the domain, and retry once.
4. If you see a Traefik or gateway error, wait briefly; persistent outages should be reported via phone or https://tickets.kecktech.net.
5. Staff editing content should verify the page in Site Admin (https://admin.kecktech.net) and republish if a draft was left unpublished.

## Verify
The target page renders and the contact form can show validation or success responses.

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
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Assuming the contact form replaces a tracked Zammad ticket for outages
- Cached CDN/HTML hiding a just-published edit
- Blockers preventing form POST or analytics—not always a server outage

## Kecktech tips
- Existing customers should prefer https://support.kecktech.net for support.
- After CMS edits, hard-refresh the public path.
- Demo links should match demos.json / live demo hosts.

## Related
- [Browse the public website](../getting-started/browse-site.md)
- [Send a contact form message](../how-to/contact-form.md)
- [Edit a page in Site Admin](../../site-admin/how-to/edit-a-page.md)
