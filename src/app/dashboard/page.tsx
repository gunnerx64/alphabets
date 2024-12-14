import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { DashboardPage } from "@/components/dashboard-page";
import { auth } from "@/server/auth";
import { DashboardPageContent } from "./dashboard-page-content";
import { Button } from "@/components/ui/button";
import { PaymentSuccessModal } from "@/components/payment-success-modal";
import { db, table } from "@/server/db";
import Link from "next/link";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect("/signin");
  }

  const user = await db.query.user.findFirst({
    columns: { id: true, name: true, role: true, active: true },
    where: eq(table.user.externalId, session.user.id),
  });

  if (!user) {
    return redirect("/welcome");
  }

  const intent = searchParams.intent;

  // if (intent === "upgrade") {
  //   const session = await createCheckoutSession({
  //     userEmail: user.email,
  //     userId: user.id,
  //   })

  //   if (session.url) redirect(session.url)
  // }

  const success = searchParams.success;

  return (
    <>
      {success ? <PaymentSuccessModal /> : null}

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
