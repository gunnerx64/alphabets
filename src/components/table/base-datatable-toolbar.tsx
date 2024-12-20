"use client";
import { useMemo } from "react";
import { Table } from "@tanstack/react-table";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CircleUser, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityOptions, LogItemOptions, RoleOptions } from "@/static-data";
import { OptionItem } from "@/types";
import { BaseDataTableFacetedFilter } from "./base-datatable-faceted-filter";
import { BaseDataTableViewOptions } from "./base-datatable-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BaseDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const convertMapToOptions = (
    uniqueValues?: Map<any, number>,
  ): OptionItem[] => {
    const result: OptionItem[] = [];
    if (uniqueValues)
      for (const val of uniqueValues.keys())
        result.push({ id: val, title: val });
    return result;
  };

  const convertArrayToOptions = (
    uniqueValues?: string[] | undefined,
  ): OptionItem[] => {
    const result: OptionItem[] = [];
    if (uniqueValues)
      for (const val of uniqueValues) result.push({ id: val, title: val });
    return result;
  };

  /** Builds a unique set of column values,
   * then converts set to OptionItem array for shiny Dropdown
   * @param columnId to process */
  const buildUniqueColumnOptions = (columnId: string): OptionItem[] => {
    const found = table
      .getCoreRowModel()
      .rows.at(0)
      ?.getAllCells()
      .find(({ column: { id } }) => id === columnId);
    if (!found) return [];
    const values = table
      .getCoreRowModel()
      .flatRows.map((row) => row.getValue<string>(columnId)); // as string[];
    return convertArrayToOptions(Array.from(new Set(values)));
  };

  const uniqueStateValues = useMemo(() => {
    return buildUniqueColumnOptions("республика");
  }, [table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("название региона") && (
          <Input
            placeholder="Фильтр по региону..."
            value={
              (table
                .getColumn("название региона")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("название региона")
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("республика") && (
          <BaseDataTableFacetedFilter
            column={table.getColumn("республика")}
            title="Республика"
            options={uniqueStateValues}
          />
        )}

        {/* {table.getColumn("фамилия") && (
          <Input
            placeholder="Фильтр по фамилии.."
            value={
              (table.getColumn("фамилия")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("фамилия")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("ФИО") && (
          <Input
            placeholder="Фильтр по фамилии.."
            value={(table.getColumn("ФИО")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("ФИО")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("специальность") && (
          <Input
            placeholder="Фильтр по специальности.."
            value={
              (table.getColumn("специальность")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("специальность")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("подразделение") && (
          <Input
            placeholder="Фильтр по подразделению.."
            value={
              (table.getColumn("подразделение")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("подразделение")
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {table.getColumn("пользователь") && (
          <Input
            placeholder="Фильтр по пользователю.."
            value={
              (table.getColumn("пользователь")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("пользователь")
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )} */}

        {/* {table.getColumn("уровень") && (
          <BaseDataTableFacetedFilter
            column={table.getColumn("уровень")}
            title="Уровень"
            options={LogItemOptions}
          />
        )}
        {table.getColumn("роль") && (
          <BaseDataTableFacetedFilter
            column={table.getColumn("роль")}
            title="Роль"
            options={RoleOptions}
          />
        )}
       
        {table.getColumn("активен") && (
          <BaseDataTableFacetedFilter
            column={table.getColumn("активен")}
            title="Активен"
            options={ActivityOptions}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Сбросить
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <BaseDataTableViewOptions table={table} />
    </div>
  );
}
