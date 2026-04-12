import { getSessions } from "@/lib/actions/sessions";
import { getStudents } from "@/lib/actions/students";
import { SessionsPageClient } from "@/components/sessions/sessions-page-client";

export default async function SessionsPage() {
  const [sessions, students] = await Promise.all([getSessions(), getStudents()]);
  return <SessionsPageClient sessions={sessions} students={students} />;
}
