# Kecktech.net — Business Launch & Implementation Summary

## 5-Step Business Launch Plan

| Phase | Action Items | Key Tools |
|-------|--------------|-----------|
| 1. Legal | Register LLC in Kansas. If Florida activity is significant, file as "Foreign Entity" in Florida ($165–$185). | Kansas SOS |
| 2. Operations | Deploy full suite (RustDesk, FreeScout, ERPNext for billing). | Docker / VPS |
| 3. Service Mix | Three tiers: Remote Fix ($45/hr), In-Home via Florida contact ($85/hr), Monthly "Peace of Mind" ($30/mo). | ERPNext |
| 4. Marketing | Target adult children (decision-makers) via Facebook ads; local SEO for "Senior Tech Support Florida". | Google Business Profile |
| 5. Onboarding | Physical "Emergency Tech Card" with support number for seniors. | Canva (Free) |

---

## Kecktech.net Implementation Guide (Summary)

- **Infrastructure:** Proxmox VM (Ubuntu 24.04, 4 vCPU, 8GB RAM); Cloudflare Tunnel (zero open ports).
- **Subdomains:** kecktech.net → WordPress; help.kecktech.net → WikiJS; helpdesk.kecktech.net → FreeScout; ops.kecktech.net → ERPNext; vault.kecktech.net → Vaultwarden; stats.kecktech.net → Umami; dashboard.kecktech.net → integrated dashboard (SSO for all internal apps).
- **ERPNext:** Support-first CRM; Service Items for hourly + subscription; Generic Hardware Templates for HaaS; Stripe; Kansas tax + Florida 1099.
- **Knowledge base:** High-contrast (black/white/yellow); Scam Prevention, Service Guide, What is HaaS; text-to-speech for accessibility.
- **WordPress:** "About the Founder," "Check My Computer" / "Call Me" lead capture.
- **Umami:** Privacy-first analytics; no PII.
- **Final checklist:** Proxmox snapshots daily; ERPNext configured; Vaultwarden "Field Tech" collection; KB public read; WordPress clear call-to-action.

---

## HaaS / Bundled Financing (Finance Notes)

- **TCO over 36–48 months:** Hardware (COGS), support labor ($25–$100/device/mo), labor ~$60/hr, overhead and finance costs.
- **Markup:** Ensure monthly fee covers depreciation, service labor, and target profit while remaining affordable.
- **Implementation:** Generic hardware templates in ERPNext; quote → purchase → add serial to Asset → convert to Lease Agreement; recurring invoice + Stripe.
