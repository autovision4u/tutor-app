import { getStudents } from "@/lib/actions/students";
import { SessionForm } from "@/components/sessions/session-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewSessionPage() {
  const students = await getStudents();

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Session</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionForm students={students} />
        </CardContent>
      </Card>
    </div>
  );
}
