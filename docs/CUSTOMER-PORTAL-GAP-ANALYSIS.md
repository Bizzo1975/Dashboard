# Customer Portal — Gap Analysis
**Updated: April 2026** | portal.kecktech.net | Next.js 14, port 3012

---

## Current State

The portal is deployed and functional with three data panels:

| Panel | Status | Source | Notes |
|-------|--------|--------|-------|
| Support Tickets | ✅ Working | Zammad REST API | Shows open tickets by email, links to Zammad |
| Outstanding Invoices | ✅ Working | ERPNext Sales Invoice API | Shows unpaid invoices; links to ERPNext to pay |
| Remote Support (RustDesk) | ⚠️ Broken | Missing route | `/api/rustdesk/route.ts` does not exist — 404 |
| Resources (quick links) | ✅ Working | Static links | Help Center, Vault, Tickets, Website |

Authentication is handled by Authelia forward-auth headers (`remote-email`, `remote-name`). The portal correctly gates all data behind authentication and degrades gracefully when unauthenticated.

---

## Full Vision vs. Current State

| Feature | Vision | Current | Gap |
|---------|--------|---------|-----|
| Support tickets | All tickets, open + closed, with detail | Open tickets only (5 max) | Show all tickets, paginate, add status filter |
| Invoice — outstanding | Outstanding invoices | ✅ Working | — |
| Invoice — history | All invoices (paid + outstanding) | Outstanding only | Add paid invoice history section |
| Invoice — pay online | Stripe payment link per invoice | Links to ERPNext only | Add Stripe payment link per invoice |
| Active service contracts | Show MSP plan, included services | Not present | Add subscription/contract card from ERPNext |
| Service plan summary | What's included in their plan | Not present | Add plan details card |
| TRMM device health | Per-client device status (online/offline) | Not present | Add TRMM panel using TRMM API |
| RustDesk setup | Download + server config | API route missing (404) | Fix: create `/api/rustdesk/route.ts` |
| Knowledge base access | Public articles always, premium gated | Public links only | Add BookStack API token-gated article access |
| Account profile | Client can see/update contact info | Not present | Add profile view from ERPNext Customer |
| Contact support | Link to Zammad ticket form | ✅ Present | — |
| Morning briefing widget | Today's key info for client | Not present | Optional enhancement |

---

## Priority Build Order

### Fix 1 — RustDesk API Route (Blocking, 30 min)

Create `customer-portal/app/api/rustdesk/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  const serverHost = process.env.RUSTDESK_SERVER_HOST || "";
  const publicKey = process.env.RUSTDESK_PUBLIC_KEY || "";
  const configured = !!(serverHost && publicKey);

  return NextResponse.json({
    serverHost,
    publicKey,
    idPort: 21116,
    relayPort: 21117,
    downloadUrl: "https://github.com/rustdesk/rustdesk/releases/latest",
    configured,
  });
}
```

Add to `docker-compose.yml` environment for `kecktech-portal`:
```yaml
- RUSTDESK_SERVER_HOST=${RUSTDESK_SERVER_HOST}
- RUSTDESK_PUBLIC_KEY=${RUSTDESK_PUBLIC_KEY}
```

### Fix 2 — Active Contracts Card (High, 2–3 hrs)

Add new API route: `/api/contracts/route.ts`
- Fetch from ERPNext: `GET /api/resource/Subscription?filters=[["party","=","<customer>"]]`
- Display: active plan name, monthly rate, included services, next renewal date
- Map plan names to human-readable descriptions (MSP = "White Glove Managed IT — Unlimited remote support, 24/7 monitoring...")

### Fix 3 — Full Invoice History (Medium, 2 hrs)

Extend `/api/invoices/route.ts`:
- Add `?type=all` parameter to return all invoices (not just outstanding)
- Add new "Invoice History" section to portal page showing all invoices with status badges
- Add Stripe payment link column for outstanding invoices (once Stripe is configured)

### Fix 4 — TRMM Device Health Panel (Medium, 3–4 hrs)

Add new API route: `/api/devices/route.ts`
- Fetch from TRMM: `GET /api/v3/clients/{client_id}/agents/` (requires TRMM_API_KEY)
- Display: list of client's devices, online/offline status, last seen
- Map client's email/name to TRMM client group using ERPNext customer data

Env vars needed in portal container:
```yaml
- TRMM_URL=https://api.kecktech.net
- TRMM_API_KEY=${TRMM_API_KEY}
```

### Fix 5 — Invoice Pay Online (Medium, 2–3 hrs after Stripe setup)

For each outstanding invoice:
- Generate Stripe Payment Link via Stripe API (or pre-configured product link)
- Display "Pay Now" button on each invoice row
- On payment: Stripe webhook → n8n → ERPNext records payment automatically

### Fix 6 — BookStack Gated Content (Low, 4–6 hrs)

Add `/api/wiki/route.ts`:
- Fetch public BookStack pages via API (no auth required)
- For premium content: use BookStack API token stored per client in Vaultwarden
- Display: "Your Knowledge Base" section with bookshelf categories
- Gate premium articles behind "MSP clients only" check via Authelia groups

---

## Environment Variables Required (portal container)

Current `.env` / `docker-compose.yml` environment for `kecktech-portal`:

```yaml
- NODE_ENV=production
- PORTAL_BASE_URL=http://kecktech-portal:3012
- ZAMMAD_URL=https://tickets.kecktech.net         # ✅ set
- ZAMMAD_API_TOKEN=${ZAMMAD_API_TOKEN}             # ✅ set
- ERPNEXT_URL=https://ops.kecktech.net             # ✅ set
- ERPNEXT_API_KEY=${ERPNEXT_API_KEY}               # ✅ set
- ERPNEXT_API_SECRET=${ERPNEXT_API_SECRET}         # ✅ set
- RUSTDESK_SERVER_HOST=${RUSTDESK_SERVER_HOST}     # ✅ set (but route missing)
- RUSTDESK_PUBLIC_KEY=${RUSTDESK_PUBLIC_KEY}       # ✅ set (but route missing)
```

Add after Stripe + TRMM:
```yaml
- STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}           # ❌ not set
- TRMM_URL=https://api.kecktech.net                # ❌ not set
- TRMM_API_KEY=${TRMM_API_KEY}                     # ❌ not set
- BOOKSTACK_URL=https://bookstack.kecktech.net     # ❌ not set
- BOOKSTACK_TOKEN_ID=${BOOKSTACK_TOKEN_ID}         # ❌ not set
- BOOKSTACK_TOKEN_SECRET=${BOOKSTACK_TOKEN_SECRET} # ❌ not set
```

---

## Customer Identity Resolution

**Current problem:** The portal uses `displayName` (from `remote-name` header) to query ERPNext invoices by customer name. This is fragile — name format may not match ERPNext customer name exactly.

**Recommended fix:** Store ERPNext Customer ID in LLDAP user attributes when onboarding a client. Fetch it via the portal using the `remote-email` header to look up the correct customer record.

Long-term: Add a `customer_id` field to the LLDAP user schema and populate it during the customer onboarding flow in the ops dashboard.

---

## UI Enhancements (Post-Fix)

Once data gaps are closed, improve the portal layout:

1. **Dashboard summary card** at top: contract type, next invoice date, device count, open tickets
2. **Navigation tabs:** Overview | Tickets | Invoices | Devices | Resources
3. **Mobile responsive** — current grid layout needs testing on mobile (MSP clients may check on phones)
4. **Dark/light mode toggle** — current fixed dark theme; seniors may prefer light
5. **Accessibility audit** — run Axe on the portal; senior clients require WCAG AA minimum

---

## Ready-to-Deploy Code (Manual Step Required)

Desktop Commander cannot create new directories. The following files need to be created manually
on the VM or via `mkdir` before writing. Commands to run on the server:

```bash
cd /home/vboxuser/Dashboard/customer-portal/app/api
mkdir -p contracts devices
```

Then create `contracts/route.ts` with this content:

```typescript
import { NextRequest, NextResponse } from "next/server";

const ERP_BASE = process.env.ERPNEXT_URL || "https://ops.kecktech.net";
const ERP_TOKEN = process.env.ERPNEXT_API_KEY || "";
const ERP_SECRET = process.env.ERPNEXT_API_SECRET || "";

const PLAN_DESCRIPTIONS: Record<string, { title: string; features: string[] }> = {
  "White Glove MSP": {
    title: "White Glove Managed IT",
    features: [
      "Unlimited remote support (8am–6pm CT, Mon–Fri)",
      "24/7 device monitoring via Tactical RMM",
      "Automated patch management",
      "Endpoint protection + ransomware defense",
      "Password management via Vaultwarden",
      "Monthly device health report",
      "Priority SLA: P1=2hr, P2=4hr, P3=24hr",
    ],
  },
  "HaaS Device Subscription": {
    title: "Hardware-as-a-Service",
    features: [
      "Enterprise-grade refurbished hardware",
      "Zero-wiped to NIST 800-88 standard",
      "Remote management agent included",
      "90-day hardware warranty",
      "Next-business-day swap for failed units",
    ],
  },
  "Senior Technology Concierge": {
    title: "Senior Technology Concierge",
    features: [
      "Monthly device health check",
      "Scam and phishing protection",
      "Video call setup and support",
      "Emergency IT response (same business day)",
      "Quarterly security review",
    ],
  },
};

export async function GET(req: NextRequest) {
  const customer = req.nextUrl.searchParams.get("customer");
  if (!customer) return NextResponse.json({ error: "Missing customer" }, { status: 400 });
  if (!ERP_TOKEN || !ERP_SECRET) return NextResponse.json({ error: "ERPNext not configured" }, { status: 503 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const fields = encodeURIComponent(JSON.stringify(["name","party","status","current_invoice_start","current_invoice_end","plans"]));
    const filters = encodeURIComponent(JSON.stringify([["party","=",customer],["status","=","Active"]]));

    const res = await fetch(`${ERP_BASE}/api/resource/Subscription?fields=${fields}&filters=${filters}&limit=10`, {
      headers: { Authorization: `token ${ERP_TOKEN}:${ERP_SECRET}`, "Content-Type": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return NextResponse.json({ error: `ERPNext: ${res.status}` }, { status: 502 });

    const json = await res.json();
    const subscriptions = (json.data || []).map((sub: Record<string, unknown>) => {
      const plans = Array.isArray(sub.plans) ? sub.plans : [];
      const planName = plans.length > 0 ? ((plans[0] as Record<string,string>).plan || "Unknown") : "Unknown";
      const details = PLAN_DESCRIPTIONS[planName] || { title: planName, features: [] };
      return { name: sub.name, party: sub.party, status: sub.status, planName, planTitle: details.title, features: details.features, periodStart: sub.current_invoice_start, periodEnd: sub.current_invoice_end };
    });
    return NextResponse.json(subscriptions);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
```

Create `devices/route.ts` with this content:

```typescript
import { NextRequest, NextResponse } from "next/server";

const TRMM_BASE = process.env.TRMM_URL || "https://api.kecktech.net";
const TRMM_KEY = process.env.TRMM_API_KEY || "";
const ERP_BASE = process.env.ERPNEXT_URL || "https://ops.kecktech.net";
const ERP_TOKEN = process.env.ERPNEXT_API_KEY || "";
const ERP_SECRET = process.env.ERPNEXT_API_SECRET || "";

export async function GET(req: NextRequest) {
  const customer = req.nextUrl.searchParams.get("customer");
  if (!customer) return NextResponse.json({ error: "Missing customer" }, { status: 400 });
  if (!TRMM_KEY) return NextResponse.json({ error: "TRMM not configured" }, { status: 503 });

  try {
    // Get all TRMM clients to find matching client group by name
    const clientsRes = await fetch(`${TRMM_BASE}/api/v3/clients/`, {
      headers: { "X-API-KEY": TRMM_KEY },
    });
    if (!clientsRes.ok) return NextResponse.json({ error: `TRMM clients: ${clientsRes.status}` }, { status: 502 });
    const clients: Array<{id: number; name: string}> = await clientsRes.json();
    
    // Fuzzy match customer name to TRMM client
    const match = clients.find(c =>
      c.name.toLowerCase().includes(customer.toLowerCase()) ||
      customer.toLowerCase().includes(c.name.toLowerCase())
    );
    if (!match) return NextResponse.json([]);

    // Get agents for matched client
    const agentsRes = await fetch(`${TRMM_BASE}/api/v3/clients/${match.id}/agents/`, {
      headers: { "X-API-KEY": TRMM_KEY },
    });
    if (!agentsRes.ok) return NextResponse.json({ error: `TRMM agents: ${agentsRes.status}` }, { status: 502 });
    
    const agents: Array<Record<string,unknown>> = await agentsRes.json();
    const devices = agents.map(a => ({
      id: a.agent_id,
      hostname: a.hostname,
      description: a.description,
      status: a.status,
      online: a.status === "online",
      lastSeen: a.last_seen,
      operatingSystem: a.operating_system,
      cpuModel: a.cpu_model,
      alerts: a.alert_count || 0,
    }));
    return NextResponse.json(devices);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
```

After creating both files, rebuild the portal:
```bash
cd /home/vboxuser/Dashboard
docker compose build kecktech-portal
docker compose up -d kecktech-portal
```
