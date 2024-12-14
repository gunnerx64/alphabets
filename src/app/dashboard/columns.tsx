"use client";
import Image from "next/image";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PrinterIcon, XSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardWithRefs } from "@/server/db/schema";
import { useSession } from "next-auth/react";
import { addLineBreak } from "@/lib/addLineBreak";
import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { TinyBadge } from "@/components/tiny-badge";
import { TooltipBase } from "@/components/tooltip-base";
import { AlertDialogBase } from "@/components/alert-dialog-base";
import Link from "next/link";

const columnHelper = createColumnHelper<CardWithRefs>();

// Make some columns with helper
export const buildCardColumns = (
  isAdmin: boolean,
  isGuest: boolean,
): ColumnDef<CardWithRefs, any>[] => [
  columnHelper.display({
    id: "index",
    header: "№ п/п",
    cell: (info) => {
      const pagination = info.table.getState().pagination;
      return (
        <Link href={`/dashboard/card/${info.row.original.id}`}>
          <div className="grid min-w-[42px] grid-cols-1 gap-1">
            <div className="w-full text-center text-base font-bold">
              {pagination.pageIndex * pagination.pageSize + info.row.index + 1}
            </div>
          </div>
        </Link>
      );
    },
  }),
  columnHelper.display({
    id: "bio",
    header: "Личные данные",
    // header: ({ column }) => (
    //   <BaseDataTableColumnHeader column={column} title="№ трупа" />
    // ),
    cell: (info) => {
      const fullName = `${info.row.original.lastname} ${info.row.original.firstname} ${info.row.original.middlename ?? ""}`;
      const birthdate = info.row.original.birthdate.toLocaleDateString("ru-ru");
      const token = info.row.original.token;
      const rankComment = info.row.original.rankComment;
      const updatedBy = info.row.original.updatedBy?.fullName;
      const updatedAt = info.row.original.updatedAt
        ? `${info.row.original.updatedAt.toLocaleTimeString(
            "ru-RU",
          )} ${info.row.original.updatedAt.toLocaleDateString("ru-RU")}`
        : "";
      const updatedByCaption =
        updatedBy && updatedAt ? `${updatedBy} (${updatedAt})` : "";

      return (
        <Link href={`/dashboard/card/${info.row.original.id}`}>
          <div className="grid min-w-[150px] grid-cols-1 gap-1 xl:min-w-[220px] xl:grid-cols-2">
            <div className="col-span-2 break-words">
              <TinyBadge>фио</TinyBadge>{" "}
              <span className="font-bold">{fullName}</span>
            </div>
            <div>
              <TinyBadge>д.р.</TinyBadge> {birthdate}
            </div>
            {token ? (
              <div className="col-span-2 break-words">
                <TinyBadge>личный номер</TinyBadge> {token}
              </div>
            ) : (
              <div></div>
            )}
            {rankComment ? (
              <div className="col-span-2 break-words">
                <TinyBadge>в.звание</TinyBadge> {rankComment}
              </div>
            ) : (
              <div></div>
            )}
            {isAdmin && updatedByCaption && (
              <div className="col-span-2 break-words">
                <TinyBadge>редактировал</TinyBadge>
                {updatedAt}
              </div>
            )}
          </div>
        </Link>
      );
    },
    footer: (props) => props.column.id,
  }),
  columnHelper.display({
    id: "graduate",
    header: "Сведения о выпуске",
    // header: ({ column }) => (
    //   <BaseDataTableColumnHeader column={column} title="№ трупа" />
    // ),
    cell: (info) => {
      const region = info.row.original.region?.title ?? "";
      const admissionYear = info.row.original.admissionYear;
      const graduateYear = info.row.original.graduateYear;
      const exclusionDate = info.row.original.exclusionDate
        ? new Date(info.row.original.exclusionDate).toLocaleDateString("ru-ru")
        : null;
      const exclusionComment = info.row.original.exclusionComment;

      return (
        <Link href={`/dashboard/card/${info.row.original.id}`}>
          <div className="grid min-w-[150px] grid-cols-1 gap-1 xl:min-w-[200px]">
            <div className="break-words">
              <TinyBadge>откуда прибыл</TinyBadge> {region}
            </div>
            <div>
              <TinyBadge>год поступления</TinyBadge> {admissionYear}
            </div>
            {graduateYear && (
              <div>
                <TinyBadge>год выпуска</TinyBadge> {graduateYear}
              </div>
            )}
            {exclusionDate && (
              <div className="break-words">
                <TinyBadge>дата исключения</TinyBadge> {exclusionDate}
              </div>
            )}
            {exclusionComment && (
              <div className="break-words">
                <TinyBadge>причина</TinyBadge> {exclusionComment}
              </div>
            )}
          </div>
        </Link>
      );
    },
    footer: (props) => props.column.id,
  }),
  columnHelper.display({
    id: "scan",
    header: "Скан оригинала",
    cell: (props) => {
      return (
        <div className="flex min-w-[64px] items-center">
          <Image
            width={100}
            height={60}
            src="/bento-any-event.png"
            alt="Скан алфавитки ..."
          />
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "action",
    header: "Действия",
    // header: () => <div className="text-center font-extrabold">Д</div>,
    cell: (props) => {
      const cardId = props.row.original.id;
      const lastname = props.row.original.lastname;

      const { data: session } = useSession();
      if (!session) return null;
      console.log(`session expires in ${session.expires}`);

      const queryClient = useQueryClient();
      const { mutate: deleteCard, isPending: isDeletingCard } = useMutation({
        mutationFn: async (id: string) => {
          await client.card.deleteCard.$post({ id });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get-cards"] });
          queryClient.invalidateQueries({ queryKey: ["get-cards-total"] });
          toast({
            variant: "default",
            title: `Удаление`,
            description: `Карточка ${lastname} удалена.`,
          });
        },
      });

      return (
        <div className="flex flex-col items-center space-y-2">
          {/* Печать*/}
          {!isGuest && (
            <TooltipBase title="Распечатать карточку">
              <Button
                size="icon"
                variant="outline"
                aria-label={`Распечатать карточку ${lastname}`}
                onClick={() =>
                  alert(
                    "TODO: после клика будет сгенерирован текстовый документ ИЛИ, если хватит ума, будет сгенерирован pdf и сразу отправлен на печать",
                  )
                }
              >
                <PrinterIcon size={20} />
              </Button>
            </TooltipBase>
          )}
          {/* Изменить, открывается в новой вкладке*/}
          {/* <TooltipBase title="Редактировать карточку">
              <Button size="icon" variant="outline">
                <Link
                  href={`/corpses/${row.original.id}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FileEdit size={20} />
                </Link>
              </Button>
            </TooltipBase> */}
          {/* Delete card */}
          {isAdmin && (
            <AlertDialogBase
              title="Удаление карточки"
              desc={
                <div className="text-red-600">
                  {addLineBreak(
                    `Вы действительно хотите удалить карточку "${lastname}"?\nЭто действие отменить невозможно.`,
                  )}
                </div>
              }
              confirmCallback={() => deleteCard(cardId)}
            >
              <Button
                // key={`remove-${row.id}`}
                size="icon"
                variant="outline"
                className="text-red-500 hover:text-red-700"
                disabled={isDeletingCard}
              >
                <TooltipBase title="Удалить карточку">
                  <XSquare size={20} />
                </TooltipBase>
              </Button>
            </AlertDialogBase>
          )}
        </div>
      );
    },
  }),
];
