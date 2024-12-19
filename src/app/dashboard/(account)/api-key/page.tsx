import { DashboardPage } from "@/components/dashboard-page";
import { redirect } from "next/navigation";
import { ApiKeySettings } from "./api-key-settings";

const Page = async () => {
  return (
    <DashboardPage title="API Key">
      <ApiKeySettings apiKey={""} />
    </DashboardPage>
  );
};

export default Page;
