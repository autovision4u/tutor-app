import { getSession } from "@/lib/actions/sessions";
import { getStudents } from "@/lib/actions/students";
import { SessionForm } from "@/components/sessions/session-form";
import { DeleteSessionButton } from "@/components/sessions/delete-session-button";
import { Card, CardContent } from "@/components/ui/card";
import { SessionPageHeader } from "@/components/sessions/session-page-header";
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
        <SessionPageHeader type="edit" deleteButton={<DeleteSessionButton sessionId={session.id} />} />
        <CardContent>
          <SessionForm session={session} students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
