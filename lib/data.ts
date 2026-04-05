import { supabase } from "@/lib/supabase";
import { calculateMonthlySalary } from "@/lib/salary";
import { Worker, Attendance, SalaryReport } from "@/types";

/** Returns "YYYY-MM-DD" of the last day of the given "YYYY-MM" month. */
function monthEnd(month: string): string {
  const [year, mon] = month.split("-").map(Number);
  const last = new Date(year, mon, 0).getDate(); // day 0 of next month = last day of this month
  return `${month}-${String(last).padStart(2, "0")}`;
}

export async function getWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data as Worker[];
}

export async function getWorker(id: string): Promise<Worker | null> {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data as Worker;
}

export async function getAttendance(workerId: string, month: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("worker_id", workerId)
    .gte("date", `${month}-01`)
    .lte("date", monthEnd(month))
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Attendance[];
}

export async function getAllAttendanceForMonth(month: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .gte("date", `${month}-01`)
    .lte("date", monthEnd(month))
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Attendance[];
}

export async function getMonthlySalary(
  workerId: string,
  month: string
): Promise<SalaryReport | null> {
  const [worker, records] = await Promise.all([
    getWorker(workerId),
    getAttendance(workerId, month),
  ]);
  if (!worker) return null;
  const summary = calculateMonthlySalary(worker, records);
  return {
    worker_id: workerId,
    worker_name: worker.name,
    month,
    ...summary,
  };
}
