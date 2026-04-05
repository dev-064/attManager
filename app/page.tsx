export const dynamic = "force-dynamic";

import Link from "next/link";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { getWorkers } from "@/lib/data";

export default async function DashboardPage() {
  const workers = await getWorkers().catch(() => []);

  const dailyWageCount = workers.filter((w) => w.daily_wage != null).length;
  const monthlySalaryCount = workers.filter((w) => w.monthly_salary != null).length;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      <PageHeader title="Dashboard" description={today} />

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          label="Total Workers"
          value={workers.length}
          accent="#EDE9FE"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Daily Wage"
          value={dailyWageCount}
          accent="#FEF3C7"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
        <StatCard
          label="Monthly Salary"
          value={monthlySalaryCount}
          accent="#D1FAE5"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "16px" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/attendance"
            className="btn-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "var(--color-cta)",
              color: "white",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            Mark Attendance
          </Link>
          <Link
            href="/workers"
            className="btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              background: "var(--color-bg-card)",
              color: "var(--color-primary)",
              border: "1.5px solid var(--color-primary)",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Worker
          </Link>
        </div>
      </div>

      {/* Workers table */}
      {workers.length > 0 && (
        <div style={{ animation: "fadeIn var(--transition-md) ease both", animationDelay: "100ms" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "16px" }}>
            Workers
          </h2>
          <div
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                  {["Name", "Type", "Rate", "Action"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workers.slice(0, 5).map((w, i) => (
                  <tr
                    key={w.id}
                    className="table-row"
                    style={{
                      borderBottom: i < Math.min(workers.length, 5) - 1 ? "1px solid var(--color-border)" : "none",
                      animation: `fadeIn var(--transition-md) ease both`,
                      animationDelay: `${i * 50}ms`,
                    }}
                  >
                    <td style={{ padding: "14px 20px", fontWeight: 500, color: "var(--color-text-body)" }}>{w.name}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          background: w.daily_wage != null ? "#FEF3C7" : "#D1FAE5",
                          color: w.daily_wage != null ? "var(--color-warning)" : "var(--color-success)",
                        }}
                      >
                        {w.daily_wage != null ? "Daily" : "Monthly"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontFamily: "var(--font-fira-code)", fontSize: "0.9rem", color: "var(--color-text-body)" }}>
                      ₹{w.daily_wage ?? w.monthly_salary}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <Link
                        href={`/workers/${w.id}`}
                        className="link-primary"
                        style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", cursor: "pointer" }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {workers.length > 5 && (
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <Link href="/workers" className="link-primary" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-primary)", cursor: "pointer" }}>
                View all {workers.length} workers →
              </Link>
            </div>
          )}
        </div>
      )}

      {workers.length === 0 && (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1.5px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 24px",
            textAlign: "center",
            animation: "fadeIn var(--transition-md) ease both",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }} aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="23" y1="11" x2="17" y2="11" />
            <line x1="20" y1="8" x2="20" y2="14" />
          </svg>
          <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>No workers yet</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: 20 }}>
            Get started by adding your first worker.
          </p>
          <Link
            href="/workers"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "var(--color-primary)",
              color: "white",
              borderRadius: "var(--radius)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Add Worker
          </Link>
        </div>
      )}
    </div>
  );
}
