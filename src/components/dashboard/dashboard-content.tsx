"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { he, enUS, ru } from "date-fns/locale";
import { useTranslation } from "@/lib/i18n/context";
import {
  Users,
  CalendarDays,
  CalendarClock,
  DollarSign,
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentDetailsDialog } from "./student-details-dialog";
import type { SessionWithStudent, Student } from "@/types";

const dateFnsLocales = { he, en: enUS, ru };

type DashboardData = {
  totalStudents: number;
  todaySessions: SessionWithStudent[];
  upcomingSessions: SessionWithStudent[];
  unpaidSessions: SessionWithStudent[];
};

type Period = "today" | "week" | "month" | "all";

function filterByPeriod(sessions: SessionWithStudent[], period: Period): SessionWithStudent[] {
  if (period === "all") return sessions;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return sessions.filter((s) => {
    const d = new Date(s.date);
    if (period === "today") return d >= today && d < new Date(today.getTime() + 86400000);
    if (period === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
      return d >= weekStart && d < weekEnd;
    }
    if (period === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(target);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setValue(0);
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, mounted]);

  return value;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  gradientFrom,
  gradientTo,
  isNumber = false,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  gradientFrom: string;
  gradientTo: string;
  isNumber?: boolean;
}) {
  const numValue = typeof value === "number" ? value : 0;
  const displayNum = useCountUp(numValue);
  const displayValue = isNumber ? displayNum.toLocaleString() : value;

  return (
    <Card className="group relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 80% 0%, ${gradientFrom}20, transparent 60%)`,
        }}
      />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2 tracking-tight">{displayValue}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
            )}
          </div>
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
              boxShadow: `0 8px 24px ${gradientFrom}40`,
            }}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionRow({
  session,
  onStudentClick,
}: {
  session: SessionWithStudent;
  onStudentClick: (student: Student) => void;
}) {
  const { locale } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;

  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-200">
      <button
        type="button"
        onClick={() => onStudentClick(session.student)}
        className="flex items-center gap-3 min-w-0 text-start flex-1 hover:translate-x-1 transition-transform"
      >
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-md"
          style={{
            background: "linear-gradient(135deg, oklch(0.7 0.15 290), oklch(0.7 0.18 330))",
          }}
        >
          <span className="text-sm font-bold text-white">
            {session.student.full_name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{session.student.full_name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {session.title} &middot; {session.subject}
          </p>
        </div>
      </button>
      <Link
        href={`/sessions/${session.id}`}
        className="text-end shrink-0 ms-3 hover:opacity-70 transition-opacity"
      >
        <p className="text-sm font-semibold">
          {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(session.date), "MMM d", { locale: dfLocale })}
        </p>
      </Link>
    </div>
  );
}

export function DashboardContent({
  data,
  allSessions,
}: {
  data: DashboardData;
  allSessions: SessionWithStudent[];
}) {
  const { t, locale, dir } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const [period, setPeriod] = useState<Period>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const unpaidFiltered = filterByPeriod(data.unpaidSessions, period);
  const unpaidTotal = unpaidFiltered.reduce((sum, s) => sum + Number(s.price), 0);
  const todayEarnings = data.todaySessions.reduce((sum, s) => sum + Number(s.price), 0);

  const gradients = {
    purple: { from: "oklch(0.6 0.2 290)", to: "oklch(0.55 0.22 320)" },
    pink: { from: "oklch(0.65 0.2 340)", to: "oklch(0.6 0.22 310)" },
    blue: { from: "oklch(0.65 0.18 260)", to: "oklch(0.6 0.2 280)" },
    green: { from: "oklch(0.7 0.18 160)", to: "oklch(0.65 0.2 180)" },
    orange: { from: "oklch(0.7 0.18 40)", to: "oklch(0.65 0.2 20)" },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {t("dashboard.title")}
            <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy", { locale: dfLocale })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">{t("dashboard.period.today")}</SelectItem>
              <SelectItem value="week">{t("dashboard.period.week")}</SelectItem>
              <SelectItem value="month">{t("dashboard.period.month")}</SelectItem>
              <SelectItem value="all">{t("dashboard.period.all")}</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/sessions/new" className={buttonVariants()}>
            <Plus className="h-4 w-4 me-2" />
            {t("dashboard.newSession")}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={t("dashboard.totalStudents")}
          value={data.totalStudents}
          icon={Users}
          gradientFrom={gradients.purple.from}
          gradientTo={gradients.purple.to}
          isNumber
        />
        <StatCard
          title={t("dashboard.todaySessions")}
          value={data.todaySessions.length}
          icon={CalendarDays}
          gradientFrom={gradients.pink.from}
          gradientTo={gradients.pink.to}
          isNumber
        />
        <StatCard
          title={t("dashboard.upcoming")}
          value={data.upcomingSessions.length}
          icon={CalendarClock}
          description={t("dashboard.scheduledSessions")}
          gradientFrom={gradients.blue.from}
          gradientTo={gradients.blue.to}
          isNumber
        />
        <StatCard
          title={t("dashboard.todayEarnings")}
          value={`${todayEarnings.toLocaleString()} ${t("common.ils")}`}
          icon={TrendingUp}
          description={`${data.todaySessions.length} ${t("dashboard.sessions")}`}
          gradientFrom={gradients.green.from}
          gradientTo={gradients.green.to}
        />
        <StatCard
          title={t("dashboard.unpaid")}
          value={unpaidFiltered.length}
          icon={DollarSign}
          description={t("dashboard.totalILS", { amount: unpaidTotal.toLocaleString() })}
          gradientFrom={gradients.orange.from}
          gradientTo={gradients.orange.to}
          isNumber
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${gradients.pink.from}, ${gradients.pink.to})`,
                }}
              >
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              {t("dashboard.todaySessions")}
            </CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {t("dashboard.viewAll")} <ArrowIcon className="ms-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.todaySessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("dashboard.noSessionsToday")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.todaySessions.map((session) => (
                  <SessionRow key={session.id} session={session} onStudentClick={setSelectedStudent} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${gradients.blue.from}, ${gradients.blue.to})`,
                }}
              >
                <CalendarClock className="h-4 w-4 text-white" />
              </div>
              {t("dashboard.upcomingSessions")}
            </CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {t("dashboard.viewAll")} <ArrowIcon className="ms-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingSessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CalendarClock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("dashboard.noUpcoming")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.upcomingSessions.slice(0, 5).map((session) => (
                  <SessionRow key={session.id} session={session} onStudentClick={setSelectedStudent} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unpaid Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${gradients.orange.from}, ${gradients.orange.to})`,
                }}
              >
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              {t("dashboard.unpaidSessions")}
              {unpaidFiltered.length > 0 && (
                <Badge variant="secondary" className="ms-2 text-sm px-3 py-1">
                  {unpaidTotal.toLocaleString()} {t("common.ils")}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unpaidFiltered.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("dashboard.allPaid")}</p>
              </div>
            ) : (
              <div className="grid gap-1 sm:grid-cols-2">
                {unpaidFiltered.map((session) => (
                  <button
                    type="button"
                    key={session.id}
                    onClick={() => setSelectedStudent(session.student)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/50 transition-all duration-200 hover:translate-x-1 text-start w-full"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {session.student.full_name} — {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.date), "MMM d, yyyy", { locale: dfLocale })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 ms-2 font-semibold">
                      {Number(session.price).toLocaleString()} {t("common.ils")}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StudentDetailsDialog
        student={selectedStudent}
        sessions={allSessions}
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
