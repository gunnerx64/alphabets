"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PrinterIcon, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardWithRefs } from "@/server/db/schema";
import { addLineBreak } from "@/lib/addLineBreak";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { TinyBadge } from "@/components/tiny-badge";
import { TooltipBase } from "@/components/tooltip-base";
import { AlertDialogBase } from "@/components/alert-dialog-base";
import { api } from "@/trpc/react";

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
      const birthdate = info.row.original.birthdate
        ? new Date(info.row.original.birthdate).toLocaleDateString("ru-ru")
        : null;
      const token = info.row.original.token;
      const rankComment = info.row.original.rankComment;
      const updatedBy = info.row.original.updatedBy?.name;
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
      const utils = api.useUtils();
      const deleteMutation = api.card.deleteCard.useMutation({
        onSuccess(data, variables, context) {
          utils.card.getCards.invalidate();
          utils.card.getCardsCount.invalidate();
          toast({
            variant: "default",
            title: `Удаление`,
            description: `Карточка ${lastname} удалена.`,
          });
        },
        onError(error, variables, context) {
          toast({
            variant: "destructive",
            title: `Удаление`,
            description: `Ошибка при удалении карточки: ${error.message}`,
          });
        },
      });

      return (
        <div className="flex flex-col items-center space-y-2">
          {/* Печать*/}
          {
            <TooltipBase title="Распечатать карточку">
              <Button
                size="icon"
                variant="outline"
                disabled={isGuest}
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
          }
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
          {
            <AlertDialogBase
              title="Удаление карточки"
              desc={addLineBreak(
                `Вы действительно хотите удалить карточку "${lastname}"?\nЭто действие отменить невозможно.`,
              )}
              confirmCallback={() => deleteMutation.mutate({ id: cardId })}
            >
              <Button
                size="icon"
                variant="outline"
                className="text-red-500 hover:text-red-700"
                disabled={deleteMutation.isPending || !isAdmin}
              >
                <TooltipBase title="Удалить карточку">
                  <XSquare size={20} />
                </TooltipBase>
              </Button>
            </AlertDialogBase>
          }
        </div>
      );
    },
  }),
];
