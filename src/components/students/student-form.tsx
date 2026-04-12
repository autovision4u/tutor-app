"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { studentSchema, type StudentFormData } from "@/lib/validations";
import { createStudent, updateStudent } from "@/lib/actions/students";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Student } from "@/types";

export function StudentForm({
  student,
  onClose,
}: {
  student?: Student;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: student?.full_name ?? "",
      phone: student?.phone ?? "",
      parent_phone: student?.parent_phone ?? "",
      grade_level: student?.grade_level ?? "",
      notes: student?.notes ?? "",
    },
  });

  async function onSubmit(data: StudentFormData) {
    setLoading(true);
    setError("");
    try {
      if (student) {
        await updateStudent(student.id, data);
      } else {
        await createStudent(data);
      }
      router.refresh();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle>{student ? "Edit Student" : "New Student"}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="050-1234567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_phone">Parent Phone</Label>
              <Input
                id="parent_phone"
                {...register("parent_phone")}
                placeholder="050-7654321"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade_level">Grade Level</Label>
            <Input
              id="grade_level"
              {...register("grade_level")}
              placeholder="e.g. 10th"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Any relevant information..."
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : student ? (
                "Update Student"
              ) : (
                "Create Student"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
