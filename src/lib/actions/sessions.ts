"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSessions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*, student:students(*)")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSession(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*, student:students(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSession(formData: {
  student_id: string;
  title: string;
  subject: string;
  topic?: string;
  date: string;
  start_time: string;
  end_time: string;
  status?: string;
  notes?: string;
  homework?: string;
  price: number;
  payment_status?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  return data;
}

export async function updateSession(
  id: string,
  formData: {
    student_id: string;
    title: string;
    subject: string;
    topic?: string;
    date: string;
    start_time: string;
    end_time: string;
    status?: string;
    notes?: string;
    homework?: string;
    price: number;
    payment_status?: string;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
  return data;
}

export async function deleteSession(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("sessions").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/sessions");
  revalidatePath("/dashboard");
}

export async function getDashboardData() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const [studentsResult, todaySessionsResult, upcomingSessionsResult, unpaidSessionsResult] =
    await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase
        .from("sessions")
        .select("*, student:students(*)")
        .eq("date", today)
        .order("start_time"),
      supabase
        .from("sessions")
        .select("*, student:students(*)")
        .gte("date", today)
        .eq("status", "scheduled")
        .order("date")
        .order("start_time")
        .limit(10),
      supabase
        .from("sessions")
        .select("*, student:students(*)")
        .eq("payment_status", "unpaid")
        .eq("status", "completed")
        .order("date", { ascending: false }),
    ]);

  return {
    totalStudents: studentsResult.count ?? 0,
    todaySessions: todaySessionsResult.data ?? [],
    upcomingSessions: upcomingSessionsResult.data ?? [],
    unpaidSessions: unpaidSessionsResult.data ?? [],
  };
}
