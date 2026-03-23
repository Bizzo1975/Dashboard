import { getUser } from "@/lib/auth";
import { getOpenTickets } from "@/lib/zammad";
import { getActiveAlerts } from "@/lib/trmm";
import { getCustomers } from "@/lib/erpnext";
import { TimeEntryForm } from "@/components/support/TimeEntryForm";
import { AcknowledgeButton } from "@/components/support/AcknowledgeButton";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SEV_COLOR: Record<string, string> = {
  critical: "#f87171",
  high: "#fb923c",
  warning: "#fbbf24",
  info: "#60a5fa",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, link, linkLabel }: { title: string; link?: string; linkLabel?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <h2 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>{title}</h2>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#3b82f6" }}>
          {linkLabel || "Open ↗"}
        </a>
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <Card style={{ textAlign: "center", color: "#475569", fontSize: "13px", padding: "24px" }}>
      {text}
    </Card>
  );
}

function ErrorCard({ msg }: { msg: string }) {
  return (
    <Card style={{ color: "#f87171", fontSize: "13px" }}>⚠ {msg}</Card>
  );
}

function elapsed(hours: number): string {
  if (hours < 1) return "< 1 hr";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "#f87171",
  normal: "#fbbf24",
  low: "#64748b",
};

export default async function SupportPage() {
  const user = await getUser();
  if (!user.canSupport) redirect("/");

  const [{ tickets, error: tErr }, { alerts, error: aErr }, { customers }] = await Promise.all([
    getOpenTickets(),
    getActiveAlerts(),
    getCustomers(),
  ]);

  // Severity counts for alert header
  const sevCount = { critical: 0, high: 0, warning: 0, info: 0 };
  for (const a of alerts) {
    const s = (a.severity || "info").toLowerCase() as keyof typeof sevCount;
    if (s in sevCount) sevCount[s]++;
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#f1f5f9" }}>
        Support Desk
      </h1>
      <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: "13px" }}>
        Live monitoring · Inline tickets · Remote support · Time tracking
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 4.5fr 2.5fr", gap: "20px", alignItems: "start" }}>

        {/* ── Column 1: TRMM Alerts ──────────────────────────────────────── */}
        <section>
          <SectionHeader
            title={`🚨 Alerts${alerts.length > 0 ? ` (${alerts.length})` : ""}`}
            link="https://rmm.kecktech.net"
            linkLabel="Open TRMM ↗"
          />

          {/* Severity badges */}
          {alerts.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
              {sevCount.critical > 0 && <Badge label={`${sevCount.critical} Critical`} color="#f87171" />}
              {sevCount.high > 0 && <Badge label={`${sevCount.high} High`} color="#fb923c" />}
              {sevCount.warning > 0 && <Badge label={`${sevCount.warning} Warning`} color="#fbbf24" />}
              {sevCount.info > 0 && <Badge label={`${sevCount.info} Info`} color="#60a5fa" />}
            </div>
          )}

          {aErr && <ErrorCard msg={aErr} />}
          {!aErr && alerts.length === 0 && <Empty text="✅ No active alerts" />}

          {alerts.map((a) => {
            const color = SEV_COLOR[(a.severity || "info").toLowerCase()] || "#94a3b8";
            return (
              <div
                key={a.id}
                style={{
                  background: "#1e293b",
                  border: `1px solid ${color}33`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9" }}>{a.hostname}</span>
                  <Badge label={a.severity || "unknown"} color={color} />
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>{a.message}</div>
                <div style={{ fontSize: "11px", color: "#475569" }}>
                  {a.alert_type} · {new Date(a.alert_time).toLocaleString("en-US", { timeZone: "America/Chicago" })}
                </div>
                <AcknowledgeButton alertId={a.id} />
              </div>
            );
          })}
        </section>

        {/* ── Column 2: Open Tickets ─────────────────────────────────────── */}
        <section>
          <SectionHeader
            title={`🎧 Open Tickets${tickets.length > 0 ? ` (${tickets.length})` : ""}`}
            link="https://tickets.kecktech.net"
            linkLabel="Zammad ↗"
          />

          {tErr && <ErrorCard msg={tErr} />}
          {!tErr && tickets.length === 0 && <Empty text="✅ No open tickets" />}

          {tickets.map((t) => {
            const priorityColor = PRIORITY_COLOR[t.priority] || "#64748b";
            const stateColor = t.state === "open" || t.state === "new" ? "#34d399" : "#94a3b8";
            return (
              <div
                key={t.id}
                style={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderLeft: t.priority === "high" ? "4px solid #f87171" : "1px solid #334155",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "8px",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9" }}>
                    #{t.number} {t.title}
                  </span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0, marginLeft: "8px" }}>
                    <Badge label={t.state} color={stateColor} />
                    <Badge label={t.priority} color={priorityColor} />
                    <span style={{ fontSize: "11px", color: "#475569" }}>{elapsed(t.elapsedHours)}</span>
                  </div>
                </div>

                {/* Customer + group */}
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                  {t.customerName}
                  {t.customerEmail ? ` · ${t.customerEmail}` : ""}
                  {t.group ? ` · ${t.group}` : ""}
                </div>

                {/* Action link */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href={`https://tickets.kecktech.net/#ticket/zoom/${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "11px", color: "#3b82f6", textDecoration: "none", flexShrink: 0 }}
                  >
                    Open in Zammad ↗
                  </a>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Column 3: Quick Actions ────────────────────────────────────── */}
        <section>
          {/* Time Entry */}
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>
              ⏱ Log Time
            </h2>
            <TimeEntryForm customers={customers} />
          </div>

          {/* Quick Links */}
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>
              🔗 Quick Access
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { href: "https://rmm.kecktech.net", label: "Tactical RMM", icon: "🖥️" },
                { href: "https://tickets.kecktech.net", label: "Zammad (Tickets)", icon: "🎧" },
                { href: "https://vault.kecktech.net", label: "Vaultwarden (Client Profiles)", icon: "🔑" },
                { href: "https://ops.kecktech.net", label: "ERPNext (Timesheets)", icon: "📋" },
                { href: "https://help.kecktech.net/en/staff-guide/support-desk", label: "Staff Guide ↗", icon: "📖" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 10px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
