import { getDashboardData } from "@/lib/actions/sessions";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardContent data={data} />;
}
