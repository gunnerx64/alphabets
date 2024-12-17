import React, { Suspense } from "react";
import { CardForm } from "@/components/card-form";
import { DashboardPage } from "@/components/dashboard-page";
import { LoadingSpinner } from "@/components/loading-spinner";
import { getRegionsOptions } from "@/server/api/routers/region";

export default async function Page() {
  const regions = await getRegionsOptions();
  return (
    <DashboardPage title="Создание алфавитки">
      <Suspense fallback={<LoadingSpinner />}>
        <CardForm mode="create" regions={regions} />
      </Suspense>
    </DashboardPage>
  );
}
