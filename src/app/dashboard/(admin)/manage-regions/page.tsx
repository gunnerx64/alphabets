import { DashboardPage } from "@/components/dashboard-page";
import { RegionsTable } from "./regions-table";

export default function Page() {
  return (
    <DashboardPage title="Управление регионами">
      <RegionsTable />
    </DashboardPage>
  );
}
