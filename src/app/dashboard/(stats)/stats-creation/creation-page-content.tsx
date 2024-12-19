"use client";
import { startOfDay, startOfToday } from "date-fns";
import { BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const CreationPageContent = () => {
  const { state } = useSidebar();
  const {
    data: userStats,
    isPending,
    error: statsError,
  } = api.stats.getCreationStats.useQuery(startOfDay(new Date()));
  const { data: todayTotal } = api.stats.getTodayCreationCount.useQuery();

  useEffect(() => {
    if (statsError)
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: `${statsError.message}`,
      });
  }, [statsError]);

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-foreground/90">
        Всего создано алфавиток за сутки:{" "}
        {todayTotal === undefined ? "н/д" : todayTotal}
      </h1>
      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-foreground/90">
        Производительность сотрудников за{" "}
        {startOfToday().toLocaleDateString("ru-ru")} г.
      </h1>

      {isPending ? (
        <LoadingSpinner />
      ) : userStats && 0 < userStats.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
            state === "collapsed" ? "" : "",
          )}
        >
          {userStats.map(({ name, image, cardsToday, cardsTotal }, idx) => (
            <Card key={idx} className="border-2 border-brand-700 p-2">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="size-20 rounded-lg">
                  <AvatarImage src={"/user-1.png"} alt={name ?? "USER"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="flex w-full flex-row items-center justify-between space-y-0 pb-1">
                    <p className="text-sm/6 font-medium">{name}</p>
                    <BarChart className="size-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-2xl font-bold">{cardsToday}</p>
                    <p className="text-xs/5 text-muted-foreground">
                      За всё время: {cardsTotal}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};
