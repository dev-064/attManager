"use client";

import { useState } from "react";
import { Worker } from "@/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid var(--color-border)",
  borderRadius: "var(--radius)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color var(--transition)",
  background: "white",
  color: "var(--color-text-body)",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "var(--color-text)",
  marginBottom: "6px",
};

type Status = "present" | "absent";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AttendanceForm({ workers }: { workers: Worker[] }) {
  const [workerId, setWorkerId] = useState(workers[0]?.id ?? "");
  const [date, setDate] = useState(todayStr());
  const [status, setStatus] = useState<Status>("present");
  const [overtime, setOvertime] = useState("0");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!workerId) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worker_id: workerId,
          date,
          status,
          overtime_hours: parseFloat(overtime) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ ok: false, msg: data.error?.formErrors?.[0] ?? data.error ?? "Failed to save." });
      } else {
        setResult({ ok: true, msg: "Attendance saved successfully!" });
      }
    } catch {
      setResult({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (workers.length === 0) {
    return (
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
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }} aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
        <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>No workers found</p>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Add workers first before marking attendance.
        </p>
      </div>
    );
  }

  const selectedWorker = workers.find((w) => w.id === workerId);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 480px) 1fr",
        gap: "32px",
        alignItems: "start",
        animation: "fadeIn var(--transition-md) ease both",
      }}
    >
      {/* Form */}
      <div
        style={{
          background: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Worker select */}
          <div>
            <label htmlFor="att-worker" style={labelStyle}>Worker</label>
            <div style={{ position: "relative" }}>
              <select
                id="att-worker"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                required
                style={{
                  ...inputStyle,
                  appearance: "none",
                  paddingRight: "36px",
                  cursor: "pointer",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="att-date" style={labelStyle}>Date</label>
            <input
              id="att-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              max={todayStr()}
              style={{ ...inputStyle, fontFamily: "var(--font-fira-code)", cursor: "pointer" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
            />
          </div>

          {/* Status toggle */}
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["present", "absent"] as Status[]).map((s) => {
                const isActive = status === s;
                const colors = {
                  present: { active: { bg: "#D1FAE5", border: "var(--color-success)", color: "var(--color-success)" } },
                  absent:  { active: { bg: "#FEE2E2", border: "var(--color-danger)",  color: "var(--color-danger)" } },
                };
                const c = isActive ? colors[s].active : { bg: "white", border: "var(--color-border)", color: "var(--color-text-muted)" };
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      border: `1.5px solid ${c.border}`,
                      borderRadius: "var(--radius)",
                      background: c.bg,
                      color: c.color,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all var(--transition)",
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    {s === "present" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Overtime — only when present */}
          {status === "present" && (
            <div style={{ animation: "fadeIn 150ms ease both" }}>
              <label htmlFor="att-ot" style={labelStyle}>
                Overtime Hours
                <span style={{ fontWeight: 400, color: "var(--color-text-muted)", marginLeft: 6 }}>(optional)</span>
              </label>
              <input
                id="att-ot"
                type="number"
                min="0"
                step="0.5"
                value={overtime}
                onChange={(e) => setOvertime(e.target.value)}
                style={{ ...inputStyle, fontFamily: "var(--font-fira-code)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
              />
            </div>
          )}

          {/* Feedback */}
          {result && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius)",
                background: result.ok ? "var(--color-success-bg)" : "var(--color-danger-bg)",
                color: result.ok ? "var(--color-success)" : "var(--color-danger)",
                fontWeight: 500,
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "fadeIn 150ms ease both",
              }}
            >
              {result.ok ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {result.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "var(--radius)",
              background: loading ? "var(--color-primary-light)" : "var(--color-cta)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              transition: "all var(--transition)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-cta-dark)"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "var(--color-cta)"; }}
          >
            {loading && (
              <span
                style={{
                  width: 16,
                  height: 16,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            )}
            {loading ? "Saving…" : "Save Attendance"}
          </button>
        </form>
      </div>

      {/* Worker preview panel */}
      {selectedWorker && (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "28px",
            boxShadow: "var(--shadow-sm)",
            animation: "fadeIn var(--transition-md) ease both",
          }}
        >
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>
            Worker Preview
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              {selectedWorker.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-body)" }}>{selectedWorker.name}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                {selectedWorker.daily_wage != null ? "Daily Wage" : "Monthly Salary"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              {
                label: selectedWorker.daily_wage != null ? "Daily Wage" : "Monthly Salary",
                value: `₹${(selectedWorker.daily_wage ?? selectedWorker.monthly_salary)?.toLocaleString("en-IN")}`,
              },
              {
                label: "Overtime Rate",
                value: `₹${selectedWorker.overtime_rate_per_hour}/hr`,
              },
              {
                label: "Today's Earnings (est.)",
                value:
                  status === "absent"
                    ? "₹0"
                    : selectedWorker.daily_wage != null
                    ? `₹${(selectedWorker.daily_wage + parseFloat(overtime || "0") * selectedWorker.overtime_rate_per_hour).toLocaleString("en-IN")}`
                    : "—",
              },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--font-fira-code)", fontWeight: 600, color: "var(--color-text-body)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
