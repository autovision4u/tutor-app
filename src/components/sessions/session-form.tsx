"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { sessionSchema, type SessionFormData } from "@/lib/validations";
import { createSession, updateSession } from "@/lib/actions/sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Session, Student } from "@/types";

export function SessionForm({
  session,
  students,
  defaultDate,
  onClose,
}: {
  session?: Session;
  students: Student[];
  defaultDate?: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      student_id: session?.student_id ?? "",
      title: session?.title ?? "",
      subject: session?.subject ?? "Mathematics",
      topic: session?.topic ?? "",
      date: session?.date ?? defaultDate ?? new Date().toISOString().split("T")[0],
      start_time: session?.start_time?.slice(0, 5) ?? "",
      end_time: session?.end_time?.slice(0, 5) ?? "",
      status: session?.status ?? "scheduled",
      notes: session?.notes ?? "",
      homework: session?.homework ?? "",
      price: session?.price ?? 150,
      payment_status: session?.payment_status ?? "unpaid",
    },
  });

  const status = watch("status");
  const paymentStatus = watch("payment_status");
  const studentId = watch("student_id");

  async function onSubmit(data: SessionFormData) {
    setLoading(true);
    setError("");
    try {
      if (session) {
        await updateSession(session.id, data);
      } else {
        await createSession(data);
      }
      if (onClose) {
        router.refresh();
        onClose();
      } else {
        router.push("/sessions");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Student & Title */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Student *</Label>
          <Select
            value={studentId}
            onValueChange={(v) => setValue("student_id", v ?? "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.student_id && (
            <p className="text-sm text-destructive">{errors.student_id.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} placeholder="e.g. Algebra Review" />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
      </div>

      {/* Subject & Topic */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" {...register("subject")} placeholder="Mathematics" />
          {errors.subject && (
            <p className="text-sm text-destructive">{errors.subject.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" {...register("topic")} placeholder="e.g. Quadratic Equations" />
        </div>
      </div>

      {/* Date & Times */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time *</Label>
          <Input id="start_time" type="time" {...register("start_time")} />
          {errors.start_time && (
            <p className="text-sm text-destructive">{errors.start_time.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time *</Label>
          <Input id="end_time" type="time" {...register("end_time")} />
          {errors.end_time && (
            <p className="text-sm text-destructive">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      {/* Status & Payment */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) =>
              setValue("status", (v ?? "scheduled") as SessionFormData["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (ILS) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="10"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Payment Status</Label>
          <Select
            value={paymentStatus}
            onValueChange={(v) =>
              setValue("payment_status", (v ?? "unpaid") as SessionFormData["payment_status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="waived">Waived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes & Homework */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} rows={3} placeholder="Session notes..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="homework">Homework</Label>
          <Textarea id="homework" {...register("homework")} rows={3} placeholder="Assigned homework..." />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        {onClose ? (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : session ? (
            "Update Session"
          ) : (
            "Create Session"
          )}
        </Button>
      </div>
    </form>
  );
}
