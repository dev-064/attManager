import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const CreateWorkerSchema = z.object({
  user_id: z.string().uuid().optional(),
  name: z.string().min(1),
  daily_wage: z.number().positive().optional(),
  monthly_salary: z.number().positive().optional(),
  overtime_rate_per_hour: z.number().min(0),
}).refine(
  (data) => data.daily_wage != null || data.monthly_salary != null,
  { message: "Either daily_wage or monthly_salary must be provided" }
);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = CreateWorkerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("workers")
    .insert(parsed.data)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET() {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
