"use client";

import { useRouter } from "next/navigation";
import Badge from "@/components/Badge";
import { Attendance } from "@/types";

export default function WorkerDetailClient({
  workerId,
  month,
  records,
}: {
  workerId: string;
  month: string;
  records: Attendance[];
}) {
  const router = useRouter();

  function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value; // "YYYY-MM"
    if (val) router.push(`/workers/${workerId}?month=${val}`);
  }

  return (
    <div style={{ animation: "fadeIn var(--transition-md) ease both", animationDelay: "200ms" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text)" }}>
          Attendance Records
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="month-picker" style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
            Month:
          </label>
          <input
            id="month-picker"
            type="month"
            defaultValue={month}
            onChange={handleMonthChange}
            style={{
              padding: "7px 12px",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius)",
              fontSize: "0.875rem",
              outline: "none",
              color: "var(--color-text-body)",
              cursor: "pointer",
              transition: "border-color var(--transition)",
              fontFamily: "var(--font-fira-code)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
          />
        </div>
      </div>

      {records.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1.5px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px" }} aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 6 }}>No records</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            No attendance marked for this month yet.
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
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", background: "#FAF5FF" }}>
                  {["Date", "Status", "Overtime (hrs)"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 20px",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--color-text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: i < records.length - 1 ? "1px solid var(--color-border)" : "none",
                      animation: `fadeIn var(--transition-md) ease both`,
                      animationDelay: `${i * 30}ms`,
                    }}
                  >
                    <td style={{ padding: "13px 20px", fontFamily: "var(--font-fira-code)", fontSize: "0.9rem", color: "var(--color-text-body)" }}>
                      {new Date(r.date + "T00:00:00").toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge variant={r.status === "present" ? "success" : "danger"}>
                        {r.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "var(--font-fira-code)", color: r.overtime_hours > 0 ? "var(--color-warning)" : "var(--color-text-muted)" }}>
                      {r.overtime_hours > 0 ? `+${r.overtime_hours}h` : "—"}
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
