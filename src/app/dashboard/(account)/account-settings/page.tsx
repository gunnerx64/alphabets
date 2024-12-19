import { DashboardPage } from "@/components/dashboard-page";
import { redirect } from "next/navigation";
import { AccountSettings } from "./setttings-page-content";

const Page = async () => {
  return (
    <DashboardPage title="Account Settings">
      <AccountSettings discordId={""} />
    </DashboardPage>
  );
};

export default Page;
