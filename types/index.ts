export type AttendanceStatus = "present" | "absent";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Worker {
  id: string;
  user_id: string | null;
  name: string;
  daily_wage: number | null;
  monthly_salary: number | null;
  overtime_rate_per_hour: number;
  created_at: string;
}

export interface Attendance {
  id: string;
  worker_id: string;
  date: string;
  status: AttendanceStatus;
  overtime_hours: number;
  created_at: string;
}

export interface SalaryReport {
  worker_id: string;
  worker_name: string;
  month: string; // "YYYY-MM"
  total_days_present: number;
  total_overtime_hours: number;
  total_salary: number;
}
