import { Worker, Attendance } from "@/types";

/**
 * Returns the number of working days in a given month (Mon–Sat, excludes Sunday).
 */
export function workingDaysInMonth(year: number, month: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let count = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month - 1, d).getDay();
    if (day !== 0) count++; // exclude Sunday
  }
  return count;
}

/**
 * Calculates daily earnings for a single attendance record.
 */
export function dailyEarnings(worker: Worker, record: Attendance): number {
  if (record.status === "absent") return 0;

  const overtime = record.overtime_hours * worker.overtime_rate_per_hour;

  if (worker.daily_wage != null) {
    return worker.daily_wage + overtime;
  }

  if (worker.monthly_salary != null) {
    const [year, month] = record.date.split("-").map(Number);
    const workingDays = workingDaysInMonth(year, month);
    return worker.monthly_salary / workingDays + overtime;
  }

  return overtime;
}

/**
 * Calculates the full monthly salary report.
 */
export function calculateMonthlySalary(
  worker: Worker,
  records: Attendance[]
): {
  total_days_present: number;
  total_overtime_hours: number;
  total_salary: number;
} {
  let total_days_present = 0;
  let total_overtime_hours = 0;
  let total_salary = 0;

  for (const record of records) {
    if (record.status === "present") {
      total_days_present++;
      total_overtime_hours += record.overtime_hours;
    }
    total_salary += dailyEarnings(worker, record);
  }

  return {
    total_days_present,
    total_overtime_hours,
    total_salary: Math.round(total_salary * 100) / 100,
  };
}
