# Find your way around Me Manager

**App:** Me Manager  
**Audience:** end-user | admin  
**Last verified:** 2026-09-20 (verified live against the app nav and `/pipeline`, `/voice-clone`, `/stories`)

## Goal
Know what each area of Me Manager does so you can find the right screen on the first try.

## Prerequisites
- Access to https://me.kecktech.net (staff/owner tool, not customer-facing)
- Quiet 5-15 minutes to click through the nav once

## Before you start
- Me Manager is the single control plane for content and publishing across every Kecktech-family property (Kecktech, WWFL, Jacob Roman, Uncle Jon, Homestead).
- If a page fails to load, check the Troubleshoot article for this app before assuming the whole site is down.

## Steps
1. **Pipeline** (`/pipeline`) - the default landing screen. Shows CMS posts by status (awaiting approval, published, etc.), lets you edit or delete a post, add or fill missing hero images, and filter by track, project, or content source (Cursor, Claude, LiT, CMS, GitHub, Sovereign, Manual). The **Coordinator wizard** here walks through turning raw ideas into scheduled posts.
2. **Tracks** (`/tracks`) - the recurring content campaigns per property (for example "Homestead - Farm & Build" or "Kecktech - Professional AI tools"), each with a goal, content pillars, a cadence, and target platforms.
3. **Calendar** (`/calendar`) - the schedule view across all tracks and properties.
4. **Content Library** (`/library`) - all captured or ingested source material in one searchable place.
5. **Stories** (`/stories`) - Story Studio: record or import audio/video (quick in-browser, or a Pro Wave/NVIDIA Broadcast/Audacity path), then approve into Inbox. Approve never auto-posts.
6. **Voice Clone** (`/voice-clone`) - build and test a cloned narration voice ("jon-v1") for Video Studio, from a quick zero-shot reference clip or a full fine-tuned training dataset. This is a separate, still-maturing feature - check the connection/training status on the page before assuming it is fully live.
7. **Video** (`/video`) - Video Studio for turning content into video assets.
8. **Portfolio** (`/portfolio`) - the portfolio and apps showcase surface.
9. **Voices** (`/voices`) - Brand Voices: written tone and persona presets (text style, not audio) used when generating copy for a given property.
10. **Properties** (`/properties`) - the sites Me Manager manages (site key, base URL, CMS connection, isolation group).
11. **Integrations** and **Settings** (`/integrations`, `/settings` - "Sources & Outputs") - connect and configure where content comes from and where it publishes to.
12. **Ops** (`/ops`) - connection health and operational tooling, including GPU Ops for Voice Clone.

## Verify
You can name which of the 12 nav areas you would use for: scheduling a post, recording a story, training the cloned voice, and checking why a live site looks out of date (Pipeline/Calendar, Stories, Voice Clone, and Ops/Properties, respectively).

## Related
- [Record a story in Story Studio](../how-to/record-a-story.md)
- [Train and test your cloned voice in Voice Clone](../how-to/train-and-test-voice-clone.md)
- [A published post isn't showing on the site](../troubleshoot/publish-not-updating.md)
- [Manage properties, tracks, and site sync](../admin/manage-properties-and-sync.md)
