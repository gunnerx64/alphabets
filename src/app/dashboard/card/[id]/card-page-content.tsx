"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { client } from "@/lib/client";
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
import { CardSelect } from "@/server/db/schema";
import { Modal } from "@/components/ui/modal";

interface DataElementProps {
  Icon?: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}
const DataElement = ({ title, content: value, Icon }: DataElementProps) => (
  <div className="flex items-center text-base/5 font-medium text-gray-600">
    {Icon && <Icon className="mr-2 size-4 text-brand-500" />}
    <span className="text-sm/5">{title}:</span>
    <span className="ml-1 font-semibold">{value}</span>
  </div>
);

interface CardPageContentProps {
  //hasEvents: boolean;
  card: CardSelect;
}
export const CardPageContent = ({
  //hasEvents: initialHasEvents,
  card,
}: CardPageContentProps) => {
  const [deletingCard, setDeletingCard] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate: deleteCard, isPending: isDeletingCard } = useMutation({
    mutationFn: async (id: string) => {
      await client.card.deleteCard.$post({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cards"] });
      queryClient.invalidateQueries({ queryKey: ["get-cards-total"] });
      setDeletingCard(null);
    },
  });
  return (
    <>
      <div className="group relative">
        <div className="absolute inset-px z-0 rounded-lg bg-white" />
        <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />
        <div className="relative z-10 p-6">
          <div className="mb-6 flex flex-col items-center gap-4">
            {/* <div
              className="size-12 rounded-full"
              style={{
                backgroundColor: "#f3f4f6",
              }}
            /> */}

            <div className="flex flex-col items-center">
              <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                {"📂"} {card.lastname} {card.firstname} {card.middlename ?? ""}
              </h3>
              <p className="text-base/6 text-gray-600">
                {format(card.birthdate, "д.р. dd MMMM yyyy г.", { locale: ru })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2">
            <div className="mb-6 space-y-3">
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
              <DataElement
                Icon={Database}
                title="Оцифровал"
                content={`${card.createdBy.fullName} (${card.createdAt.toLocaleDateString("ru-ru")} г.)`}
              />
              {card.updatedAt && (
                <DataElement
                  Icon={Clock}
                  title="Редактировал"
                  content={`${card.updatedByUserId} (${card.updatedAt.toLocaleDateString("ru-ru")} г.)`}
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
                  <DataElement
                    Icon={Clock}
                    title="Причина исключения"
                    content={`${card.exclusionComment ?? "нет данных"}`}
                  />
                </>
              )}
            </div>
          </div>
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
            <Button
              variant="outline"
              size="sm"
              className="transition-colors hover:text-brand-600"
              aria-label={`Редактировать карточку ${card.lastname}`}
              onClick={() => console.log("ОТКРЫТЬ МОД. ОКНО РЕДАКТИРОВАНИЯ")}
            >
              <Edit className="mr-1 size-4" /> Изменить
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 transition-colors hover:text-red-600"
              aria-label={`Удалить карточку ${card.lastname}`}
              onClick={() =>
                setDeletingCard(
                  `${card.lastname} ${card.firstname[0]}.${card.middlename?.at(0)}.`,
                )
              }
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <Modal
        showModal={!!deletingCard}
        setShowModal={() => setDeletingCard(null)}
        className="max-w-md p-8"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg/7 font-medium tracking-tight text-gray-950">
              Удаление карточки
            </h2>
            <p className="text-sm/6 text-gray-600">
              Вы действительно хотите удалить карточку "{deletingCard}"?
              <br />
              Это действие не может быть отменено.
            </p>
          </div>

          <div className="flex justify-end space-x-3 border-t pt-4">
            <Button variant="outline" onClick={() => setDeletingCard(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingCard && deleteCard(deletingCard)}
              disabled={isDeletingCard}
            >
              {isDeletingCard ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
