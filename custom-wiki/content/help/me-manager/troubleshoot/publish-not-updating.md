# A published post isn't showing on the site

**App:** Me Manager  
**Audience:** end-user | admin  
**Last verified:** 2026-09-20

## Goal
Work out why a post that looks published in Me Manager hasn't shown up on the live property.

## Prerequisites
- Access to https://me.kecktech.net
- Know which property/track the post belongs to (Kecktech, WWFL, Jacob Roman, Uncle Jon, Homestead)

## Before you start
- Publishing in a property's own admin does not always reflect back into Me Manager automatically - status sync reads the property's real remote status, so a stale status usually means the sync step, not the publish itself, failed.
- Rule out a hard outage first: if the whole site is unreachable (not just the one post), check with Ops before assuming this is a content problem.

## Steps
1. Open **Pipeline** (`/pipeline`) and find the post. Check its status (awaiting approval / published / etc.) against what you expect.
2. Click **Sync CMS** to force a fresh status pull from the property.
3. If the post still shows the wrong status, open **Properties** (`/properties`) and confirm the property's site key and CMS base URL are correct and the connection is healthy.
4. Check **Ops** (`/ops`) for connection errors on that property's integration.
5. If the post is missing a hero image, use **Add hero** or **Fill missing heroes** on Pipeline - some site templates will not publish a post without one.
6. As a last resort, use **Ingest history** to re-pull the post's source content and re-check its sync status.

## Verify
The post's status in Pipeline matches what you see on the live property, and the sync timestamp is recent.

## If it fails mid-way
1. Note the exact post title, property, and the status shown in Me Manager vs. the live site.
2. Retry **Sync CMS** once.
3. If it still will not reconcile, escalate with those details rather than editing the post repeatedly - repeated manual edits can mask the real sync bug.

## Related
- [Find your way around Me Manager](../getting-started/find-your-way-around.md)
- [Manage properties, tracks, and site sync](../admin/manage-properties-and-sync.md)
