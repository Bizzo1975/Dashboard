import "./globals.css";
import { AppTile } from "@/components/AppTile";

const services = [
  {
    name: "ERPNext",
    description: "CRM, Billing, HaaS",
    url: "https://ops.kecktech.net",
    healthUrl: "http://frappe_docker-frontend-1:8080/api/method/ping",
    icon: "briefcase",
    color: "#0089ff",
  },
  {
    name: "FreeScout",
    description: "Help Desk",
    url: "https://helpdesk.kecktech.net",
    healthUrl: "http://freescout:80/",
    icon: "headset",
    color: "#34d399",
  },
  {
    name: "Vaultwarden",
    description: "Secrets & Profiles",
    url: "https://vault.kecktech.net",
    healthUrl: "http://vaultwarden:80/alive",
    icon: "lock",
    color: "#818cf8",
  },
  {
    name: "n8n",
    description: "Workflows & SMS",
    url: "https://n8n.kecktech.net",
    healthUrl: "http://n8n:5678/healthz",
    icon: "workflow",
    color: "#ff6d5a",
  },
  {
    name: "WordPress",
    description: "Public Website",
    url: "https://kecktech.net",
    healthUrl: "http://wordpress:80/",
    icon: "globe",
    color: "#21759b",
  },
  {
    name: "WikiJS",
    description: "Knowledge Base",
    url: "https://help.kecktech.net",
    healthUrl: "http://wikijs:3000/healthz",
    icon: "book",
    color: "#1976d2",
  },
  {
    name: "Umami",
    description: "Analytics",
    url: "https://stats.kecktech.net",
    healthUrl: "http://umami:3000/api/heartbeat",
    icon: "chart",
    color: "#f59e0b",
  },
  {
    name: "Tactical RMM",
    description: "Remote Monitoring",
    url: "https://rmm.kecktech.net",
    healthUrl: "https://trmm-nginx:4443/",
    icon: "monitor",
    color: "#6366f1",
  },
  {
    name: "Mailcow",
    description: "Email Server",
    url: "https://mail.kecktech.net",
    healthUrl: "http://mailcowdockerized-nginx-mailcow-1:8081/",
    icon: "mail",
    color: "#f43f5e",
  },
  {
    name: "Portainer",
    description: "Container Management",
    url: "https://127.0.0.1:9443",
    healthUrl: "http://portainer:9000/api/system/status",
    icon: "container",
    color: "#13bef9",
  },
  {
    name: "Traefik",
    description: "Reverse Proxy",
    url: "https://traefik.kecktech.net",
    healthUrl: "http://traefik:80/ping",
    icon: "route",
    color: "#38a3a5",
  },
  {
    name: "Authelia",
    description: "SSO Gateway",
    url: "https://auth.kecktech.net",
    healthUrl: "http://authelia:9091/api/health",
    icon: "shield",
    color: "#1a56db",
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function checkHealth(
  healthUrl: string
): Promise<{ status: "up" | "down"; latency: number }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(healthUrl, {
      signal: controller.signal,
      cache: "no-store",
      redirect: "manual",
    });
    clearTimeout(timeout);
    // 2xx = up, 3xx redirect = also up (app is responding)
    const up = res.status < 400;
    return { status: up ? "up" : "down", latency: Date.now() - start };
  } catch {
    return { status: "down", latency: Date.now() - start };
  }
}

export default async function Dashboard() {
  const results = await Promise.all(
    services.map(async (svc) => {
      const health = await checkHealth(svc.healthUrl);
      return { ...svc, ...health };
    })
  );

  const upCount = results.filter((r) => r.status === "up").length;
  const totalCount = results.length;
  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      {/* Header */}
      <header
        style={{
          background: "#1e293b",
          borderBottom: "1px solid #334155",
          padding: "20px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              background: "#fefdfd",
              borderRadius: "8px",
              padding: "6px 10px",
              lineHeight: 0,
            }}
            aria-label="Kecktech home"
          >
            {/* Logo asset: dashboard/public/brand/colored-logo.png (also at repo img/colored-logo.png) */}
            <img
              src="/brand/colored-logo.png"
              alt="Kecktech"
              width={200}
              height={56}
              style={{ height: 44, width: "auto", maxWidth: 220, display: "block" }}
            />
          </a>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#f1f5f9" }}>
              Dashboard
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#94a3b8" }}>
              Internal service overview
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: upCount === totalCount ? "#34d399" : "#fbbf24",
            }}
          >
            {upCount}/{totalCount} Services Up
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            Last checked: {now}
          </div>
        </div>
      </header>

      {/* Tile Grid */}
      <main
        style={{
          padding: "32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {results.map((svc) => (
          <AppTile key={svc.name} {...svc} />
        ))}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          fontSize: "13px",
          color: "#475569",
        }}
      >
        Kecktech.net — Senior IT Support — Refresh page to update health status
      </footer>
    </div>
  );
}
