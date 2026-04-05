"use client";

import { useRouter } from "next/navigation";

export default function MonthPicker({ month }: { month: string }) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label htmlFor="report-month" style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
        Month:
      </label>
      <input
        id="report-month"
        type="month"
        defaultValue={month}
        onChange={(e) => { if (e.target.value) router.push(`/report?month=${e.target.value}`); }}
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
          background: "white",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-border-focus)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
      />
    </div>
  );
}
