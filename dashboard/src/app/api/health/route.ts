import { NextResponse } from "next/server";

const services: Record<string, string> = {
  erpnext: "http://ops.kecktech.net:8080/api/method/ping",
  freescout: "http://freescout:80/",
  vaultwarden: "http://vaultwarden:80/alive",
  n8n: "http://n8n:5678/healthz",
  wordpress: "http://wordpress:80/",
  wikijs: "http://wikijs:3000/healthz",
  umami: "http://umami:3000/api/heartbeat",
  traefik: "http://traefik:8080/ping",
  authelia: "http://authelia:9091/api/health",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service");

  if (service && services[service]) {
    const result = await checkOne(service, services[service]);
    return NextResponse.json(result);
  }

  // Check all services
  const results = await Promise.all(
    Object.entries(services).map(async ([name, url]) => checkOne(name, url))
  );

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

async function checkOne(name: string, url: string) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    return {
      name,
      status: res.ok ? ("up" as const) : ("down" as const),
      latency: Date.now() - start,
      statusCode: res.status,
    };
  } catch {
    return {
      name,
      status: "down" as const,
      latency: Date.now() - start,
      statusCode: 0,
    };
  }
}
