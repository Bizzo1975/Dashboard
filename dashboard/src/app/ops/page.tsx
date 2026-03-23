import { getUser } from "@/lib/auth";
import { getClientGroups } from "@/lib/trmm";
import { SERVICES } from "@/lib/services";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEV_COLOR: Record<string, string> = {
  critical: "#f87171",
  high: "#fb923c",
  warning: "#fbbf24",
  info: "#60a5fa",
};

async function checkHealth(healthUrl: string, healthHost?: string): Promise<{ up: boolean; latency: number }> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 4000);
    const headers = new Headers();
    if (healthHost) headers.set("Host", healthHost);
    const res = await fetch(healthUrl, { signal: controller.signal, cache: "no-store", redirect: "manual", headers });
    clearTimeout(t);
    return { up: res.status < 400, latency: Date.now() - start };
  } catch {
    return { up: false, latency: Date.now() - start };
  }
}

export default async function OpsPage() {
  const user = await getUser();
  if (!user.canOps) redirect("/");

  const [{ groups, error: trmmErr }, stackResults] = await Promise.all([
    getClientGroups(),
    Promise.all(SERVICES.map(async (svc) => {
      const h = await checkHealth(svc.healthUrl, svc.healthHost);
      return { ...svc, ...h };
    })),
  ]);

  // Alert severity summary across all clients
  const allAlerts = groups.flatMap((g) => g.alerts);
  const sevCount = { critical: 0, high: 0, warning: 0, info: 0 };
  for (const a of allAlerts) {
    const s = (a.severity || "info").toLowerCase() as keyof typeof sevCount;
    if (s in sevCount) sevCount[s]++;
  }

  const stackUp = stackResults.filter((s) => s.up).length;

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#f1f5f9" }}>Operations / SOC</h1>
      <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "13px" }}>
        Client health · Alert monitoring · Stack status
      </p>

      {/* ── Alert Summary Bar ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "10px",
          padding: "14px 20px",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8" }}>Active Alerts:</span>
        {[
          { key: "critical", label: "Critical", color: "#f87171" },
          { key: "high", label: "High", color: "#fb923c" },
          { key: "warning", label: "Warning", color: "#fbbf24" },
          { key: "info", label: "Info", color: "#60a5fa" },
        ].map(({ key, label, color }) => {
          const count = sevCount[key as keyof typeof sevCount];
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: color,
                  boxShadow: count > 0 && key === "critical" ? `0 0 6px ${color}` : "none",
                }}
              />
              <span style={{ fontSize: "13px", color: count > 0 ? color : "#475569", fontWeight: count > 0 ? 600 : 400 }}>
                {count} {label}
              </span>
            </div>
          );
        })}
        {allAlerts.length === 0 && (
          <span style={{ fontSize: "13px", color: "#34d399" }}>✅ All clients clear</span>
        )}
        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#475569" }}>
          {groups.length} clients · {groups.reduce((s, g) => s + g.agents.length, 0)} agents
        </div>
      </div>

      {trmmErr && (
        <div style={{ background: "#1e293b", border: "1px solid #f8717144", borderRadius: "10px", padding: "16px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
          ⚠ TRMM: {trmmErr}
        </div>
      )}

      {/* ── Client Health Grid ────────────────────────────────────────────── */}
      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: 600, color: "#e2e8f0" }}>
          🏢 Client Health
        </h2>

        {groups.length === 0 && !trmmErr && (
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "24px", textAlign: "center", color: "#475569", fontSize: "13px" }}>
            No clients found in Tactical RMM
          </div>
        )}

        {groups.map((group) => {
          const hasIssue = group.offline > 0 || group.alerts.length > 0;
          const allOnline = group.offline === 0 && group.alerts.length === 0;
          const borderColor = hasIssue ? (group.alerts.some((a) => a.severity?.toLowerCase() === "critical") ? "#f87171" : "#fbbf24") : "#334155";
          const bgAccent = hasIssue ? "#1c0d0d" : "#1e293b";

          return (
            <div
              key={group.client_name}
              style={{
                background: bgAccent,
                border: `1px solid ${borderColor}`,
                borderRadius: "10px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              {/* Client header row */}
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #1e293b",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: allOnline ? "#34d399" : hasIssue ? "#f87171" : "#fbbf24",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9" }}>{group.client_name}</span>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "12px" }}>
                  <span style={{ color: "#34d399" }}>{group.online} online</span>
                  {group.offline > 0 && <span style={{ color: "#f87171" }}>{group.offline} offline</span>}
                  {group.alerts.length > 0 && <span style={{ color: "#fbbf24" }}>{group.alerts.length} alerts</span>}
                  <a
                    href="https://vault.kecktech.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "11px", color: "#64748b", border: "1px solid #334155", borderRadius: "4px", padding: "2px 8px", textDecoration: "none" }}
                  >
                    🔑 Vault
                  </a>
                </div>
              </div>

              {/* Agent rows */}
              <div style={{ padding: "8px 16px" }}>
                {group.agents.map((agent) => {
                  const online = agent.status === "online";
                  const agentAlerts = group.alerts.filter((a) => a.hostname === agent.hostname);
                  return (
                    <div
                      key={agent.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "7px 0",
                        borderBottom: "1px solid #0f172a",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: online ? "#34d399" : "#f87171",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0", minWidth: "160px" }}>{agent.hostname}</span>
                      <span style={{ fontSize: "11px", color: "#475569", flex: 1, minWidth: "120px" }}>{agent.operating_system}</span>
                      <span style={{ fontSize: "11px", color: online ? "#34d399" : "#f87171" }}>{agent.status}</span>
                      {agentAlerts.length > 0 && (
                        <span style={{ fontSize: "11px", color: "#fbbf24" }}>⚠ {agentAlerts.length} alert{agentAlerts.length > 1 ? "s" : ""}</span>
                      )}
                      {agent.pending_actions_count > 0 && (
                        <span style={{ fontSize: "11px", color: "#a78bfa" }}>⏳ {agent.pending_actions_count} pending</span>
                      )}
                      <span style={{ fontSize: "11px", color: "#334155", marginLeft: "auto" }}>
                        {agent.last_seen ? new Date(agent.last_seen).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "short", timeStyle: "short" }) : "—"}
                      </span>
                    </div>
                  );
                })}

                {/* Active alerts for this client */}
                {group.alerts.length > 0 && (
                  <div style={{ marginTop: "8px", paddingTop: "8px" }}>
                    {group.alerts.map((alert) => {
                      const color = SEV_COLOR[(alert.severity || "info").toLowerCase()] || "#94a3b8";
                      return (
                        <div
                          key={alert.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            fontSize: "12px",
                            padding: "5px 0",
                            borderLeft: `3px solid ${color}`,
                            paddingLeft: "10px",
                            marginBottom: "4px",
                          }}
                        >
                          <span style={{ color, fontWeight: 600, flexShrink: 0 }}>{alert.severity}</span>
                          <span style={{ color: "#94a3b8" }}>{alert.hostname}</span>
                          <span style={{ color: "#64748b", flex: 1 }}>{alert.message}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Stack Health ──────────────────────────────────────────────────── */}
      <section>
        <h2 style={{ margin: "0 0 14px", fontSize: "16px", fontWeight: 600, color: "#e2e8f0" }}>
          🖥️ Stack Health — {stackUp}/{SERVICES.length} up
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {stackResults.map((svc) => (
            <a
              key={svc.name}
              href={svc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#1e293b",
                border: `1px solid ${svc.up ? "#334155" : "#f8717144"}`,
                borderRadius: "8px",
                padding: "10px 14px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: svc.up ? "#34d399" : "#f87171",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{svc.name}</div>
                <div style={{ fontSize: "11px", color: svc.up ? "#475569" : "#f87171" }}>
                  {svc.up ? `${svc.latency}ms` : "Down"}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
