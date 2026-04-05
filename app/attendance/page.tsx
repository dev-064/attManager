import PageHeader from "@/components/PageHeader";
import { Worker } from "@/types";
import AttendanceForm from "./AttendanceForm";

async function getWorkers(): Promise<Worker[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/workers`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AttendancePage() {
  const workers = await getWorkers();

  return (
    <div>
      <PageHeader
        title="Mark Attendance"
        description="Record daily attendance and overtime for workers"
      />
      <AttendanceForm workers={workers} />
    </div>
  );
}
