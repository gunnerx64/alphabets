import "server-only";
import { and, count, eq, gte, lt } from "drizzle-orm";
import {
  adminProcedure,
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
import { GenericResponseValidator } from "@/lib/validators";

const uncachedGetUser = async (id: string) => {
  console.log("GetUser called");
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
  getSyncAndPromoteStatus: publicProcedure.query(async ({ ctx }) => {
    const session = await auth();
    if (!session || !session.user) {
      return { isSynced: false, isActive: false, isPromoted: false };
    }

    const user = await getUser(session.user.id);
    if (user) {
      return {
        isSynced: true,
        isPromoted: user.role !== "guest",
        isActive: user.active,
      };
    } else {
      console.warn(
        "getSyncAndPromoteStatus: невозможная ситуация, в сессии пользователь есть, а в БД нет",
      );
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getPersonalCreatedCardsCount: userProcedure
    .input(zod.nullableDate())
    .query(async ({ ctx, input: date }) => {
      const { session } = ctx;
      return await getUserCreatedCardsCount(session.user.id, date);
    }),

  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findMany({
      columns: {
        emailVerified: false,
      },
    });
  }),

  toggleActive: adminProcedure
    .input(z.string().uuid())
    .output(GenericResponseValidator)
    .mutation(async ({ ctx, input: id }) => {
      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, id),
        });
        if (!user) return { success: false, message: "Пользователь не найден" };
        await ctx.db
          .update(users)
          .set({ active: !user.active })
          .where(eq(users.id, id));
        // TODO: log critical action if success
        return { success: true };
      } catch (e: unknown) {
        let message = "Непредвиденная ошибка сервера 🙃";
        console.warn(
          `toggleActive: непредвиденная ошибка: ${(e as any)?.message}`,
        );
        return { success: false, message };
      }
    }),

  deleteUser: adminProcedure
    .input(z.string().uuid())
    .output(GenericResponseValidator)
    .mutation(async ({ ctx, input: id }) => {
      try {
        const deletedUser = await ctx.db
          .delete(users)
          .where(eq(users.id, id))
          .returning({ id: users.id, name: users.name });
        if (0 < deletedUser.length) {
          console.log(
            `deleteUser: пользователь ${ctx.session.user.name} удалил пользователя ${deletedUser.at(0)?.name}`,
          );
          // TODO: log critical action if success
          return { success: true };
        } else return { success: false, message: "Пользователь не найден" };
      } catch (e: unknown) {
        let message = "Непредвиденная ошибка сервера 🙃";
        if (e instanceof Error) {
          if (e.message.includes("foreign"))
            message =
              "Пользователь оцифровал минимум одну алфавитку. Удаление невозможно.";
          else {
            console.warn(`deleteUser: непредвиденная ошибка: ${e.message}`);
          }
        }
        return { success: false, message };
      }
    }),
});
