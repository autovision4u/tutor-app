"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { he, enUS, ru } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/actions/sessions";
import { useTranslation } from "@/lib/i18n/context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";
import type { SessionWithStudent, Student } from "@/types";

const dateFnsLocales = { he, en: enUS, ru };

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  no_show: "bg-red-100 text-red-800",
};

const paymentColors: Record<string, string> = {
  unpaid: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
  waived: "bg-gray-100 text-gray-800",
};

type SortKey = "date" | "student" | "price" | "status";
type SortDir = "asc" | "desc";

export function SessionsTable({
  sessions,
  students,
}: {
  sessions: SessionWithStudent[];
  students: Student[];
}) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const dfLocale = dateFnsLocales[locale] ?? enUS;
  const [search, setSearch] = useState("");
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    let result = sessions;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.student.full_name.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          (s.topic?.toLowerCase().includes(q) ?? false)
      );
    }

    if (filterStudent !== "all") result = result.filter((s) => s.student_id === filterStudent);
    if (filterStatus !== "all") result = result.filter((s) => s.status === filterStatus);
    if (filterPayment !== "all") result = result.filter((s) => s.payment_status === filterPayment);

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time);
          break;
        case "student":
          cmp = a.student.full_name.localeCompare(b.student.full_name);
          break;
        case "price":
          cmp = Number(a.price) - Number(b.price);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [sessions, search, filterStudent, filterStatus, filterPayment, sortKey, sortDir]);

  async function handleDelete(id: string) {
    if (!confirm(t("sessions.deleteConfirm"))) return;
    await deleteSession(id);
    router.refresh();
  }

  function SortableHead({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    return (
      <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(sortKeyName)}>
        <span className="flex items-center gap-1">
          {label}
          <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
        </span>
      </TableHead>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("sessions.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <Select value={filterStudent} onValueChange={(v) => setFilterStudent(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder={t("sessions.allStudents")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("sessions.allStudents")}</SelectItem>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder={t("sessions.allStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("sessions.allStatus")}</SelectItem>
            <SelectItem value="scheduled">{t("status.scheduled")}</SelectItem>
            <SelectItem value="completed">{t("status.completed")}</SelectItem>
            <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
            <SelectItem value="no_show">{t("status.no_show")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={(v) => setFilterPayment(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder={t("sessions.allPayment")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("sessions.allPayment")}</SelectItem>
            <SelectItem value="unpaid">{t("payment.unpaid")}</SelectItem>
            <SelectItem value="paid">{t("payment.paid")}</SelectItem>
            <SelectItem value="waived">{t("payment.waived")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">{t("sessions.noSessions")}</h3>
            <p className="text-sm text-muted-foreground">
              {sessions.length === 0 ? t("sessions.createFirst") : t("sessions.adjustFilters")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label={t("sessions.date")} sortKeyName="date" />
                  <TableHead className="hidden sm:table-cell">{t("sessions.time")}</TableHead>
                  <SortableHead label={t("sessions.student")} sortKeyName="student" />
                  <TableHead className="hidden md:table-cell">{t("sessions.titleLabel")}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t("sessions.subject")}</TableHead>
                  <SortableHead label={t("sessions.status")} sortKeyName="status" />
                  <SortableHead label={t("sessions.price")} sortKeyName="price" />
                  <TableHead className="hidden sm:table-cell">{t("sessions.payment")}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((session) => (
                  <TableRow
                    key={session.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/sessions/${session.id}`)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(session.date), "MMM d, yyyy", { locale: dfLocale })}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell whitespace-nowrap text-muted-foreground">
                      {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {session.student.full_name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium truncate max-w-[120px]">
                          {session.student.full_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[150px]">
                      {session.title}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {session.subject}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[session.status]}>
                        {t(`status.${session.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {Number(session.price).toLocaleString()} {t("common.ils")}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="secondary" className={paymentColors[session.payment_status]}>
                        {t(`payment.${session.payment_status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/sessions/${session.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4 me-2" />
                            {t("common.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(session.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 me-2" />
                            {t("common.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-end">
        {t("sessions.showing", { filtered: filtered.length, total: sessions.length })}
      </p>
    </div>
  );
}
