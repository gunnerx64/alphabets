import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const DashboardEmptyState = () => {
  return (
    <Card className="flex flex-1 flex-col items-center justify-center rounded-2xl p-6 text-center">
      <div className="flex w-full justify-center">
        <img
          src="/brand-asset-wave.png"
          alt="No categories"
          className="-mt-24 size-48"
        />
      </div>

      <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
        В системе нет алфавиток
      </h1>

      <p className="mb-8 mt-2 max-w-prose text-sm/6 text-gray-600">
        Для начала работы необходимо добавить в базу данных оцифрованные
        алфавитки.
      </p>

      <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Link href="/dashboard/card/create">
          <Button className="flex w-full items-center space-x-2 sm:w-auto">
            <span>Добавить алфавитку</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
};
