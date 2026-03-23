const BASE = process.env.ERPNEXT_URL || "http://frappe_docker-frontend-1:8080";
const KEY = process.env.ERPNEXT_API_KEY || "";
const SECRET = process.env.ERPNEXT_API_SECRET || "";

function authHeader() {
  return {
    Authorization: `token ${KEY}:${SECRET}`,
    "Content-Type": "application/json",
  };
}

export type Invoice = {
  name: string;
  customer: string;
  status: string;
  grand_total: number;
  outstanding_amount: number;
  due_date: string;
  posting_date: string;
};

export type PurchaseInvoice = {
  name: string;
  supplier: string;
  status: string;
  grand_total: number;
  outstanding_amount: number;
  due_date: string;
  posting_date: string;
};

export type Lead = {
  name: string;
  lead_name: string;
  company_name: string;
  email_id: string;
  phone: string;
  status: string;
  utm_source: string;
  creation: string;
  modified: string;
};

export type Customer = {
  name: string;
  customer_name: string;
};

export type TimesheetEntry = {
  name: string;
  employee_name: string;
  customer: string;
  total_hours: number;
  start_date: string;
  docstatus: number; // 0=draft, 1=submitted/billed
  note?: string;
};

export type Subscription = {
  name: string;
  party: string;
  status: string;
};

async function erpFetch<T>(path: string): Promise<{ data: T | null; error?: string }> {
  if (!KEY || !SECRET) return { data: null, error: "ERPNext credentials not configured" };
  try {
    const res = await fetch(`${BASE}${path}`, { headers: authHeader(), cache: "no-store" });
    if (!res.ok) return { data: null, error: `ERPNext HTTP ${res.status}` };
    const json = await res.json();
    return { data: json.data ?? json };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

// ── Sales Invoices (AR) ───────────────────────────────────────────────────────

export async function getOpenInvoices(): Promise<{ invoices: Invoice[]; error?: string }> {
  const filters = encodeURIComponent(JSON.stringify([["status", "in", ["Unpaid", "Overdue", "Partly Paid"]]]));
  const fields = encodeURIComponent(JSON.stringify(["name","customer","status","grand_total","outstanding_amount","due_date","posting_date"]));
  const { data, error } = await erpFetch<Invoice[]>(`/api/resource/Sales Invoice?filters=${filters}&fields=${fields}&limit=100&order_by=due_date asc`);
  return { invoices: data ?? [], error };
}

// ── Purchase Invoices (AP) ────────────────────────────────────────────────────

export async function getPurchaseInvoices(): Promise<{ invoices: PurchaseInvoice[]; error?: string }> {
  const filters = encodeURIComponent(JSON.stringify([["status", "!=", "Paid"]]));
  const fields = encodeURIComponent(JSON.stringify(["name","supplier","status","grand_total","outstanding_amount","due_date","posting_date"]));
  const { data, error } = await erpFetch<PurchaseInvoice[]>(`/api/resource/Purchase Invoice?filters=${filters}&fields=${fields}&limit=50&order_by=due_date asc`);
  return { invoices: data ?? [], error };
}

// ── Timesheets ────────────────────────────────────────────────────────────────

export async function getTimesheets(): Promise<{ timesheets: TimesheetEntry[]; error?: string }> {
  const fields = encodeURIComponent(JSON.stringify(["name","employee_name","customer","total_hours","start_date","docstatus","note"]));
  const { data, error } = await erpFetch<TimesheetEntry[]>(`/api/resource/Timesheet?fields=${fields}&limit=100&order_by=start_date desc`);
  return { timesheets: data ?? [], error };
}

export async function createTimesheet(payload: {
  customer: string;
  hours: number;
  description: string;
  date: string;
}): Promise<{ name?: string; error?: string }> {
  if (!KEY || !SECRET) return { error: "ERPNext credentials not configured" };
  try {
    const body = {
      doctype: "Timesheet",
      customer: payload.customer,
      start_date: payload.date,
      time_logs: [
        {
          activity_type: "Support",
          from_time: `${payload.date} 08:00:00`,
          to_time: (() => {
            const totalMins = Math.round(payload.hours * 60);
            const h = 8 + Math.floor(totalMins / 60);
            const m = totalMins % 60;
            return `${payload.date} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
          })(),
          hours: payload.hours,
          description: payload.description,
        },
      ],
    };
    const res = await fetch(`${BASE}/api/resource/Timesheet`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      return { error: `ERPNext HTTP ${res.status}: ${txt.slice(0, 200)}` };
    }
    const data = await res.json();
    return { name: data.data?.name };
  } catch (e) {
    return { error: String(e) };
  }
}

// ── Customers ─────────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<{ customers: Customer[]; error?: string }> {
  const fields = encodeURIComponent(JSON.stringify(["name","customer_name"]));
  const { data, error } = await erpFetch<Customer[]>(`/api/resource/Customer?fields=${fields}&limit=200&order_by=customer_name asc`);
  return { customers: data ?? [], error };
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<{ leads: Lead[]; error?: string }> {
  const fields = encodeURIComponent(JSON.stringify(["name","lead_name","company_name","email_id","phone","status","utm_source","creation","modified"]));
  const { data, error } = await erpFetch<Lead[]>(`/api/resource/Lead?fields=${fields}&limit=100&order_by=modified desc`);
  return { leads: data ?? [], error };
}

export async function createLead(payload: {
  lead_name: string;
  company_name?: string;
  phone?: string;
  email_id?: string;
  source?: string;
  notes?: string;
}): Promise<{ name?: string; error?: string }> {
  if (!KEY || !SECRET) return { error: "ERPNext credentials not configured" };
  try {
    const body = { doctype: "Lead", ...payload };
    const res = await fetch(`${BASE}/api/resource/Lead`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      return { error: `ERPNext HTTP ${res.status}: ${txt.slice(0, 200)}` };
    }
    const data = await res.json();
    return { name: data.data?.name };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function updateLead(
  name: string,
  patch: { status?: string; notes?: string }
): Promise<{ error?: string }> {
  if (!KEY || !SECRET) return { error: "ERPNext credentials not configured" };
  try {
    const res = await fetch(`${BASE}/api/resource/Lead/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(patch),
    });
    if (!res.ok) return { error: `ERPNext HTTP ${res.status}` };
    return {};
  } catch (e) {
    return { error: String(e) };
  }
}

// Known monthly prices per Subscription Plan name (matches ERPNext items)
const PLAN_PRICES: Record<string, number> = {
  "SVC-MSP": 199,
  "SVC-HAAS": 149,
  "SVC-SENIOR": 79,
  "SVC-HOSTING": 49,
  "SVC-MSP-SEC": 49,
};

// ── Subscriptions (MRR / ARR) ─────────────────────────────────────────────────

export async function getSubscriptions(): Promise<{ subscriptions: Subscription[]; mrr: number; arr: number; error?: string }> {
  const filters = encodeURIComponent(JSON.stringify([["status", "=", "Active"]]));
  const fields = encodeURIComponent(JSON.stringify(["name","party","status"]));
  const { data, error } = await erpFetch<Subscription[]>(`/api/resource/Subscription?filters=${filters}&fields=${fields}&limit=200`);
  const subscriptions = data ?? [];

  if (subscriptions.length === 0 || !KEY || !SECRET) {
    return { subscriptions, mrr: 0, arr: 0, error };
  }

  // Fetch each subscription document to get the plans child table (list API omits child tables)
  let mrr = 0;
  try {
    const docs = await Promise.all(
      subscriptions.map((s) =>
        fetch(`${BASE}/api/resource/Subscription/${encodeURIComponent(s.name)}`, {
          headers: authHeader(),
          cache: "no-store",
        })
          .then((r) => r.json())
          .then((j) => j.data ?? null)
          .catch(() => null)
      )
    );
    for (const doc of docs) {
      if (!doc?.plans) continue;
      for (const line of doc.plans as Array<{ plan: string; qty: number }>) {
        const price = PLAN_PRICES[line.plan] ?? 0;
        mrr += price * (line.qty ?? 1);
      }
    }
  } catch {
    // If individual fetches fail, fall back to zero rather than crashing
  }

  return { subscriptions, mrr, arr: mrr * 12, error };
}
