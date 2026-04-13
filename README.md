# TutorApp - Tutor Management Dashboard

A modern web application for private tutors to manage their students, sessions, payments, and business settings.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS 4 + shadcn-style components
- **Forms:** React Hook Form + Zod validation
- **Dates:** date-fns
- **Deployment:** Vercel

## Features

- **Authentication** - Email/password login with Supabase Auth
- **Student Management** - Full CRUD for student records (name, phone, parent phone, grade, notes)
- **Session Management** - Create, edit, delete tutoring sessions with table and calendar views
- **Payment Tracking** - Track session prices and payment status (paid/unpaid/waived)
- **Dashboard** - Overview with stats, today's sessions, upcoming sessions, unpaid invoices
- **Time Period Filter** - Filter dashboard data by today/week/month/all time
- **Business Settings** - Configure business name, owner info, hourly rate (persisted in Supabase)
- **Multi-language (i18n)** - Full support for Hebrew (RTL), English, and Russian
- **RTL/LTR** - Automatic direction switching based on selected language
- **Responsive** - Mobile-friendly with collapsible sidebar
- **Pastel Theme** - Light purple/pink cloud-themed design

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/autovision4u/tutor-app.git
   cd tutor-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the database schema in Supabase SQL Editor:
   - `supabase-schema.sql` - Creates students and sessions tables with seed data
   - `supabase-settings.sql` - Creates settings table for business info

5. Create a user in Supabase Authentication dashboard

6. Start the dev server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

## Project Structure

```
src/
  app/
    (auth)/login/        # Login page
    (dashboard)/
      dashboard/         # Main dashboard
      students/          # Students page
      sessions/          # Sessions list, create, edit
      settings/          # Business settings
    layout.tsx           # Root layout with i18n provider
  components/
    dashboard/           # Dashboard stats and content
    layout/              # Sidebar navigation
    sessions/            # Session forms, table, calendar
    students/            # Student forms and list
    settings/            # Settings form
    ui/                  # Reusable UI components (shadcn)
  lib/
    actions/             # Server actions (auth, students, sessions, settings)
    i18n/                # Translation system (he, en, ru)
    supabase/            # Supabase client/server/middleware
    validations.ts       # Zod schemas
  types/                 # TypeScript types
  proxy.ts               # Next.js 16 proxy (auth middleware)
```

## Database Schema

- **students** - Student records with contact info
- **sessions** - Tutoring sessions linked to students, with scheduling, pricing, and payment tracking
- **settings** - Single-row business configuration

All tables use Row Level Security (RLS) - only authenticated users can access data.

## Live Demo

https://tutor-app-zeta.vercel.app
