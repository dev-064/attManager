import PageHeader from "@/components/PageHeader";
import { getWorkers, getAllAttendanceForMonth } from "@/lib/data";
import MonthPicker from "./MonthPicker";
import { Attendance, Worker } from "@/types";

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function isSunday(year: number, month: number, day: number): boolean {
  return new Date(year, month - 1, day).getDay() === 0;
}

export default async function ReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const today = new Date();
  const month = monthParam ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [year, mon] = month.split("-").map(Number);
  const totalDays = daysInMonth(year, mon);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const [workers, records] = await Promise.all([
    getWorkers().catch(() => [] as Worker[]),
    getAllAttendanceForMonth(month).catch(() => [] as Attendance[]),
  ]);

  // Build lookup: workerId → { date → status }
  const lookup = new Map<string, Map<string, Attendance>>();
  for (const r of records) {
    if (!lookup.has(r.worker_id)) lookup.set(r.worker_id, new Map());
    lookup.get(r.worker_id)!.set(r.date, r);
  }

  const monthLabel = new Date(year, mon - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <PageHeader
        title="Monthly Report"
        description={`Attendance grid for ${monthLabel}`}
        action={<MonthPicker month={month} />}
      />

      {workers.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-card)",
            border: "1.5px dashed var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 8 }}>No workers found</p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>Add workers first to see the report.</p>
        </div>
      ) : (
        <>
          {/* Legend */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Present", bg: "#D1FAE5", color: "var(--color-success)" },
              { label: "Absent",  bg: "#FEE2E2", color: "var(--color-danger)" },
              { label: "Sunday",  bg: "#F3F4F6", color: "#9CA3AF" },
              { label: "Not marked", bg: "white", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: l.bg, border: l.border ?? "none" }} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div
            style={{
              background: "var(--color-bg-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              overflow: "auto",
              boxShadow: "var(--shadow-sm)",
              animation: "fadeIn var(--transition-md) ease both",
            }}
          >
            <table style={{ borderCollapse: "collapse", minWidth: "100%" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border)", background: "#FAF5FF" }}>
                  {/* Worker name column */}
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      position: "sticky",
                      left: 0,
                      background: "#FAF5FF",
                      zIndex: 2,
                      borderRight: "1px solid var(--color-border)",
                      minWidth: 140,
                    }}
                  >
                    Worker
                  </th>
                  {/* Day columns */}
                  {days.map((d) => {
                    const sunday = isSunday(year, mon, d);
                    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
                    const dayName = new Date(year, mon - 1, d).toLocaleDateString("en-IN", { weekday: "short" });
                    return (
                      <th
                        key={d}
                        title={dateStr}
                        style={{
                          padding: "6px 4px",
                          textAlign: "center",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          color: sunday ? "#9CA3AF" : "var(--color-text-muted)",
                          background: sunday ? "#F9FAFB" : "#FAF5FF",
                          minWidth: 36,
                          width: 36,
                          fontFamily: "var(--font-fira-code)",
                        }}
                      >
                        <div>{d}</div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7 }}>{dayName}</div>
                      </th>
                    );
                  })}
                  {/* Summary columns */}
                  <th style={{ padding: "10px 14px", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-success)", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap", borderLeft: "1px solid var(--color-border)" }}>P</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-danger)", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>A</th>
                  <th style={{ padding: "10px 14px", textAlign: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-warning)", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>OT hrs</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker, wi) => {
                  const workerMap = lookup.get(worker.id) ?? new Map<string, Attendance>();
                  let presentCount = 0;
                  let absentCount = 0;
                  let totalOT = 0;

                  for (const r of workerMap.values()) {
                    if (r.status === "present") { presentCount++; totalOT += r.overtime_hours; }
                    else absentCount++;
                  }

                  return (
                    <tr
                      key={worker.id}
                      className="table-row"
                      style={{
                        borderBottom: wi < workers.length - 1 ? "1px solid var(--color-border)" : "none",
                        animation: `fadeIn var(--transition-md) ease both`,
                        animationDelay: `${wi * 30}ms`,
                      }}
                    >
                      {/* Worker name — sticky */}
                      <td
                        style={{
                          padding: "10px 16px",
                          fontWeight: 600,
                          color: "var(--color-text-body)",
                          fontSize: "0.875rem",
                          whiteSpace: "nowrap",
                          position: "sticky",
                          left: 0,
                          background: "white",
                          zIndex: 1,
                          borderRight: "1px solid var(--color-border)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: "var(--color-primary)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {worker.name.charAt(0).toUpperCase()}
                          </div>
                          {worker.name}
                        </div>
                      </td>

                      {/* Day cells */}
                      {days.map((d) => {
                        const sunday = isSunday(year, mon, d);
                        const dateStr = `${month}-${String(d).padStart(2, "0")}`;
                        const record = workerMap.get(dateStr);

                        let bg = "transparent";
                        let label = "";
                        let textColor = "transparent";

                        if (sunday) {
                          bg = "#F3F4F6";
                          label = "—";
                          textColor = "#D1D5DB";
                        } else if (record?.status === "present") {
                          bg = "#D1FAE5";
                          label = "P";
                          textColor = "var(--color-success)";
                        } else if (record?.status === "absent") {
                          bg = "#FEE2E2";
                          label = "A";
                          textColor = "var(--color-danger)";
                        }

                        return (
                          <td
                            key={d}
                            title={record ? `${dateStr}: ${record.status}${record.overtime_hours ? ` (+${record.overtime_hours}h OT)` : ""}` : dateStr}
                            style={{
                              padding: "4px",
                              textAlign: "center",
                              background: bg,
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 28,
                                height: 28,
                                borderRadius: 4,
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                color: textColor,
                                fontFamily: "var(--font-fira-code)",
                              }}
                            >
                              {label}
                            </span>
                          </td>
                        );
                      })}

                      {/* Summary */}
                      <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-fira-code)", fontWeight: 700, color: "var(--color-success)", fontSize: "0.875rem", borderLeft: "1px solid var(--color-border)" }}>
                        {presentCount}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-fira-code)", fontWeight: 700, color: "var(--color-danger)", fontSize: "0.875rem" }}>
                        {absentCount}
                      </td>
                      <td style={{ padding: "10px 14px", textAlign: "center", fontFamily: "var(--font-fira-code)", fontWeight: 600, color: totalOT > 0 ? "var(--color-warning)" : "var(--color-text-muted)", fontSize: "0.875rem" }}>
                        {totalOT > 0 ? totalOT : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
