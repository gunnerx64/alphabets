"use client";
import { useMemo } from "react";
import {
  Clock,
  Database,
  Edit,
  Printer,
  Scan,
  Trash2,
  User2,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { CardWithRefs } from "@/server/db/schema";
import { TooltipBase } from "@/components/tooltip-base";
import { AlertDialogBase } from "@/components/alert-dialog-base";
import { addLineBreak } from "@/lib/addLineBreak";
import { shortenFullName } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { ImageZoom } from "@/components/image/image-zoom";

interface DataElementProps {
  Icon?: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}
const DataElement = ({ title, content: value, Icon }: DataElementProps) => (
  <div className="flex items-center text-base/5 font-medium">
    {Icon && <Icon className="mr-2 size-4 text-brand-500" />}
    <span className="text-sm/5">{title}:</span>
    <span className="ml-1 font-semibold">{value}</span>
  </div>
);

interface CardPageContentProps {
  storageUrl: string;
  card: CardWithRefs;
}
export const CardPageContent = ({ card, storageUrl }: CardPageContentProps) => {
  const [fullName] = useMemo(
    () => shortenFullName(card.lastname, card.firstname, card.middlename),
    [card],
  );
  const deleteMutation = api.card.deleteCard.useMutation({
    onSuccess() {
      toast({
        variant: "default",
        title: `Удаление`,
        description: `Карточка "${fullName}" удалена.`,
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: `Удаление`,
        description: `Ошибка при удалении карточки: ${error.message}`,
      });
    },
  });

  return (
    <div className="group relative">
      <div className="absolute inset-px z-0 rounded-lg bg-white dark:bg-slate-700" />
      <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />
      <div className="relative z-10 p-6 text-foreground/90">
        <div className="mb-6 flex flex-col items-center gap-4 xl:flex-row-reverse xl:justify-between">
          {/* <div
              className="size-12 rounded-full"
              style={{
                backgroundColor: "#f3f4f6",
              }}
            /> */}

          <div className="mt-4 flex items-center justify-center gap-4 sm:justify-end">
            <Button
              variant="default"
              size="sm"
              aria-label={`Распечатать карточку ${card.lastname}`}
              onClick={() =>
                alert(
                  "TODO: после клика будет сгенерирован текстовый документ ИЛИ, если хватит ума, будет сгенерирован pdf и сразу отправлен на печать",
                )
              }
            >
              <Printer className="mr-1 size-4" /> Печать
            </Button>
            <Link href={`/dashboard/card/${card.id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="transition-colors hover:text-brand-600"
                aria-label={`Редактировать карточку ${card.lastname}`}
              >
                <Edit className="mr-1 size-4" /> Изменить
              </Button>
            </Link>
            <AlertDialogBase
              title="Удаление карточки"
              desc={addLineBreak(
                `Вы действительно хотите удалить карточку "${fullName}"?\nЭто действие отменить невозможно.`,
              )}
              confirmCallback={() => deleteMutation.mutate({ id: card.id })}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 transition-colors hover:text-red-600"
                aria-label={`Удалить карточку ${fullName}`}
              >
                <TooltipBase title="Удалить карточку">
                  <Trash2 className="size-5" />
                </TooltipBase>
              </Button>
            </AlertDialogBase>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-medium tracking-tight">
              {card.lastname} {card.firstname} {card.middlename ?? ""}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="mb-6 space-y-3">
            <DataElement
              Icon={Clock}
              title="Дата рождения"
              content={format(card.birthdate, "d MMMM yyyy г.", {
                locale: ru,
              })}
            />
            <DataElement
              Icon={Clock}
              title="Личный номер"
              content={card.token ?? "нет данных"}
            />
            <DataElement
              Icon={User2}
              title="В.звание"
              content={card.rankComment ?? "нет данных"}
            />
            <DataElement
              Icon={Scan}
              title="Оригинал"
              content={"TODO: Превью фото скана"}
            />
            {card.createdBy && (
              <DataElement
                Icon={Database}
                title="Оцифровал"
                content={`${card.createdBy.name} (${card.createdAt.toLocaleDateString("ru-ru")} г.)`}
              />
            )}
            {card.updatedAt && card.updatedBy && (
              <DataElement
                Icon={Clock}
                title="Редактировал"
                content={`${card.updatedBy} (${card.updatedAt.toLocaleTimeString("ru-ru")} ${card.updatedAt.toLocaleDateString("ru-ru")} г.)`}
              />
            )}
          </div>

          <div className="mb-6 space-y-3">
            <DataElement
              Icon={Clock}
              title="Откуда прибыл"
              content={card.region?.title ?? "нет данных"}
            />
            <DataElement
              Icon={Clock}
              title="Год поступления"
              content={`${card.admissionYear}`}
            />
            {(card.graduateYear ||
              (!card.graduateYear && !card.exclusionDate)) && (
              <DataElement
                Icon={Clock}
                title="Год выпуска"
                content={`${card.graduateYear ?? "нет данных"}`}
              />
            )}
            {(card.exclusionDate ||
              (!card.graduateYear && !card.exclusionDate)) && (
              <>
                <DataElement
                  Icon={Clock}
                  title="Дата исключения"
                  content={`${card.exclusionDate ? new Date(card.exclusionDate).toLocaleDateString("ru-ru") + " г." : "нет данных"}`}
                />
              </>
            )}
            <DataElement
              Icon={Clock}
              title="Комментарий к выпуску"
              content={`${card.exclusionComment ?? "отсутсвует"}`}
            />
          </div>
        </div>

        {card.scanUrl && <ImageZoom src={storageUrl + card.scanUrl} />}
      </div>
    </div>
  );
};
