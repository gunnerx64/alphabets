"use client";
import { startOfToday } from "date-fns";
import { BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { RoleOptions } from "@/static-data";
import { api } from "@/trpc/react";
import { Role } from "@/types";

export const ProfilePageContent = ({ role }: { role: Role }) => {
  const roleTitle = RoleOptions.find(({ id, title }) => id === role)?.title;

  const { data: createdToday, isPending: isTodayFetching } =
    api.user.getPersonalCreatedCardsCount.useQuery(startOfToday());

  const { data: createdTotal, isPending: isTotalFetching } =
    api.user.getPersonalCreatedCardsCount.useQuery();

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        {roleTitle && (
          <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
            Уровень допуска: {roleTitle}
          </h1>
        )}
        {role !== "admin" && (
          <p className="max-w-prose text-sm/6 text-gray-600">
            Для изменения уровня допуска обратитесь к администратору.
          </p>
        )}
      </div>

      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        Персональная производительность
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isTodayFetching ? (
          <LoadingSpinner />
        ) : (
          <Card className="border-2 border-brand-700 p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm/6 font-medium">За сутки</p>
              <BarChart className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-2xl font-bold">{createdToday || 0}</p>
              <p className="text-xs/5 text-muted-foreground">
                Оцифрованные вами алфавитки
              </p>
            </div>
          </Card>
        )}
        {isTodayFetching ? (
          <LoadingSpinner />
        ) : (
          <Card className="p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm/6 font-medium">За всё время</p>
              <BarChart className="size-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-2xl font-bold">{createdTotal || 0}</p>
              <p className="text-xs/5 text-muted-foreground">
                {" "}
                Оцифрованные вами алфавитки
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
