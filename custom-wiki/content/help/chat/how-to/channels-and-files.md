# Create a channel and share files

**App:** Chat  
**Audience:** end-user  
**Last verified:** 2026-08-07

## Goal
Spin up a topic channel and share a file without leaking secrets.

After you finish, you should be confident the task worked—not just that a page loaded.

## Prerequisites
- Permission to create channels
- File smaller than server limits

- Quiet 5–15 minutes for the full path (longer for admin changes)
- Ability to capture a screenshot or exact error text if something fails

## Before you start
- Prefer a private/incognito window when diagnosing auth or cache issues.
- Keep https://help.kecktech.net open in another tab if you need sibling articles.
- For production/admin changes, have the Zammad ticket number ready for notes.
- If Authelia challenges you, finish SSO at https://auth.kecktech.net, then continue in Chat.

## Steps
1. Click **Add channel** / create channel.
2. Name it clearly (`client-acme-cutover`) and set private vs public per policy.
3. Invite only required members.
4. Share updates in-thread when possible to keep the main channel readable.
5. Upload files with the paperclip/upload control. Never upload password exports—use Vaultwarden.
6. Pin key messages (runbooks, bridges) when the UI allows.

## Verify
Channel members can open the channel and download the shared non-sensitive file.

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
This article is a task guide. Follow the steps in order; do not skip Verify.

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
- [Chat admin moderation basics](../admin/moderation.md)
- [Cannot connect to chat](../troubleshoot/cannot-connect.md)
