import { CardForm } from "@/components/card-form";
import { DashboardPage } from "@/components/dashboard-page";
import React from "react";

export default function Page() {
  return (
    <DashboardPage title="Добавить алфавитку">
      <CardForm mode="create" />
    </DashboardPage>
  );
}
