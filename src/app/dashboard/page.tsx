import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { DashboardPage } from "@/components/dashboard-page";
import { auth } from "@/server/auth";
import { DashboardPageContent } from "./dashboard-page-content";
import { Button } from "@/components/ui/button";
// import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { db } from "@/server/db";
import Link from "next/link";
import { users } from "@/server/db/schema";

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect("/signin");
  }

  const user = await db.query.users.findFirst({
    columns: { id: true, name: true, role: true, active: true },
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    console.warn("Strange, user is not found in db...");
    return redirect("/welcome");
  }
  const { intent, success } = await searchParams;

  // if (intent === "upgrade") {
  //   const session = await createCheckoutSession({
  //     userEmail: user.email,
  //     userId: user.id,
  //   })

  //   if (session.url) redirect(session.url)
  // }

  return (
    <>
      {success ? (
        <p>Модальный успех оплаты</p> /*<PaymentSuccessModal />*/
      ) : null}

      <DashboardPage
        cta={
          <Link href={"/dashboard/card/create"}>
            <Button className="w-full sm:w-fit">
              <PlusIcon className="mr-2 size-4" />
              Добавить алфавитку
            </Button>
          </Link>
        }
        title="Алфавитки"
      >
        <DashboardPageContent
          isAdmin={user.role == "admin"}
          isGuest={user.role == "guest"}
        />
      </DashboardPage>
    </>
  );
};

export default Page;
