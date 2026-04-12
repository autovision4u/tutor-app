"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Users,
  CalendarDays,
  CalendarClock,
  DollarSign,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SessionWithStudent } from "@/types";

type DashboardData = {
  totalStudents: number;
  todaySessions: SessionWithStudent[];
  upcomingSessions: SessionWithStudent[];
  unpaidSessions: SessionWithStudent[];
};

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
      <div className="text-right shrink-0 ml-3">
        <p className="text-sm font-medium">
          {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(session.date), "MMM d")}
        </p>
      </div>
    </Link>
  );
}

export function DashboardContent({ data }: { data: DashboardData }) {
  const unpaidTotal = data.unpaidSessions.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Link href="/sessions/new" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          icon={Users}
        />
        <StatCard
          title="Today's Sessions"
          value={data.todaySessions.length}
          icon={CalendarDays}
        />
        <StatCard
          title="Upcoming"
          value={data.upcomingSessions.length}
          icon={CalendarClock}
          description="Scheduled sessions"
        />
        <StatCard
          title="Unpaid"
          value={data.unpaidSessions.length}
          icon={DollarSign}
          description={`Total: ${unpaidTotal.toLocaleString()} ILS`}
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Today&apos;s Sessions</CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.todaySessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sessions scheduled for today</p>
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
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
            <Link href="/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              View all <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming sessions</p>
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
              Unpaid Sessions
              {data.unpaidSessions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unpaidTotal.toLocaleString()} ILS
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.unpaidSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">All sessions are paid!</p>
              </div>
            ) : (
              <div className="grid gap-1 sm:grid-cols-2">
                {data.unpaidSessions.map((session) => (
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
                        {format(new Date(session.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 ml-2">
                      {Number(session.price).toLocaleString()} ILS
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
