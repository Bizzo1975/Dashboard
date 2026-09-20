# Manage properties, tracks, and site sync

**App:** Me Manager  
**Audience:** admin  
**Last verified:** 2026-09-20 (verified against `src/lib/site-sync.ts`, `src/lib/capture-url.ts`, `src/lib/capture-authelia.ts`, `scripts/upsert-homestead-persona.ts` in the me-manager repo)

## Goal
Add or fix a Property connection so publish status and hero-image capture work correctly for that site.

## Prerequisites
- Repo/SSH access to the me-manager host, or admin access on https://me.kecktech.net
- The target site's canonical URL, CMS API key, and isolation group

## Before you start
- A **Property** record needs: `siteKey`, `cmsBaseUrl`, `cmsApiKey`, `isolationGroup`, and optionally `defaultBrandVoiceId`. `isolationGroup` keeps one property's content from leaking into another's suggestions (for example, Homestead content should never surface for the Garage persona).
- Never hardcode a real API key literal in a script or committed file - read it from an environment variable (for example `HOMESTEAD_CMS_API_KEY`) set in `.env.production`, which is gitignored. A hardcoded fallback key in source is a real leak even if the file is never pushed.
- Publish-status sync reads the property's **real remote status** field. Matching on a raw substring of a URL (for example checking if a URL "includes" a brand name) is unsafe - it can match the wrong subdomain and misattribute another site's publish event. Match on the exact parsed hostname instead.
- Hero-image capture (`capture-url.ts`) is a single generic screenshot engine for every property; the only per-domain logic is Authelia sign-in, handled once per parent domain and reused across every app under it, since the Kecktech-family Authelia instances share one LLDAP backend.

## Steps
1. Open **Properties** (`/properties`) and add or edit the entry for the site: name, URL, CMS admin URL, tech stack, status, notes, `siteKey`, `cmsBaseUrl`, `cmsApiKey` (via env var), `isolationGroup`.
2. If the property needs a recurring content campaign, create or edit its **Track** (`/tracks`): goal, content pillars, cadence per week, target platforms.
3. If publish status looks wrong after a site-side change, check `site-sync.ts`'s stage mapping logic rather than editing the Property's status by hand - a hand-edit will just get overwritten on the next sync.
4. For hero images failing to capture on a specific property, confirm its Authelia parent domain is one of the recognized Kecktech-family domains; capture logic does not need per-app changes, only per-domain auth.
5. For Voice Clone, set `VOICE_CLONE_URL` (and its API key) on **Settings** (`/settings` → Connect), matching the `voice-clone-service` running on the GPU box. Check **Ops** (`/ops` → GPU Ops) for lease conflicts before starting a training run - training needs an exclusive `voice-clone-train` lease on the GPU.

## Verify
The property's live publish status matches what Pipeline shows after **Sync CMS**, hero images capture without an Authelia redirect loop, and no plaintext API key literal exists anywhere in the committed source.

## If it fails mid-way
1. Note the exact property/site key and whether the failure is publish-status, hero capture, or Voice Clone connection.
2. For a stuck GPU training lease, check Ops before retrying - do not start a second training run against the same lease.
3. Escalate with the property name and the exact error/status text.

## Related
- [Find your way around Me Manager](../getting-started/find-your-way-around.md)
- [A published post isn't showing on the site](../troubleshoot/publish-not-updating.md)
- [Train and test your cloned voice in Voice Clone](../how-to/train-and-test-voice-clone.md)
