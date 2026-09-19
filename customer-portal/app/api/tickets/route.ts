import { NextRequest, NextResponse } from "next/server";

const ZAMMAD_BASE = process.env.ZAMMAD_URL || "https://tickets.kecktech.net";
const ZAMMAD_TOKEN = process.env.ZAMMAD_API_TOKEN || "";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }
  if (!ZAMMAD_TOKEN) {
    return NextResponse.json({ error: "Zammad API token not configured" }, { status: 503 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `${ZAMMAD_BASE}/api/v1/tickets/search?query=article.to:${encodeURIComponent(email)}&sort_by=updated_at&order_by=desc&limit=20`,
      {
        headers: {
          Authorization: `Token token=${ZAMMAD_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: `Zammad: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const tickets = Array.isArray(data) ? data : data?.tickets ?? [];
    return NextResponse.json(tickets);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
