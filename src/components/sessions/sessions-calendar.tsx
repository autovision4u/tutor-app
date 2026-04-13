"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "date-fns";
import { he, enUS, ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SessionForm } from "./session-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SessionWithStudent, Student } from "@/types";

const dateFnsLocales = { he, en: enUS, ru };

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
  no_show: "bg-red-500",
};

type ViewMode = "month" | "week";

export function SessionsCalendar({
  sessions,
  students,
}: {
  sessions: SessionWithStudent[];
  students: Student[];
}) {
  const router = useRouter();
  const { t, locale, dir } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const dayNames = [
    t("calendar.sun"), t("calendar.mon"), t("calendar.tue"), t("calendar.wed"),
    t("calendar.thu"), t("calendar.fri"), t("calendar.sat"),
  ];

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SessionWithStudent[]>();
    sessions.forEach((session) => {
      const dateKey = session.date;
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(session);
    });
    map.forEach((daySessions) =>
      daySessions.sort((a, b) => a.start_time.localeCompare(b.start_time))
    );
    return map;
  }, [sessions]);

  const days = useMemo(() => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
      const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: calStart, end: calEnd });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  }, [currentDate, viewMode]);

  function navigate(direction: "prev" | "next") {
    if (viewMode === "month") {
      setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else {
      setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    }
  }

  function handleDayClick(day: Date) {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setDialogOpen(true);
  }

  function handleSessionClick(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation();
    router.push(`/sessions/${sessionId}`);
  }

  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-4">
      {/* Calendar header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("prev")}>
            <PrevIcon className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold min-w-[200px] text-center">
            {viewMode === "month"
              ? format(currentDate, "MMMM yyyy", { locale: dfLocale })
              : t("calendar.weekOf", { date: format(startOfWeek(currentDate, { weekStartsOn: 0 }), "MMM d, yyyy", { locale: dfLocale }) })}
          </h2>
          <Button variant="outline" size="icon" onClick={() => navigate("next")}>
            <NextIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            {t("calendar.today")}
          </Button>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("month")}
            >
              {t("calendar.month")}
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("week")}
            >
              {t("calendar.week")}
            </Button>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px bg-muted rounded-t-lg overflow-hidden">
        {dayNames.map((day) => (
          <div key={day} className="bg-muted p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className={cn(
          "grid grid-cols-7 gap-px bg-muted rounded-b-lg overflow-hidden",
          viewMode === "week" ? "auto-rows-[200px]" : "auto-rows-[80px] sm:auto-rows-[100px] lg:auto-rows-[120px]"
        )}
      >
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const daySessions = sessionsByDate.get(dateKey) ?? [];
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={dateKey}
              className={cn(
                "bg-background p-1.5 cursor-pointer transition-colors hover:bg-muted/50 overflow-hidden",
                !isCurrentMonth && viewMode === "month" && "opacity-40"
              )}
              onClick={() => handleDayClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
                {daySessions.length > 0 && viewMode === "month" && (
                  <span className="text-xs text-muted-foreground">{daySessions.length}</span>
                )}
              </div>
              <div className="space-y-0.5">
                {daySessions
                  .slice(0, viewMode === "week" ? 8 : 3)
                  .map((session) => (
                    <div
                      key={session.id}
                      onClick={(e) => handleSessionClick(e, session.id)}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs hover:bg-muted transition-colors cursor-pointer group"
                    >
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusColors[session.status])} />
                      <span className="truncate">
                        <span className="font-medium">{session.start_time.slice(0, 5)}</span>{" "}
                        <span className="text-muted-foreground group-hover:text-foreground">
                          {session.student.full_name.split(" ")[0]}
                        </span>
                      </span>
                    </div>
                  ))}
                {daySessions.length > (viewMode === "week" ? 8 : 3) && (
                  <p className="text-xs text-muted-foreground px-1.5">
                    {t("calendar.more", { count: daySessions.length - (viewMode === "week" ? 8 : 3) })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", color)} />
            <span>{t(`status.${status}`)}</span>
          </div>
        ))}
      </div>

      {/* New session dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">
            {t("calendar.newSession", { date: selectedDate && format(new Date(selectedDate), "MMMM d, yyyy", { locale: dfLocale }) })}
          </h2>
          <SessionForm
            students={students}
            defaultDate={selectedDate}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
