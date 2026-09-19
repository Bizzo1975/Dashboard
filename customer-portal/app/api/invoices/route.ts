import { NextRequest, NextResponse } from "next/server";

const ERP_BASE = process.env.ERPNEXT_URL || "https://ops.kecktech.net";
const ERP_TOKEN = process.env.ERPNEXT_API_KEY || "";
const ERP_SECRET = process.env.ERPNEXT_API_SECRET || "";

export async function GET(req: NextRequest) {
  const customer = req.nextUrl.searchParams.get("customer");
  if (!customer) {
    return NextResponse.json({ error: "Missing customer parameter" }, { status: 400 });
  }
  if (!ERP_TOKEN || !ERP_SECRET) {
    return NextResponse.json({ error: "ERPNext credentials not configured" }, { status: 503 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const fields = encodeURIComponent(
      JSON.stringify(["name", "posting_date", "grand_total", "outstanding_amount", "status", "currency"])
    );
    const filters = encodeURIComponent(
      JSON.stringify([["customer", "=", customer], ["docstatus", "=", 1]])
    );

    const res = await fetch(
      `${ERP_BASE}/api/resource/Sales%20Invoice?fields=${fields}&filters=${filters}&order_by=posting_date+desc&limit=20`,
      {
        headers: {
          Authorization: `token ${ERP_TOKEN}:${ERP_SECRET}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `ERPNext: ${res.status}` }, { status: 502 });
    }

    const json = await res.json();
    return NextResponse.json(json.data ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
