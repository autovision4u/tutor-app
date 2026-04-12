import { getSession } from "@/lib/actions/sessions";
import { getStudents } from "@/lib/actions/students";
import { SessionForm } from "@/components/sessions/session-form";
import { DeleteSessionButton } from "@/components/sessions/delete-session-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function EditSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let session;
  try {
    session = await getSession(id);
  } catch {
    notFound();
  }

  const students = await getStudents();

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Session</CardTitle>
          <DeleteSessionButton sessionId={session.id} />
        </CardHeader>
        <CardContent>
          <SessionForm session={session} students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
