export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getWorker, getAttendance, getMonthlySalary } from "@/lib/data";
import WorkerDetailClient from "./WorkerDetailClient";

export default async function WorkerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ month?: string }>;
}) {
  const { id } = await params;
  const { month: monthParam } = await searchParams;

  const today = new Date();
  const month = monthParam ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const worker = await getWorker(id).catch(() => null);
  if (!worker) notFound();

  const [records, salary] = await Promise.all([
    getAttendance(id, month).catch(() => []),
    getMonthlySalary(id, month).catch(() => null),
  ]);

  const [year, mon] = month.split("-").map(Number);
  const monthLabel = new Date(year, mon - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const presentDays = records.filter((r) => r.status === "present").length;
  const absentDays = records.filter((r) => r.status === "absent").length;
  const totalOT = records.reduce((s, r) => s + r.overtime_hours, 0);

  return (
    <div>
      <div style={{ marginBottom: "24px", animation: "fadeIn var(--transition-md) ease both" }}>
        <Link
          href="/workers"
          className="link-muted"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Workers
        </Link>
      </div>

      <PageHeader
        title={worker.name}
        description={worker.daily_wage != null ? "Daily Wage Worker" : "Monthly Salary Worker"}
      />

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Pay Rate",
            value: `₹${(worker.daily_wage ?? worker.monthly_salary)?.toLocaleString("en-IN")}`,
            sub: worker.daily_wage != null ? "per day" : "per month",
            color: "var(--color-primary)",
          },
          {
            label: "OT Rate",
            value: `₹${worker.overtime_rate_per_hour}`,
            sub: "per hour",
            color: "var(--color-warning)",
          },
          {
            label: "Days Present",
            value: String(presentDays),
            sub: `${absentDays} absent`,
            color: "var(--color-success)",
          },
          {
            label: "Total OT",
            value: `${totalOT}h`,
            sub: "overtime hours",
            color: "var(--color-danger)",
          },
          ...(salary
            ? [
                {
                  label: "Monthly Earnings",
                  value: `₹${salary.total_salary.toLocaleString("en-IN")}`,
                  sub: monthLabel,
                  color: "var(--color-primary)",
                },
              ]
            : []),
        ].map((card, i) => (
          <div
            key={card.label}
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              boxShadow: "var(--shadow-sm)",
              animation: "fadeIn var(--transition-md) ease both",
              animationDelay: `${i * 50}ms`,
            }}
          >
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              {card.label}
            </p>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: card.color, fontFamily: "var(--font-fira-code)", lineHeight: 1.1, marginBottom: 4 }}>
              {card.value}
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <WorkerDetailClient workerId={id} month={month} records={records} />
    </div>
  );
}
