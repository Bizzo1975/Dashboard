# Chat moderation basics

**App:** Chat  
**Audience:** admin  
**Last verified:** 2026-08-07

## Goal
Manage membership, retain auditability, and remove sensitive accidental posts.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Chat admin/moderator role
- HR/ops guidance for people issues

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Chat.

## Steps
1. Review workspace members monthly; remove departed staff (coordinate with LLDAP off-boarding).
2. Convert noisy DMs about incidents into a dedicated private channel with ticket links.
3. Delete or tombstone accidental secret pastes; rotate the exposed credential in Vaultwarden immediately.
4. Adjust default notification and retention settings per compliance needs.
5. Document integration webhooks (Zammad/n8n) so they are not removed as spam.

## Verify
Departed users cannot log in; incident channel history still references ticket IDs.

Also confirm:
- You are still signed in as the intended user (check avatar/header identity where shown)
- You did not leave a half-finished draft/config that could affect others
- If this was a customer-facing change, the related Zammad ticket has a short note

## If it fails mid-way
1. Copy the exact URL, HTTP status, and any banner/toast text.
2. Retry once after a full Authelia sign-out (only if the failure looks session-related).
3. Open the Troubleshoot article for Chat from Related below.
4. Escalate via https://tickets.kecktech.net (or https://support.kecktech.net) with screenshots.


## About this app
Team chat for Kecktech coordination. It complements Zammad rather than replacing tickets for customer work.

Canonical URLs:
- https://chat.kecktech.net

## UI map
Know these landmarks before you start:

- Channel list / browser
- Message composer and threads
- File upload control
- User/notification preferences

## Audience notes
Staff/admin only. Record changes in the related Zammad ticket when you alter access or production config.

## Common pitfalls
- Sharing passwords or .env contents in channels
- Incident discussion without a ticket ID
- Websocket blocks on restrictive networks

## Kecktech tips
- Create private channels per cutover/incident with ticket links.
- Rotate any accidentally pasted secret immediately.
- Prefer tickets for customer-visible commitments.

## Related
- [Join the chat workspace](../getting-started/join-workspace.md)
- [Create a channel and share files](../how-to/channels-and-files.md)
- [Cannot connect to chat](../troubleshoot/cannot-connect.md)
