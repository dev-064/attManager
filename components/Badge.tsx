type Variant = "success" | "danger" | "warning" | "default";

const variantStyles: Record<Variant, React.CSSProperties> = {
  success: { background: "var(--color-success-bg)", color: "var(--color-success)" },
  danger:  { background: "var(--color-danger-bg)",  color: "var(--color-danger)" },
  warning: { background: "var(--color-warning-bg)", color: "var(--color-warning)" },
  default: { background: "#EDE9FE", color: "var(--color-primary)" },
};

export default function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: Variant }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: "999px",
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
