# Open the Marketlist demo

**App:** Marketlist  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Launch the Marketlist demo app and understand its shopping-list workflow.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Demo URL: https://marketlist.kecktech.net (also linked from https://www.kecktech.net demos)
- Demo credentials if the instance is gated—use values from the demos page or staff

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Marketlist.

## Steps
1. Open the demos page on https://www.kecktech.net or go directly to the Marketlist URL.
2. Sign in with demo credentials if prompted.
3. Land on the list overview. Note sample lists used for the showcase.
4. Open a list to see items, quantities, and checked-off state.
5. Orient to navigation: lists, items, and sharing/settings if exposed in the demo build.

## Verify
You can open at least one list and see item rows without an application error.

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
This article is a first-run guide. Finish Verify before moving to how-to topics.

## Common pitfalls
- Stale demo passwords bookmarked from an old session
- Expecting production durability from sandbox data

## Kecktech tips
- Pull credentials from the www demos page when login fails.
- Prefix demo items if you are evaluating with a prospect watching.
- Use the website contact form for production interest.

## Related
- [Add items to a list](../how-to/add-items.md)
- [Demo login or data reset issues](../troubleshoot/demo-access.md)
- [Browse public demos](../../website/getting-started/browse-site.md)
