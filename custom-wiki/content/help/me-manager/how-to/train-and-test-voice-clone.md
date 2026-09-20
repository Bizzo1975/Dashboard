# Train and test your cloned voice in Voice Clone

**App:** Me Manager  
**Audience:** end-user  
**Last verified:** 2026-09-20 (verified live against `/voice-clone`)

## Goal
Understand the two-tier Voice Clone workflow - a quick zero-shot reference clip vs. a full fine-tuned training dataset - and know which step you're on.

## Prerequisites
- Access to https://me.kecktech.net
- A quiet room for recording, or a clean pre-recorded WAV
- The GPU voice-clone service running on the 3090 box (see Admin article for connection setup) for anything beyond uploading a clip

## Before you start
- Voice Clone output is spoken narration for **Video Studio** - it is separate from Brand Voices, which are written editorial tone presets, not audio.
- There is one narration voice, internally called **jon-v1**.
- Check the **Connection** panel at the top of `/voice-clone` first. If it says the service is "not configured" or the voice is "not trained yet", the steps below still work for uploading/recording audio, but synthesis will not run until the service is connected and, for the full voice, until training completes.

## Steps

### Fast path: zero-shot test with a reference clip
1. Open **Voice Clone** (`/voice-clone`).
2. Under **Reference clip (zero-shot)**, either **Upload reference WAV** or **Record reference** - 20-30 seconds of clean speech in a quiet room, natural delivery.
3. Once a reference clip is in place, use **Test synthesize** to hear the zero-shot (Chatterbox) result immediately - no training required for this step.

### Full path: fine-tune jon-v1
1. Under **Training dataset**, use **Upload dataset clip** or **Record clip** repeatedly to build up 45-90 minutes of usable speech (WAV, 44.1/48k mono preferred). Vary sentence length and include product names/acronyms you'll actually narrate.
2. Archive your raw recordings elsewhere before uploading - the dataset panel tracks status but you want your own backup of the masters.
3. When the dataset is ready, use **Train jon-v1** to start the GPT-SoVITS fine-tune on the GPU box. This needs an exclusive `voice-clone-train` lease, so avoid starting it if someone else is mid-training.
4. Once training completes, use **Synthesize** to generate narration with the fine-tuned voice.

## Verify
**Test synthesize** (zero-shot) or **Synthesize** (fine-tuned) produces audio that sounds like the reference/training recordings, not a generic voice, with no obvious clipping or artifacts.

## Related
- [Record a story in Story Studio](record-a-story.md)
- [Manage properties, tracks, and site sync](../admin/manage-properties-and-sync.md)
