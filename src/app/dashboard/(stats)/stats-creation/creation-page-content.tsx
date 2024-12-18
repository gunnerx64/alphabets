"use client";
import { startOfToday } from "date-fns";
import { BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const usersKpi = [
  { name: "Иванов А.В.", today: 23, total: 234 },
  { name: "Сидаков В.У.", today: 40, total: 134 },
  { name: "Кувашев Н.Е.", today: 26, total: 169 },
];

export const CreationPageContent = () => {
  const [isFetchingMock, setIsFetchingMock] = useState(true);
  const [isFetching] = useDebounce(isFetchingMock, 2000);
  useEffect(() => {
    setIsFetchingMock(false);
    return () => {
      setIsFetchingMock(true);
    };
  }, []);

  console.log(isFetchingMock, isFetching);

  // const { data: createdToday, isPending: isTodayFetching } =
  //   api.user.getPersonalCreatedCardsCount.useQuery(startOfToday());

  // const { data: createdTotal, isPending: isTotalFetching } =
  //   api.user.getPersonalCreatedCardsCount.useQuery();

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        Производительность сотрудников за{" "}
        {startOfToday().toLocaleDateString("ru-ru")} г.
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isFetching ? (
          <LoadingSpinner />
        ) : (
          usersKpi.map(({ name, today, total }, idx) => (
            <Card key={idx} className="border-2 border-brand-700 p-4">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">{name}</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold">{today}</p>
                <p className="text-xs/5 text-muted-foreground">
                  За всё время: {total}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
