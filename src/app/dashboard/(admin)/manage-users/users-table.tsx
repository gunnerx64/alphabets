"use client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Edit2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegionSelect, UserWithRefs } from "@/server/db/schema";
import { BaseDataTableColumnHeader } from "@/components/table/base-datatable-column-header";
import { RegionFormDialog } from "../manage-regions/region-form-dialog";
import { api } from "@/trpc/react";
import { TooltipBase } from "@/components/tooltip-base";
import { AlertDialogBase } from "@/components/alert-dialog-base";
import { addLineBreak } from "@/lib/addLineBreak";
import { toast } from "@/hooks/use-toast";
import { ErrorCard } from "@/components/error-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { BaseDataTable } from "@/components/table/base-datatable";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { RoleOptions } from "@/static-data";
import { Switch } from "@/components/ui/switch";

const columnHelper = createColumnHelper<UserWithRefs>();

// Make some columns!
const defaultColumns: ColumnDef<UserWithRefs, any>[] = [
  // Display Column
  columnHelper.display({
    id: "index",
    header: "№ п/п",
    cell: (props) => <div className="text-center">{props.row.index + 1}</div>,
  }),
  columnHelper.display({
    id: "image",
    header: "Аватар",
    cell: (info) => (
      <Fragment>
        <Image
          width={32}
          height={32}
          src={"/user-1.png" ?? info.row.original.image}
          alt={info.row.original.name ?? "CN"}
        />
      </Fragment>
    ),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("name", {
    id: "ФИО",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Сотрудник" />
    ),
    minSize: 120,
    size: 150,
    maxSize: 320,
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("email", {
    id: "эл. почта",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Эл. почта" />
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("totalCards", {
    id: "оцифровал",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Кол-во дел" />
    ),
    maxSize: 60,
    cell: (info) => (
      <div className="text-md text-center font-bold">
        {info.getValue() || ""}
      </div>
    ),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("role", {
    id: "роль",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Роль" />
    ),
    cell: (info) =>
      RoleOptions.find(({ id }) => id === info.getValue())?.title ||
      "нет данных",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("active", {
    id: "активен",
    header: "Активен",
    filterFn: "weakEquals",
    enableSorting: false,
    cell: (info) => {
      const [active, setActive] = useState<boolean>(info.getValue());
      useEffect(() => {
        setActive(info.row.original.active);
      }, [info.row.original]);
      const { mutate: toggleActive, isPending } =
        api.user.toggleActive.useMutation({
          onSettled: (res, error) => {
            if (res?.success) {
              setActive(!active);
              toast({
                variant: "success",
                title: "Успешная операция",
                description: `Учетная запись ${info.row.original.name} ${active ? "отключена" : "включена"}`,
              });
            } else {
              toast({
                variant: "destructive",
                title: "Ошибка при изменении статуса",
                description: res?.message || error?.message,
              });
            }
          },
        });
      return (
        <Switch
          checked={active}
          disabled={isPending}
          onCheckedChange={() => {
            toggleActive(info.row.original.id);
          }}
        />
      );
    },
    footer: (props) => props.column.id,
  }),

  columnHelper.display({
    id: "actions",
    header: "Действия",
    cell: (props) => {
      const utils = api.useUtils();
      const { mutate: deleteItem, isPending: isDeleting } =
        api.user.deleteUser.useMutation({
          onSettled: (res, error) => {
            if (res?.success) {
              toast({
                variant: "success",
                title: "Успешная операция",
                description: `Пользователь ${props.row.original.name} удалён.`,
              });
              utils.user.getAllUsers.invalidate();
            } else {
              toast({
                variant: "destructive",
                title: "Ошибка при удалении пользователя",
                description: res?.message || error?.message,
              });
            }
          },
        });

      return (
        <div className="flex">
          {/* <RegionFormDialog region={props.row.original} mode="edit">
            <Button size={"icon"} variant={"ghost"}>
              <TooltipBase title="Изменить">
                <Edit2 />
              </TooltipBase>
            </Button>
          </RegionFormDialog> */}
          <AlertDialogBase
            title="Удаление записи"
            desc={addLineBreak(
              `Вы действительно хотите удалить пользователя '${props.row.original.name}'?\nУдалять пользователей, связанных хотя бы с одной алфавиткой запрещено.\nОтменить удаление невозможно.`,
            )}
            confirmCallback={() => {
              console.log(
                `Удаляется пользователь ${props.row.original.name}...`,
              );
              deleteItem(props.row.original.id);
            }}
          >
            <Button
              size={"icon"}
              variant={"ghost"}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700"
            >
              <TooltipBase title="Удалить пользователя">
                <Trash />
              </TooltipBase>
            </Button>
          </AlertDialogBase>
        </div>
      );
    },
    footer: (props) => props.column.id,
  }),
];

export function UsersTable() {
  const {
    data: users,
    isPending: isLoading,
    error,
  } = api.user.getAllUsers.useQuery();

  return (
    <div className="mt-2 flex flex-col items-center justify-start gap-2">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorCard title={error.toString()} desc={error.message} />
      ) : (
        <BaseDataTable
          columns={defaultColumns}
          data={users}
          styles="w-full max-w-[1280px]"
          showToolbar
        />
      )}
    </div>
  );
}
