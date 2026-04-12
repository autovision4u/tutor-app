"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { SessionsTable } from "./sessions-table";
import { SessionsCalendar } from "./sessions-calendar";
import { Plus, TableProperties, CalendarDays } from "lucide-react";
import type { SessionWithStudent, Student } from "@/types";

export function SessionsPageClient({
  sessions,
  students,
}: {
  sessions: SessionWithStudent[];
  students: Student[];
}) {
  const [view, setView] = useState<"table" | "calendar">("table");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/sessions/new" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Link>
      </div>

      {/* View tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "calendar")}>
        <TabsList>
          <TabsTrigger value="table">
            <TableProperties className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-4">
          <SessionsTable sessions={sessions} students={students} />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <SessionsCalendar sessions={sessions} students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
