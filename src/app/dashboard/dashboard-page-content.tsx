"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, BarChart2, Clock, Database, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buildCardColumns } from "./columns";
import { trpc } from "@/lib/trpc-client";

interface DashboardPageContentProps {
  isAdmin: boolean;
  isGuest: boolean;
}

export const DashboardPageContent = (props: DashboardPageContentProps) => {
  const { isAdmin, isGuest } = props;
  const searchParams = useSearchParams();
  // https://localhost:3000/dashboard/category/sale?page=5&limit=30
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: pageSize,
  });

  const [deletingCard, setDeletingCard] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: cards, isPending: isCardsLoading } =
    trpc.card.getCards.useQuery(
      /*{
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    }*/ undefined,
      {
        refetchInterval: 5000,
      },
    );
  console.log("cards = ", cards);
  const { data: cardsTotal } = trpc.card.getCardsCount.useQuery();

  const { mutate: deleteCard, isPending: isDeletingCard } =
    trpc.card.deleteCard.useMutation();
  const onSuccessCbk = () => {
    queryClient.invalidateQueries({ queryKey: ["get-cards"] });
    queryClient.invalidateQueries({ queryKey: ["get-cards-total"] });
    setDeletingCard(null);
  };

  const columns = useMemo(
    () => buildCardColumns(isAdmin, isGuest),
    [isAdmin, isGuest],
  );
  const table = useReactTable({
    data: cards || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((cardsTotal || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    debugTable: true,
    autoResetPageIndex: false,
    autoResetAll: false,
    autoResetExpanded: false,
    state: {
      // sorting,
      // columnFilters,
      pagination,
    },
  });

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("pageSize", pagination.pageSize.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  if (isCardsLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="group relative z-10 p-1">
            {/* <div className="absolute inset-px z-0 rounded-lg bg-white" /> */}
            <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {isCardsLoading ? (
                  [...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
              onClick={() =>
                deletingCard &&
                deleteCard({ id: deletingCard }, { onSuccess: onSuccessCbk })
              }
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
