"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("full_name");

  if (error) throw error;
  return data;
}

export async function getStudent(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createStudent(formData: {
  full_name: string;
  phone?: string;
  parent_phone?: string;
  grade_level?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(formData)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/students");
  return data;
}

export async function updateStudent(
  id: string,
  formData: {
    full_name: string;
    phone?: string;
    parent_phone?: string;
    grade_level?: string;
    notes?: string;
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/students");
  return data;
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/students");
}
