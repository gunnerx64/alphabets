import React, { Suspense } from "react";
import { CardForm } from "@/components/card-form";
import { DashboardPage } from "@/components/dashboard-page";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getRegionsOptions } from "@/server/api/routers/region";
import { getCard } from "@/server/api/routers/card";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  if (typeof id !== "string") return notFound();
  const editCard = await getCard(id);
  if (!editCard) return notFound();
  const regions = await getRegionsOptions();

  return (
    <DashboardPage title="Редактирование алфавитки">
      <Suspense fallback={<LoadingSpinner />}>
        <CardForm mode="edit" editCard={editCard} regions={regions} />
      </Suspense>
    </DashboardPage>
  );
}
