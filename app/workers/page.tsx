import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getWorkers } from "@/lib/data";
import AddWorkerButton from "./AddWorkerButton";

export default async function WorkersPage() {
  const workers = await getWorkers().catch(() => []);

  return (
    <div>
      <PageHeader
        title="Workers"
        description="Manage your workforce"
        action={<AddWorkerButton />}
      />

      {workers.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1.5px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "60px 24px",
            textAlign: "center",
            animation: "fadeIn var(--transition-md) ease both",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }} aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="23" y1="11" x2="17" y2="11" />
            <line x1="20" y1="8" x2="20" y2="14" />
          </svg>
          <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>No workers yet</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Click &ldquo;Add Worker&rdquo; above to get started.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
            animation: "fadeIn var(--transition-md) ease both",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", background: "#FAF5FF" }}>
                  {["Name", "Pay Type", "Rate", "Overtime / hr", "Joined", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.map((w, i) => (
                  <tr
                    key={w.id}
                    className="table-row"
                    style={{
                      borderBottom: i < workers.length - 1 ? "1px solid var(--color-border)" : "none",
                      animation: `fadeIn var(--transition-md) ease both`,
                      animationDelay: `${i * 40}ms`,
                    }}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "var(--color-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            flexShrink: 0,
                          }}
                        >
                          {w.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: "var(--color-text-body)" }}>{w.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          background: w.daily_wage != null ? "#FEF3C7" : "#D1FAE5",
                          color: w.daily_wage != null ? "var(--color-warning)" : "var(--color-success)",
                        }}
                      >
                        {w.daily_wage != null ? "Daily Wage" : "Monthly Salary"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-fira-code)", fontWeight: 600, color: "var(--color-text-body)" }}>
                      ₹{(w.daily_wage ?? w.monthly_salary)?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-fira-code)", color: "var(--color-text-muted)" }}>
                      ₹{w.overtime_rate_per_hour}/hr
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      {new Date(w.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <Link
                        href={`/workers/${w.id}`}
                        className="chip-action"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "6px 14px",
                          background: "#EDE9FE",
                          color: "var(--color-primary)",
                          borderRadius: "var(--radius)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View details
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
