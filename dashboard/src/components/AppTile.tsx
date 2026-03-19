const icons: Record<string, string> = {
  briefcase: "💼",
  headset: "🎧",
  lock: "🔒",
  workflow: "⚡",
  globe: "🌐",
  book: "📚",
  chart: "📊",
  monitor: "🖥️",
  mail: "📧",
  container: "📦",
  route: "🔀",
  shield: "🛡️",
};

interface AppTileProps {
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  status: "up" | "down";
  latency: number;
}

export function AppTile({
  name,
  description,
  url,
  icon,
  color,
  status,
  latency,
}: AppTileProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: "#1e293b",
        border: `1px solid ${status === "up" ? "#334155" : "#7f1d1d"}`,
        borderRadius: "12px",
        padding: "24px",
        transition: "transform 0.15s, border-color 0.15s",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          {icons[icon] || "🔧"}
        </div>

        {/* Status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: status === "up" ? "#34d399" : "#f87171",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: status === "up" ? "#34d399" : "#f87171",
              boxShadow:
                status === "up"
                  ? "0 0 8px rgba(52,211,153,0.5)"
                  : "0 0 8px rgba(248,113,113,0.5)",
            }}
          />
          {status === "up" ? "Online" : "Offline"}
        </div>
      </div>

      {/* Name and description */}
      <h2
        style={{
          margin: "0 0 4px",
          fontSize: "18px",
          fontWeight: 600,
          color: "#f1f5f9",
        }}
      >
        {name}
      </h2>
      <p style={{ margin: "0 0 12px", fontSize: "14px", color: "#94a3b8" }}>
        {description}
      </p>

      {/* Latency */}
      <div style={{ fontSize: "12px", color: "#64748b" }}>
        {status === "up" ? `${latency}ms response` : "Unreachable"}
      </div>
    </a>
  );
}
