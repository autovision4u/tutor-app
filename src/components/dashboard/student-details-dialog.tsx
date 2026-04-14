"use client";

import Link from "next/link";
import { format } from "date-fns";
import { he, enUS, ru } from "date-fns/locale";
import { useTranslation } from "@/lib/i18n/context";
import { translateSubject } from "@/lib/subjects";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { SessionWithStudent, Student } from "@/types";

const dateFnsLocales = { he, en: enUS, ru };

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  no_show: "bg-red-100 text-red-800",
};

export function StudentDetailsDialog({
  student,
  sessions,
  open,
  onClose,
}: {
  student: Student | null;
  sessions: SessionWithStudent[];
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale, dir } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (!student) return null;

  const studentSessions = sessions
    .filter((s) => s.student_id === student.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalEarnings = studentSessions
    .filter((s) => s.payment_status === "paid")
    .reduce((sum, s) => sum + Number(s.price), 0);

  const unpaidAmount = studentSessions
    .filter((s) => s.payment_status === "unpaid")
    .reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{
              background: "linear-gradient(135deg, oklch(0.6 0.2 290), oklch(0.55 0.22 320))",
            }}
          >
            <span className="text-xl font-bold text-white">
              {student.full_name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">{student.full_name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("studentDetails.subtitle", { count: studentSessions.length })}
              {student.grade_level && ` • ${student.grade_level}`}
            </p>
            {student.phone && (
              <p className="text-xs text-muted-foreground mt-1">{student.phone}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, oklch(0.95 0.05 160), oklch(0.93 0.06 180))",
            }}
          >
            <p className="text-xs text-muted-foreground font-medium">
              {t("studentDetails.totalEarnings")}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "oklch(0.4 0.18 160)" }}>
              {totalEarnings.toLocaleString()} {t("common.ils")}
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, oklch(0.95 0.05 40), oklch(0.93 0.07 20))",
            }}
          >
            <p className="text-xs text-muted-foreground font-medium">
              {t("studentDetails.unpaidAmount")}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "oklch(0.5 0.2 30)" }}>
              {unpaidAmount.toLocaleString()} {t("common.ils")}
            </p>
          </div>
        </div>

        {/* Sessions list */}
        {studentSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{t("studentDetails.noSessions")}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {studentSessions.map((s) => (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-all hover:translate-x-1"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{s.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{format(new Date(s.date), "MMM d, yyyy", { locale: dfLocale })}</span>
                    <span>•</span>
                    <span>{s.start_time.slice(0, 5)}</span>
                    <span>•</span>
                    <span>{translateSubject(s.subject, t)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ms-2">
                  <Badge variant="secondary" className={statusColors[s.status]}>
                    {t(`status.${s.status}`)}
                  </Badge>
                  <span
                    className="font-bold text-sm"
                    style={{
                      color:
                        s.payment_status === "paid"
                          ? "oklch(0.5 0.18 160)"
                          : s.payment_status === "unpaid"
                            ? "oklch(0.55 0.22 30)"
                            : "oklch(0.5 0.02 280)",
                    }}
                  >
                    {Number(s.price).toLocaleString()} {t("common.ils")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t flex justify-end">
          <Link
            href={`/sessions?student=${student.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
            onClick={onClose}
          >
            {t("studentDetails.viewAll")}
            <ArrowIcon className="ms-1 h-3 w-3" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
