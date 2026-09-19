import { headers } from "next/headers";

export const dynamic = "force-dynamic";

interface ZammadTicket {
  id: number;
  number: string;
  title: string;
  state: string;
  updated_at: string;
}

interface RustDeskInfo {
  serverHost: string;
  publicKey: string;
  idPort: number;
  relayPort: number;
  downloadUrl: string;
  configured: boolean;
}

interface Invoice {
  name: string;
  posting_date: string;
  grand_total: number;
  outstanding_amount: number;
  status: string;
  currency: string;
}

async function getTickets(email: string): Promise<{ data: ZammadTicket[]; error?: string }> {
  try {
    const baseUrl = process.env.PORTAL_BASE_URL || "http://localhost:3012";
    const res = await fetch(`${baseUrl}/api/tickets?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [], error: `Tickets: HTTP ${res.status}` };
    return { data: await res.json() };
  } catch (e) {
    return { data: [], error: String(e) };
  }
}

async function getRustDeskInfo(): Promise<RustDeskInfo | null> {
  try {
    const baseUrl = process.env.PORTAL_BASE_URL || "http://localhost:3012";
    const res = await fetch(`${baseUrl}/api/rustdesk/info`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getInvoices(customer: string): Promise<{ data: Invoice[]; error?: string }> {
  try {
    const baseUrl = process.env.PORTAL_BASE_URL || "http://localhost:3012";
    const res = await fetch(`${baseUrl}/api/invoices?customer=${encodeURIComponent(customer)}`, {
      cache: "no-store",
    });
    if (!res.ok) return { data: [], error: `Invoices: HTTP ${res.status}` };
    return { data: await res.json() };
  } catch (e) {
    return { data: [], error: String(e) };
  }
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function statusBadgeClass(state: string): string {
  const s = state.toLowerCase();
  if (s.includes("open") || s.includes("new")) return "status-badge status-open";
  if (s.includes("pending")) return "status-badge status-pending";
  return "status-badge status-closed";
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function PortalPage() {
  const reqHeaders = headers();

  // Authelia injects these after successful authentication
  const email =
    reqHeaders.get("remote-email") ||
    reqHeaders.get("x-forwarded-email") ||
    null;
  const displayName =
    reqHeaders.get("remote-name") ||
    reqHeaders.get("x-forwarded-preferred-username") ||
    email?.split("@")[0] ||
    "Customer";
  const groups = reqHeaders.get("remote-groups") || "";

  // If no auth headers present (running without Authelia in dev), show placeholder
  const isAuthenticated = !!email;
  const customerName = displayName ?? "Guest";

  const year = new Date().getFullYear();

  // Fetch data in parallel
  const [ticketsResult, invoicesResult, rustDeskInfo] = await Promise.all([
    isAuthenticated ? getTickets(email!) : Promise.resolve({ data: [] as ZammadTicket[], error: "Not authenticated" }),
    isAuthenticated ? getInvoices(customerName) : Promise.resolve({ data: [] as Invoice[], error: "Not authenticated" }),
    isAuthenticated ? getRustDeskInfo() : Promise.resolve(null),
  ]);

  const openInvoices = invoicesResult.data.filter(
    (inv) => inv.outstanding_amount > 0
  );

  return (
    <>
      <header className="portal-header">
        <div className="portal-header-inner">
          <a href="https://www.kecktech.net" className="portal-logo">
            Keck<span>tech</span>
          </a>
          {isAuthenticated ? (
            <div className="portal-user-pill">
              <div className="portal-user-avatar">{getInitials(customerName)}</div>
              <span>{customerName}</span>
            </div>
          ) : null}
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <section className="portal-hero">
          <div className="portal-container">
            <h1>
              {isAuthenticated
                ? `Welcome back, ${customerName.split(" ")[0]}!`
                : "Kecktech Customer Portal"}
            </h1>
            <p>
              {isAuthenticated
                ? "Your support tickets, invoices, and services are all in one place."
                : "Log in to manage your account, track support requests, and view invoices."}
            </p>
          </div>
        </section>

        <div className="portal-container">
          {!isAuthenticated ? (
            <div className="portal-error-page">
              <h1>Authentication Required</h1>
              <p style={{ color: "#64748b", marginBottom: "24px" }}>
                Please log in with your Kecktech account to access your portal.
              </p>
              <a href="https://auth.kecktech.net" className="portal-btn">
                Log In
              </a>
            </div>
          ) : (
            <>
              {/* Support CTA */}
              <div className="portal-support-cta" style={{ marginTop: "32px" }}>
                <div>
                  <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                    Need help? We're here.
                  </h2>
                  <p>Submit a new support request and we'll respond within your SLA window.</p>
                </div>
                <a href="https://tickets.kecktech.net/help/tickets/new" className="portal-btn">
                  Open Support Ticket
                </a>
              </div>

              <div className="portal-grid">
                {/* ── Active Tickets ─────────────────────────────────── */}
                <div className="portal-card">
                  <div className="portal-card-header">
                    <span className="portal-card-icon">🎧</span>
                    <h2 className="portal-card-title">Support Tickets</h2>
                  </div>

                  {ticketsResult.error ? (
                    <div className="portal-card-error">
                      Could not load tickets. Try refreshing the page.
                    </div>
                  ) : ticketsResult.data.length === 0 ? (
                    <p className="portal-card-empty">No open tickets — looking good!</p>
                  ) : (
                    <div className="ticket-list">
                      {ticketsResult.data.slice(0, 5).map((ticket) => (
                        <a
                          key={ticket.id}
                          href={`https://tickets.kecktech.net/help/tickets/zoom/${ticket.id}`}
                          className="ticket-row"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="ticket-number">#{ticket.number}</div>
                          <div className="ticket-title">{ticket.title}</div>
                          <div className="ticket-meta">
                            <span className={statusBadgeClass(ticket.state)}>
                              {ticket.state}
                            </span>
                            {" "}
                            <span>Updated {formatDate(ticket.updated_at)}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {ticketsResult.data.length > 5 && (
                    <a
                      href="https://tickets.kecktech.net/help"
                      style={{ marginTop: "16px", fontSize: "14px", color: "var(--steel)", fontWeight: 600 }}
                    >
                      View all tickets &rarr;
                    </a>
                  )}
                </div>

                {/* ── Invoices ───────────────────────────────────────── */}
                <div className="portal-card">
                  <div className="portal-card-header">
                    <span className="portal-card-icon">📄</span>
                    <h2 className="portal-card-title">Outstanding Invoices</h2>
                  </div>

                  {invoicesResult.error ? (
                    <div className="portal-card-error">
                      Could not load invoices. Contact support if this persists.
                    </div>
                  ) : openInvoices.length === 0 ? (
                    <p className="portal-card-empty">All invoices are paid — thank you!</p>
                  ) : (
                    <div className="invoice-list">
                      {openInvoices.map((inv) => (
                        <div
                          key={inv.name}
                          className={`invoice-row${inv.status === "Overdue" ? " invoice-overdue" : ""}`}
                        >
                          <div>
                            <div className="invoice-id">{inv.name}</div>
                            <div className="invoice-date">{formatDate(inv.posting_date)}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="invoice-amount">
                              {formatCurrency(inv.outstanding_amount, inv.currency)}
                            </div>
                            {inv.status === "Overdue" && (
                              <span className="status-badge" style={{ background: "#fee2e2", color: "#991b1b" }}>
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <a
                    href="https://ops.kecktech.net"
                    style={{ marginTop: "16px", fontSize: "14px", color: "var(--steel)", fontWeight: 600 }}
                  >
                    Pay invoices in ERPNext &rarr;
                  </a>
                </div>

                {/* ── Remote Support ────────────────────────────────── */}
                <div className="portal-card">
                  <div className="portal-card-header">
                    <span className="portal-card-icon">🖥️</span>
                    <h2 className="portal-card-title">Remote Support</h2>
                  </div>
                  {rustDeskInfo?.configured ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                        Your technician can securely connect to your device using RustDesk — a free, open-source remote support tool.
                        You must accept the connection before your technician can see your screen.
                      </p>

                      {/* Step-by-step instructions */}
                      <ol style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#334155", lineHeight: 1.8 }}>
                        <li>
                          <a
                            href={rustDeskInfo.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--navy)", fontWeight: 600 }}
                          >
                            Download RustDesk
                          </a>
                          {" "}and install it on your computer.
                        </li>
                        <li>
                          Open RustDesk, then go to{" "}
                          <strong>Settings (gear icon) → Network → ID/Relay Server</strong> and enter:
                          <div style={{ marginTop: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "8px 12px", fontFamily: "monospace", fontSize: "12px", color: "#1e293b" }}>
                            <div><strong>ID Server:</strong> {rustDeskInfo.serverHost}</div>
                            <div><strong>Relay Server:</strong> {rustDeskInfo.serverHost}</div>
                            <div style={{ wordBreak: "break-all" }}><strong>Key:</strong> {rustDeskInfo.publicKey}</div>
                          </div>
                        </li>
                        <li>Share your <strong>9-digit RustDesk ID</strong> (shown on the main screen) by replying to your support ticket.</li>
                        <li>Your technician will connect — click <strong>Accept</strong> on the permission prompt.</li>
                      </ol>

                      <a
                        href={rustDeskInfo.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portal-btn"
                        style={{ textAlign: "center" }}
                      >
                        Download RustDesk
                      </a>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <p style={{ margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                        Need hands-on help? Your technician can securely connect to your device.
                        Open a support ticket and request a remote session — we&apos;ll send you connection instructions.
                      </p>
                      <a
                        href="https://tickets.kecktech.net/help/tickets/new"
                        className="portal-btn"
                        style={{ textAlign: "center" }}
                      >
                        Request Remote Session
                      </a>
                    </div>
                  )}
                </div>

                {/* ── Resources ─────────────────────────────────────── */}
                <div className="portal-card">
                  <div className="portal-card-header">
                    <span className="portal-card-icon">🔗</span>
                    <h2 className="portal-card-title">Your Resources</h2>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      {
                        label: "Help Center — Step-by-step guides",
                        href: "https://help.kecktech.net",
                        icon: "📚",
                      },
                      {
                        label: "Password Vault — Vaultwarden",
                        href: "https://vault.kecktech.net",
                        icon: "🔑",
                      },
                      {
                        label: "Submit a Ticket",
                        href: "https://tickets.kecktech.net/help/tickets/new",
                        icon: "🎧",
                      },
                      {
                        label: "Main Website",
                        href: "https://www.kecktech.net",
                        icon: "🌐",
                      },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: "15px",
                          color: "var(--charcoal)",
                          textDecoration: "none",
                          transition: "border-color 0.15s",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>{link.icon}</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="portal-footer">
        <span>
          &copy; {year} Kecktech IT Solutions LLC &nbsp;&middot;&nbsp;
          <a href="https://www.kecktech.net/contact">Contact Support</a> &nbsp;&middot;&nbsp;
          <a href="https://www.kecktech.net/privacy">Privacy Policy</a>
        </span>
      </footer>
    </>
  );
}
