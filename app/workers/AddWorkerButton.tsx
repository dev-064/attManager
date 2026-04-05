"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
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

type PayType = "daily" | "monthly";

export default function AddWorkerButton() {
  const [open, setOpen] = useState(false);
  const [payType, setPayType] = useState<PayType>("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  function closeModal() {
    setOpen(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = {
      name: fd.get("name"),
      overtime_rate_per_hour: Number(fd.get("overtime_rate_per_hour")),
    };
    if (payType === "daily") {
      body.daily_wage = Number(fd.get("rate"));
    } else {
      body.monthly_salary = Number(fd.get("rate"));
    }

    try {
      const res = await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.formErrors?.[0] ?? data.error ?? "Something went wrong");
        return;
      }
      closeModal();
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 18px",
          background: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius)",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
          transition: "background var(--transition)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary-dark)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-primary)"; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Worker
      </button>

      {open && (
        <div
          ref={overlayRef}
          onClick={(e) => { if (e.target === overlayRef.current) closeModal(); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(76, 29, 149, 0.18)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
            animation: "fadeIn 150ms ease both",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "0 20px 60px rgba(124, 58, 237, 0.2)",
              animation: "scaleIn 200ms ease both",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-text)" }}>Add Worker</h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  padding: "4px",
                  borderRadius: "var(--radius)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color var(--transition)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)"; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label htmlFor="worker-name" style={labelStyle}>Full Name</label>
                <input
                  id="worker-name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Raju Kumar"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Pay Type</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["daily", "monthly"] as PayType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPayType(t)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        border: "1.5px solid",
                        borderColor: payType === t ? "var(--color-primary)" : "var(--color-border)",
                        borderRadius: "var(--radius)",
                        background: payType === t ? "#EDE9FE" : "white",
                        color: payType === t ? "var(--color-primary)" : "var(--color-text-muted)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all var(--transition)",
                        textTransform: "capitalize",
                      }}
                    >
                      {t === "daily" ? "Daily Wage" : "Monthly Salary"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="worker-rate" style={labelStyle}>
                  {payType === "daily" ? "Daily Wage (₹)" : "Monthly Salary (₹)"}
                </label>
                <input
                  id="worker-rate"
                  name="rate"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  placeholder={payType === "daily" ? "e.g. 500" : "e.g. 15000"}
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
              </div>

              <div>
                <label htmlFor="worker-ot" style={labelStyle}>Overtime Rate (₹/hr)</label>
                <input
                  id="worker-ot"
                  name="overtime_rate_per_hour"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g. 60"
                  defaultValue="0"
                  style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
                />
              </div>

              {error && (
                <p style={{ color: "var(--color-danger)", fontSize: "0.85rem", background: "var(--color-danger-bg)", padding: "10px 14px", borderRadius: "var(--radius)", fontWeight: 500 }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "11px",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    background: "white",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all var(--transition)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-text-muted)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "11px",
                    border: "none",
                    borderRadius: "var(--radius)",
                    background: loading ? "var(--color-primary-light)" : "var(--color-primary)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.8 : 1,
                    transition: "all var(--transition)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {loading && (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        border: "2px solid rgba(255,255,255,0.4)",
                        borderTopColor: "white",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  )}
                  {loading ? "Saving…" : "Add Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
