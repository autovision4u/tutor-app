import { getStudents } from "@/lib/actions/students";
import { StudentsList } from "@/components/students/students-list";

export default async function StudentsPage() {
  const students = await getStudents();
  return <StudentsList students={students} />;
}
