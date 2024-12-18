import assert from "assert";
import { DashboardPage } from "@/components/dashboard-page";
import { auth } from "@/server/auth";
import { getUser } from "@/server/api/routers/user";
import { Heading } from "@/components/heading";

const Page = async () => {
  const session = await auth();
  assert(session?.user, "middleware не отработал");

  const user = await getUser(session.user.id);
  assert(user, `пользователь с id ${session.user.id} не найден в БД`);

  return (
    <DashboardPage title="Управление регионами">
      <Heading>
        TODO: реализовать таблицу с CRUD операциями над регионами
      </Heading>
      <Heading>
        * если регион был хоть 1 раз выбран для алфавитки, его нельзя удалить
      </Heading>
    </DashboardPage>
  );
};

export default Page;
