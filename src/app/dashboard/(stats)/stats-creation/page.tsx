import assert from "assert";
import { DashboardPage } from "@/components/dashboard-page";
import { CreationPageContent } from "./creation-page-content";
import { auth } from "@/server/auth";
import { getUser } from "@/server/api/routers/user";

const Page = async () => {
  const session = await auth();
  assert(session?.user, "middleware не отработал");

  const user = await getUser(session.user.id);
  assert(user, `пользователь с id ${session.user.id} не найден в БД`);

  return (
    <DashboardPage title={`Новые алфавитки`}>
      <CreationPageContent />
    </DashboardPage>
  );
};

export default Page;
