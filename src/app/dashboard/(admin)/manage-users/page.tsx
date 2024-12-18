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
    <DashboardPage title="Управление пользователями">
      <Heading>TODO: реализовать таблицу с пользователями</Heading>
      <Heading>Для каждого пользователя доступно 3 действия:</Heading>
      <Heading>- изменить статус активен/неактивен</Heading>
      <Heading>- изменить роль пользователя</Heading>
      <Heading>- удалить пользователя (но он всё равно сможет зайти)</Heading>
    </DashboardPage>
  );
};

export default Page;
