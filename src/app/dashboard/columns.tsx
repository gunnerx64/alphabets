"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PrinterIcon, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardWithRefs } from "@/server/db/schema";
import { addLineBreak } from "@/lib/addLineBreak";
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
    header: () => <div className="text-center font-semibold">№ п/п</div>,
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
    header: () => (
      <div className="text-center font-semibold">Личные данные</div>
    ),
    // header: ({ column }) => (
    //   <BaseDataTableColumnHeader column={column} title="номер" />
    // ),
    cell: (info) => {
      const fullName = `${info.row.original.lastname} ${info.row.original.firstname} ${info.row.original.middlename ?? ""}`;
      const birthdate = info.row.original.birthdate
        ? new Date(info.row.original.birthdate).toLocaleDateString("ru-ru")
        : null;
      const token = info.row.original.token;
      const rankComment = info.row.original.rankComment;
      const updatedBy = info.row.original.updatedBy;
      const updatedAt = info.row.original.updatedAt
        ? `${info.row.original.updatedAt.toLocaleTimeString(
            "ru-RU",
          )} ${info.row.original.updatedAt.toLocaleDateString("ru-RU")}`
        : "";
      const updatedByCaption =
        updatedBy && updatedAt ? `${updatedBy} (${updatedAt})` : "";

      return (
        <Link href={`/dashboard/card/${info.row.original.id}`}>
          <div className="grid min-w-[190px] grid-cols-2 gap-1">
            <div className="text-right">
              <TinyBadge className="text-right">фио</TinyBadge>
            </div>
            <span className="break-words font-bold">{fullName}</span>
            <div className="text-right">
              <TinyBadge>д.р.</TinyBadge>
            </div>
            <span>{birthdate} г.</span>
            {token && (
              <>
                <div className="text-right">
                  <TinyBadge>личный номер</TinyBadge>
                </div>
                <div>{token}</div>
              </>
            )}
            {isAdmin && updatedByCaption && (
              <>
                <div className="text-right">
                  <TinyBadge variant={"destructive"}>изменил</TinyBadge>
                </div>
                <div className="break-words">{updatedByCaption}</div>
              </>
            )}
          </div>
        </Link>
      );
    },
    footer: (props) => props.column.id,
  }),
  columnHelper.display({
    id: "admission",
    header: () => (
      <div className="text-center font-semibold">Сведения об обучении</div>
    ),
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
          <div className="grid min-w-[230px] grid-cols-2 gap-1">
            <div className="text-right">
              <TinyBadge>откуда прибыл</TinyBadge>
            </div>
            <div className="break-words">{region}</div>
            <div className="text-right">
              <TinyBadge>год поступления</TinyBadge>
            </div>
            <div>{admissionYear}</div>

            {graduateYear && (
              <>
                <div className="text-right">
                  <TinyBadge>год выпуска</TinyBadge>
                </div>
                <div>{graduateYear}</div>
              </>
            )}
            {graduateYear && exclusionComment && (
              <>
                <div className="text-right">
                  <TinyBadge>комментарий</TinyBadge>
                </div>
                <div>{exclusionComment}</div>
              </>
            )}
            {exclusionDate && (
              <>
                <div className="text-right">
                  <TinyBadge>исключён</TinyBadge>
                </div>
                <div>{exclusionDate} г.</div>
              </>
            )}
            {exclusionDate && exclusionComment && (
              <>
                <div className="text-right">
                  <TinyBadge>комментарий</TinyBadge>
                </div>
                <div>{exclusionComment}</div>
              </>
            )}
          </div>
        </Link>
      );
    },
    footer: (props) => props.column.id,
  }),
  columnHelper.display({
    id: "action",
    header: () => <div className="text-center font-semibold">Действия</div>,
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
        <div className="flex flex-col items-center justify-center gap-1 xl:flex-row">
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
          {isAdmin && (
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
          )}
        </div>
      );
    },
  }),
];
