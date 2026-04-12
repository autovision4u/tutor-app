export type Student = {
  id: string;
  full_name: string;
  phone: string | null;
  parent_phone: string | null;
  grade_level: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PaymentStatus = "unpaid" | "paid" | "waived";

export type Session = {
  id: string;
  student_id: string;
  title: string;
  subject: string;
  topic: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: SessionStatus;
  notes: string | null;
  homework: string | null;
  price: number;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  student?: Student;
};

export type SessionWithStudent = Session & {
  student: Student;
};
