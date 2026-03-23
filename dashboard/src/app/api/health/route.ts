import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/services";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceName = searchParams.get("service");

  if (serviceName) {
    const def = SERVICES.find((s) => s.name.toLowerCase() === serviceName.toLowerCase());
    if (def) {
      const result = await checkOne(def);
      return NextResponse.json(result);
    }
  }

  const results = await Promise.all(SERVICES.map(checkOne));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    services: results,
    summary: {
      total: results.length,
      up: results.filter((r) => r.status === "up").length,
      down: results.filter((r) => r.status === "down").length,
    },
  });
}

async function checkOne(def: { name: string; healthUrl: string; healthHost?: string }) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const headers = new Headers();
    if (def.healthHost) {
      headers.set("Host", def.healthHost);
    }
    const res = await fetch(def.healthUrl, {
      signal: controller.signal,
      cache: "no-store",
      redirect: "manual",
      headers,
    });
    clearTimeout(timeout);
    const up = res.status < 400;
    return {
      name: def.name,
      status: up ? ("up" as const) : ("down" as const),
      latency: Date.now() - start,
      statusCode: res.status,
    };
  } catch {
    return {
      name: def.name,
      status: "down" as const,
      latency: Date.now() - start,
      statusCode: 0,
    };
  }
}
