import { getStudents } from "@/lib/actions/students";
import { SessionForm } from "@/components/sessions/session-form";
import { Card, CardContent } from "@/components/ui/card";
import { SessionPageHeader } from "@/components/sessions/session-page-header";

export default async function NewSessionPage() {
  const students = await getStudents();

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <SessionPageHeader type="create" />
        <CardContent>
          <SessionForm students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
