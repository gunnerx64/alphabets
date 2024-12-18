import { and, count, eq, gte, lt } from "drizzle-orm";
import {
  createTRPCRouter,
  publicProcedure,
  userProcedure,
} from "@/server/api/trpc";
import { cards, users } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { cache } from "react";
import { z } from "zod";
import { zod } from "@/lib/zod-helpers";
import { addDays, startOfDay, startOfToday, startOfTomorrow } from "date-fns";

const uncachedGetUser = async (id: string) => {
  return await db.query.users.findFirst({
    with: { accounts: true },
    where: eq(users.id, id),
  });
};
export const getUser = cache(uncachedGetUser);

const uncachedGetUserCreatedCardsCount = async (
  id: string,
  date: Date | null | undefined = null,
) => {
  const fromDate = date ? startOfDay(date) : undefined;
  const toDate = date ? startOfDay(addDays(date, 1)) : undefined;
  console.log(`fetch card count: from ${fromDate} to ${toDate}`);
  const countedRows = await db
    .select({ count: count() })
    .from(cards)
    .where(
      and(
        eq(cards.createdById, id),
        fromDate ? gte(cards.createdAt, fromDate) : undefined,
        toDate ? lt(cards.createdAt, toDate) : undefined,
      ),
    );
  return countedRows.at(0)?.count ?? 0;
};
export const getUserCreatedCardsCount = cache(uncachedGetUserCreatedCardsCount);

export const userRouter = createTRPCRouter({
  getDatabaseSyncStatus: publicProcedure.query(async ({ ctx }) => {
    const session = await auth();

    if (!session || !session.user) {
      return { isSynced: false };
    }

    const user = await getUser(session.user.id);

    if (user) return { isSynced: true };
    else throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }),
  getPersonalCreatedCardsCount: userProcedure
    .input(zod.nullableDate())
    .query(async ({ ctx, input: date }) => {
      const { session } = ctx;
      return await getUserCreatedCardsCount(session.user.id, date);
    }),
});
