-- ============================================
-- Tutor App - Supabase SQL Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Students Table
-- ============================================
create table public.students (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  phone text,
  parent_phone text,
  grade_level text,
  notes text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- ============================================
-- Sessions Table
-- ============================================
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  subject text not null,
  topic text,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  homework text,
  price numeric(10, 2) not null default 0,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'waived')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- ============================================
-- Indexes
-- ============================================
create index idx_sessions_student_id on public.sessions(student_id);
create index idx_sessions_date on public.sessions(date);
create index idx_sessions_status on public.sessions(status);
create index idx_sessions_payment_status on public.sessions(payment_status);

-- ============================================
-- Updated_at trigger function
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_students_updated_at
  before update on public.students
  for each row execute function public.handle_updated_at();

create trigger set_sessions_updated_at
  before update on public.sessions
  for each row execute function public.handle_updated_at();

-- ============================================
-- Row Level Security
-- ============================================
alter table public.students enable row level security;
alter table public.sessions enable row level security;

-- Allow authenticated users full access (single tutor app)
create policy "Authenticated users can manage students"
  on public.students for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can manage sessions"
  on public.sessions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================
-- Seed Data
-- ============================================
insert into public.students (id, full_name, phone, parent_phone, grade_level, notes) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Yael Cohen', '050-1234567', '050-7654321', '10th', 'Strong in algebra, needs help with geometry'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Noam Levy', '052-9876543', '052-3456789', '11th', 'Preparing for bagrut exam'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Maya Shapira', '054-5555555', '054-6666666', '9th', 'Just started trigonometry'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Omer Ben David', '053-1112222', '053-3334444', '12th', 'Advanced calculus student'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Tamar Avraham', '050-9998888', '050-7776666', '8th', 'Beginning algebra');

insert into public.sessions (student_id, title, subject, topic, date, start_time, end_time, status, notes, homework, price, payment_status) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Geometry Basics', 'Mathematics', 'Triangles and Angles', current_date, '14:00', '15:00', 'scheduled', 'Review triangle properties', 'Worksheet page 45-47', 150, 'unpaid'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bagrut Prep #12', 'Mathematics', 'Integration', current_date, '16:00', '17:30', 'scheduled', 'Focus on definite integrals', 'Past exam questions 1-5', 200, 'unpaid'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Trig Introduction', 'Mathematics', 'Sin/Cos/Tan', current_date + interval '1 day', '10:00', '11:00', 'scheduled', null, 'Read chapter 8', 150, 'unpaid'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Calculus Deep Dive', 'Mathematics', 'Differential Equations', current_date + interval '2 days', '15:00', '16:30', 'scheduled', 'Continue from last session', null, 200, 'unpaid'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Algebra Foundations', 'Mathematics', 'Linear Equations', current_date - interval '1 day', '09:00', '10:00', 'completed', 'Great progress today', 'Exercises 3.1-3.5', 120, 'paid'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Algebra Review', 'Mathematics', 'Quadratic Equations', current_date - interval '3 days', '14:00', '15:00', 'completed', null, null, 150, 'paid'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bagrut Prep #11', 'Mathematics', 'Derivatives', current_date - interval '5 days', '16:00', '17:30', 'completed', 'Reviewed chain rule', 'Practice problems set B', 200, 'unpaid'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Missed Session', 'Mathematics', 'Trigonometry', current_date - interval '2 days', '10:00', '11:00', 'no_show', 'Student did not show up', null, 150, 'waived'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Limits & Continuity', 'Mathematics', 'Limits', current_date + interval '5 days', '15:00', '16:30', 'scheduled', null, null, 200, 'unpaid'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Algebra Practice', 'Mathematics', 'Inequalities', current_date + interval '3 days', '09:00', '10:00', 'scheduled', null, null, 120, 'unpaid');
