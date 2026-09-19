# Send a message with the contact form

**App:** Kecktech Website  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Submit the website contact form so the message reaches Kecktech (Graph/mail pipeline).

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Contact page on https://www.kecktech.net
- Valid reply email address
- Short description of your request

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Kecktech Website.

## Steps
1. Open the Contact page from the site navigation.
2. Enter your name, email, phone (if requested), and message.
3. Complete any CAPTCHA or anti-spam challenge if shown.
4. Submit the form and wait for the on-page success confirmation.
5. Check your inbox for an acknowledgement if the site sends one.
6. For existing support issues, prefer https://support.kecktech.net so the request becomes a tracked ticket.

## Verify
The page shows a success state (not a generic 500) and you do not see a validation error on required fields.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Page or form errors](../troubleshoot/page-not-loading.md)
- [Open a support ticket](../../zammad/getting-started/open-a-ticket.md)
