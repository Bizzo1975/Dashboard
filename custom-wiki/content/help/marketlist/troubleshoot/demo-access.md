# Marketlist demo login or data issues

**App:** Marketlist  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Recover when the Marketlist demo will not sign in or appears empty after a reset.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demos page for current credentials
- Private browser window

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Marketlist.

## Steps
1. Copy fresh demo credentials from the Kecktech demos page—old bookmarks may be stale.
2. Clear site data for the Marketlist host and retry.
3. If the list is empty, the sandbox may have reset; recreate a sample list to continue evaluating UX.
4. 502/404: note the error and contact Kecktech—demo hosting may be redeploying.
5. For production interest, use the website contact form rather than relying on demo persistence.

## Verify
You can sign in and interact with a list end-to-end.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Marketlist from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Marketlist is a Kecktech demo app for shared shopping lists. Data may reset; do not store real secrets in the demo.

Canonical URLs:
- https://marketlist.kecktech.net

## UI map
Know these landmarks before you start:

- Lists overview
- List detail with item rows and purchased toggles
- Add item field/button
- Optional sharing/settings entry points in the demo build

## Audience notes
Work the steps top-to-bottom. Stop when the Verify condition is met—later steps may be unnecessary.

## Common pitfalls
- Stale demo passwords bookmarked from an old session
- Expecting production durability from sandbox data

## Kecktech tips
- Pull credentials from the www demos page when login fails.
- Prefix demo items if you are evaluating with a prospect watching.
- Use the website contact form for production interest.

## Related
- [Open the Marketlist demo](../getting-started/open-demo.md)
- [Add items to a list](../how-to/add-items.md)
- [Website contact form](../../website/how-to/contact-form.md)
