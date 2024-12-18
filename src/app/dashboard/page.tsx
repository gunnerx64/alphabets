import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import assert from "assert";
import { PlusIcon } from "lucide-react";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { DashboardPage } from "@/components/dashboard-page";
import { DashboardPageContent } from "./dashboard-page-content";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth();
  assert(session?.user, "middleware не отработала защиту маршрута /dashboard");

  // if (!session?.user || !session.user.id) {
  //   redirect("/signin");
  // }

  const user = await db.query.users.findFirst({
    columns: { id: true, name: true, role: true, active: true },
    where: eq(users.id, session.user.id),
  });
  assert(user, `пользователь ${session.user.id} не найден в БД`);

  // if (!user) {
  //   console.warn("Strange, user is not found in db...");
  //   return redirect("/welcome");
  // }

  return (
    <DashboardPage
      hideBackButton
      cta={
        <Link href={"/dashboard/card/create"}>
          <Button className="sm:w-fit">
            <PlusIcon className="size-4" />
            Добавить алфавитку
          </Button>
        </Link>
      }
      title="База алфавиток"
    >
      <DashboardPageContent
        isAdmin={user.role == "admin"}
        isGuest={user.role == "guest"}
      />
    </DashboardPage>
  );
}
