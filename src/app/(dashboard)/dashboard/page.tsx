import { getDashboardData, getSessions } from "@/lib/actions/sessions";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const [data, allSessions] = await Promise.all([getDashboardData(), getSessions()]);
  return <DashboardContent data={data} allSessions={allSessions} />;
}
