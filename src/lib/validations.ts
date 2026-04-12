import { z } from "zod";

export const studentSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string(),
  parent_phone: z.string(),
  grade_level: z.string(),
  notes: z.string(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export const sessionSchema = z.object({
  student_id: z.string().min(1, "Please select a student"),
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string(),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  status: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
  notes: z.string(),
  homework: z.string(),
  price: z.number().min(0, "Price must be 0 or more"),
  payment_status: z.enum(["unpaid", "paid", "waived"]),
});

export type SessionFormData = z.infer<typeof sessionSchema>;
