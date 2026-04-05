export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "32px",
        animation: "fadeIn var(--transition-md) ease both",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.2, marginBottom: description ? 6 : 0 }}>
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
