"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BusinessSettings = {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  hourly_rate: number;
  notes: string;
};

export async function getSettings(): Promise<BusinessSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return {
      id: "",
      business_name: "",
      owner_name: "",
      phone: "",
      email: "",
      hourly_rate: 150,
      notes: "",
    };
  }

  return data;
}

export async function updateSettings(formData: {
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  hourly_rate: number;
  notes: string;
}) {
  const supabase = await createClient();

  // Get existing settings row
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update(formData)
      .eq("id", existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("settings")
      .insert(formData);

    if (error) throw error;
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
