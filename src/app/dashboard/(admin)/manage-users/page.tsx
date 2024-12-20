import { DashboardPage } from "@/components/dashboard-page";
import { UsersTable } from "./users-table";

export default function Page() {
  return (
    <DashboardPage title="Управление регионами">
      <UsersTable />
    </DashboardPage>
  );
}
