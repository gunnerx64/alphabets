import { notFound, redirect } from "next/navigation";
import { DashboardPage } from "@/components/dashboard-page";
import { CardPageContent } from "./card-page-content";
import { auth } from "@/server/auth";
import { shortenFullName } from "@/lib/utils";
import { getCard } from "@/server/api/routers/card";
import { storageUrlPrefix } from "@/server/utils";

interface PageProps {
  params: Promise<{
    id: string | string[] | undefined;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  if (typeof id !== "string") return notFound();

  const session = await auth();

  if (!session?.user || !session.user.id) {
    redirect("/signin");
  }

  const card = await getCard(id);

  if (!card) return notFound();

  return (
    <DashboardPage
      title={`Просмотр алфавитки «${shortenFullName(card.lastname, card.firstname, card.middlename)}»`}
    >
      <CardPageContent card={card} storageUrl={storageUrlPrefix()} />
    </DashboardPage>
  );
};

export default Page;
