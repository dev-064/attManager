export const dynamic = "force-dynamic";

import PageHeader from "@/components/PageHeader";
import { getWorkers } from "@/lib/data";
import AttendanceForm from "./AttendanceForm";

export default async function AttendancePage() {
  const workers = await getWorkers().catch(() => []);

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
