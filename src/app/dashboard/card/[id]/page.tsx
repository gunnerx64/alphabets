import { notFound, redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-page";
import { CardPageContent } from "./card-page-content";
import { auth } from "@/server/auth";
import { client } from "@/lib/client";
import { db, table } from "@/server/db";
import { eq } from "drizzle-orm";
import { shortenFullName } from "@/utils";

interface PageProps {
  params: {
    id: string | string[] | undefined;
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = params;
  if (typeof id !== "string") return notFound();

  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect("/signin");
  }

  // if (!auth) {
  //   return notFound()
  // }

  const fetchCard = async () => {
    const res = await client.card.getCard.$get({ id });
    return await res.json();
  };

  const card = await db.query.card.findFirst({
    with: {
      region: true,
      createdBy: true,
      updatedBy: true,
    },
    where: eq(table.card.id, id),
  });

  if (!card) return notFound();

  return (
    <DashboardPage
      title={shortenFullName(card.lastname, card.firstname, card.middlename)}
    >
      <CardPageContent card={card} />
    </DashboardPage>
  );
};

export default Page;
