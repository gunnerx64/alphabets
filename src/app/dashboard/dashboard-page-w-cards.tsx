"use client";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, BarChart2, Clock, Database, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { client } from "@/lib/client";
import { DashboardEmptyState } from "./dashboard-empty-state";

export const DashboardPageContent = () => {
  const [deletingCard, setDeletingCard] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: cards, isPending: isCardsLoading } = useQuery({
    queryKey: ["get-cards"],
    queryFn: async () => {
      const res = await client.card.getCards.$get();
      const cards = await res.json();
      return cards;
    },
  });
  const { data: cardsTotal } = useQuery({
    queryKey: ["get-cards-total"],
    queryFn: async () => {
      const res = await client.card.getCardsCount.$get();
      const cardsTotal = await res.json();
      return cardsTotal;
    },
  });

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
      <ul className="grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.id} className="group relative z-10">
            <div className="absolute inset-px z-0 rounded-lg bg-white" />

            <div className="pointer-events-none absolute inset-px z-0 rounded-lg shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-md" />

            <div className="relative z-10 p-6">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className="size-12 rounded-full"
                  style={{
                    backgroundColor: "#f3f4f6",
                  }}
                />

                <div>
                  <h3 className="text-lg/7 font-medium tracking-tight text-gray-950">
                    {"📂"} {card.lastname}
                  </h3>
                  <p className="text-sm/6 text-gray-600">
                    {format(card.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Clock className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Last ping:</span>
                  <span className="ml-1">
                    {formatDistanceToNow(card.createdAt) + " ago"}
                  </span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <Database className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Всего:</span>
                  <span className="ml-1">{cardsTotal || 0}</span>
                </div>
                <div className="flex items-center text-sm/5 text-gray-600">
                  <BarChart2 className="mr-2 size-4 text-brand-500" />
                  <span className="font-medium">Events this month:</span>
                  <span className="ml-1">{0}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/dashboard/card/${card.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                    className: "flex items-center gap-2 text-sm",
                  })}
                >
                  Просмотр <ArrowRight className="size-4" />
                </Link>
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
          </li>
        ))}
      </ul>

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
