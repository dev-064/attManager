import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateMonthlySalary } from "@/lib/salary";
import { Worker, Attendance } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const { workerId } = await params;
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // "YYYY-MM"

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "month query param required (YYYY-MM)" }, { status: 400 });
  }

  const { data: worker, error: workerError } = await supabase
    .from("workers")
    .select("*")
    .eq("id", workerId)
    .single();

  if (workerError) {
    if (workerError.code === "PGRST116") {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }
    return NextResponse.json({ error: workerError.message }, { status: 500 });
  }

  const { data: records, error: attError } = await supabase
    .from("attendance")
    .select("*")
    .eq("worker_id", workerId)
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`)
    .order("date", { ascending: true });

  if (attError) return NextResponse.json({ error: attError.message }, { status: 500 });

  const summary = calculateMonthlySalary(worker as Worker, (records ?? []) as Attendance[]);

  return NextResponse.json({
    worker_id: workerId,
    worker_name: (worker as Worker).name,
    month,
    ...summary,
  });
}
