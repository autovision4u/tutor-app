import { z } from "zod";

type T = (key: string) => string;

export function createStudentSchema(t: T) {
  return z.object({
    full_name: z.string().min(2, t("validation.nameMin")),
    phone: z.string(),
    parent_phone: z.string(),
    grade_level: z.string(),
    notes: z.string(),
  });
}

export type StudentFormData = z.infer<ReturnType<typeof createStudentSchema>>;

export function createSessionSchema(t: T) {
  return z.object({
    student_id: z.string().min(1, t("validation.selectStudent")),
    title: z.string().min(1, t("validation.titleRequired")),
    subject: z.string().min(1, t("validation.subjectRequired")),
    topic: z.string(),
    date: z.string().min(1, t("validation.dateRequired")),
    start_time: z.string().min(1, t("validation.startTimeRequired")),
    end_time: z.string().min(1, t("validation.endTimeRequired")),
    status: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
    notes: z.string(),
    homework: z.string(),
    price: z.number().min(0, t("validation.priceMin")),
    payment_status: z.enum(["unpaid", "paid", "waived"]),
  });
}

export type SessionFormData = z.infer<ReturnType<typeof createSessionSchema>>;
