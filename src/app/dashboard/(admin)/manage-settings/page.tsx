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
      <Heading>TODO: кнопка для проверки целостности базы картинок</Heading>
      <Heading>
        TODO: кнопка для удаления лишних картинок, на которых нет ссылок в БД
      </Heading>
    </DashboardPage>
  );
};

export default Page;
