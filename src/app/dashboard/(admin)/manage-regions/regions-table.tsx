"use client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Edit2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegionSelect } from "@/server/db/schema";
import { BaseDataTableColumnHeader } from "@/components/table/base-datatable-column-header";
import { RegionFormDialog } from "./region-form-dialog";
import { api } from "@/trpc/react";
import { TooltipBase } from "@/components/tooltip-base";
import { AlertDialogBase } from "@/components/alert-dialog-base";
import { addLineBreak } from "@/lib/addLineBreak";
import { toast } from "@/hooks/use-toast";
import { ErrorCard } from "@/components/error-card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { BaseDataTable } from "@/components/table/base-datatable";

const columnHelper = createColumnHelper<RegionSelect>();

// Make some columns!
const defaultColumns: ColumnDef<RegionSelect, any>[] = [
  // Display Column
  columnHelper.display({
    id: "index",
    header: "№ п/п",
    cell: (props) => <div className="text-center">{props.row.index + 1}</div>,
  }),
  columnHelper.accessor("title", {
    id: "название региона",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Название региона" />
    ),
    minSize: 120,
    size: 150,
    maxSize: 320,
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("state", {
    id: "республика",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Республика" />
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor("sort", {
    id: "сортировка",
    header: ({ column }) => (
      <BaseDataTableColumnHeader column={column} title="Сортировка" />
    ),
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.display({
    id: "actions",
    header: "Действия",
    cell: (props) => {
      const utils = api.useUtils();
      const { mutate: deleteItem, isPending: isDeleting } =
        api.region.deleteRegion.useMutation({
          onSettled: (res, error) => {
            if (res?.success) {
              toast({
                variant: "success",
                title: "Успешная операция",
                description: `Регион ${props.row.original.title} удалён.`,
              });
              utils.region.getRegions.invalidate();
            } else {
              toast({
                variant: "destructive",
                title: "Ошибка при удалении региона",
                description: res?.message || error?.message,
              });
            }
          },
        });

      return (
        <div className="flex">
          <RegionFormDialog region={props.row.original} mode="edit">
            <Button size={"icon"} variant={"ghost"}>
              <TooltipBase title="Изменить">
                <Edit2 />
              </TooltipBase>
            </Button>
          </RegionFormDialog>
          <AlertDialogBase
            title="Удаление записи"
            desc={addLineBreak(
              `Вы действительно хотите удалить регион '${props.row.original.title}'?\nУдалять регионы, связанные хотя бы с одной алфавиткой запрещено.\nОтменить удаление невозможно.`,
            )}
            confirmCallback={() => {
              console.log(`Удаляется регион ${props.row.original.title}...`);
              deleteItem(props.row.original.id);
            }}
          >
            <Button
              size={"icon"}
              variant={"ghost"}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700"
            >
              <TooltipBase title="Удалить регион">
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

export function RegionsTable() {
  const {
    data: regions,
    isPending: isLoading,
    error,
  } = api.region.getRegions.useQuery();

  return (
    <div className="mt-2 flex flex-col items-center justify-start gap-2">
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorCard title={error.toString()} desc={error.message} />
      ) : (
        <>
          <div className="flex items-center justify-evenly">
            <RegionFormDialog mode="create">
              <Button>Добавить регион</Button>
            </RegionFormDialog>
          </div>
          <BaseDataTable
            columns={defaultColumns}
            data={regions}
            styles="w-full max-w-[1280px]"
            showToolbar
          />
        </>
      )}
    </div>
  );
}
