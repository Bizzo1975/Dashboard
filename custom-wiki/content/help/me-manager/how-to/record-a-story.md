# Record a story in Story Studio

**App:** Me Manager  
**Audience:** end-user  
**Last verified:** 2026-09-20 (verified live against `/stories` and `docs/STORY_RECORDING.md`)

## Goal
Record or import audio/video in Story Studio and get it into Inbox for review.

## Prerequisites
- Access to https://me.kecktech.net
- Quick path: nothing extra - browser mic (and camera for video) is enough
- Pro path: Elgato Wave:3 (or Wave Link), NVIDIA Broadcast, and Audacity installed
- Video: Camo, Iriun, or EpocCam if recording from an iPhone on Windows

## Before you start
- Approve never auto-posts. A story only reaches Inbox for review after you approve it there; nothing goes out to social/CMS on its own.
- Browser (Quick) takes are stored under `storage/stories/{id}/` and WebM audio is transcoded to MP3 automatically when ffmpeg is available.

## Steps

### Quick (in-browser)
1. Open **Story Studio** (`/stories`) and choose **New story**.
2. Choose **Audio** or **Video**.
3. Allow the mic (and camera for video). Pick **Microphone (NVIDIA Broadcast)** or **Elgato Wave** as the input device if offered; for video on Windows, pick your iPhone via Camo/Iriun/EpocCam.
4. Record, stop, optionally trim the start/end, then **Save recording**.
5. Add cover image(s), then **Approve → Inbox**.

### Pro audio (desktop, recommended for long-form)
1. Unmute **Elgato Wave:3** in Wave Link.
2. In **NVIDIA Broadcast**, set the input to Wave:3 and enable Noise Removal / Room Echo as preferred.
3. Confirm Windows shows "Microphone (NVIDIA Broadcast)" as an active recording device.
4. In **Audacity**, set the recording device to "Microphone (NVIDIA Broadcast)", Project Rate to **48000 Hz**, and Channels to Mono (or Stereo if preferred).
5. Record, trim silence, then `File → Export → Export as WAV` (or MP3 at 320 kbps).
6. Back in Story Studio, import the exported file (Audio mode → import), add images and a title/caption, then **Approve → Inbox**.

## Verify
The story appears in **Open Inbox** with your recording attached, ready for review and scheduling - it has not posted anywhere yet.

## Related
- [Find your way around Me Manager](../getting-started/find-your-way-around.md)
- [Train and test your cloned voice in Voice Clone](train-and-test-voice-clone.md)
