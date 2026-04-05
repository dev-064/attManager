export default function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
        animation: "fadeIn var(--transition-md) ease both",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius)",
          background: accent ?? "#EDE9FE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: 500, marginBottom: 4 }}>
          {label}
        </p>
        <p style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--color-text)", fontFamily: "var(--font-fira-code)", lineHeight: 1.1 }}>
          {value}
        </p>
      </div>
    </div>
  );
}
