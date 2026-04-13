"use client";

import { useState } from "react";
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
import type { SessionWithStudent } from "@/types";

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

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionRow({ session }: { session: SessionWithStudent }) {
  const { locale } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;

  return (
    <Link
      href={`/sessions/${session.id}`}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-primary">
            {session.student.full_name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {session.student.full_name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {session.title} &middot; {session.subject}
          </p>
        </div>
      </div>
      <div className="text-end shrink-0 ms-3">
        <p className="text-sm font-medium">
          {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(session.date), "MMM d", { locale: dfLocale })}
        </p>
      </div>
    </Link>
  );
}

export function DashboardContent({ data }: { data: DashboardData }) {
  const { t, locale, dir } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const [period, setPeriod] = useState<Period>("all");
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const unpaidFiltered = filterByPeriod(data.unpaidSessions, period);
  const unpaidTotal = unpaidFiltered.reduce((sum, s) => sum + Number(s.price), 0);
  const todayEarnings = data.todaySessions.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground">
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
        />
        <StatCard
          title={t("dashboard.todaySessions")}
          value={data.todaySessions.length}
          icon={CalendarDays}
        />
        <StatCard
          title={t("dashboard.upcoming")}
          value={data.upcomingSessions.length}
          icon={CalendarClock}
          description={t("dashboard.scheduledSessions")}
        />
        <StatCard
          title={t("dashboard.todayEarnings")}
          value={`${todayEarnings.toLocaleString()} ${t("common.ils")}`}
          icon={DollarSign}
          description={`${data.todaySessions.length} ${t("dashboard.sessions")}`}
        />
        <StatCard
          title={t("dashboard.unpaid")}
          value={unpaidFiltered.length}
          icon={DollarSign}
          description={t("dashboard.totalILS", { amount: unpaidTotal.toLocaleString() })}
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{t("dashboard.todaySessions")}</CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {t("dashboard.viewAll")} <ArrowIcon className="ms-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.todaySessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("dashboard.noSessionsToday")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.todaySessions.map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">{t("dashboard.upcomingSessions")}</CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              {t("dashboard.viewAll")} <ArrowIcon className="ms-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("dashboard.noUpcoming")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.upcomingSessions.slice(0, 5).map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unpaid Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">
              {t("dashboard.unpaidSessions")}
              {unpaidFiltered.length > 0 && (
                <Badge variant="secondary" className="ms-2">
                  {unpaidTotal.toLocaleString()} {t("common.ils")}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unpaidFiltered.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t("dashboard.allPaid")}</p>
              </div>
            ) : (
              <div className="grid gap-1 sm:grid-cols-2">
                {unpaidFiltered.map((session) => (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.student.full_name} — {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.date), "MMM d, yyyy", { locale: dfLocale })}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 ms-2">
                      {Number(session.price).toLocaleString()} {t("common.ils")}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
