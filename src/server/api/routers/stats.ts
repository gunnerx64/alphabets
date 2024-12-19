import "server-only";
import { count, eq, sql } from "drizzle-orm";
import { createTRPCRouter, userProcedure } from "@/server/api/trpc";
import { cards, users } from "@/server/db/schema";
import { db } from "@/server/db";
import { cache } from "react";
import { z } from "zod";
import { format, startOfDay, startOfToday } from "date-fns";

const uncachedGetCreationStats = async (date: Date) => {
  console.log("QUERY CREATION_STATS FROM DB");
  //   const usersWithCards = await db.query.users.findMany({
  //     with: { createdCards: { columns: { createdAt: true } } },
  //     columns: { id: true, name: true, image: true },
  //   });
  //   console.log("found users w cards: ", usersWithCards);
  //   return usersWithCards;
  const findDate = format(date, "yyyy-MM-dd");
  //   const fromDate = startOfDay(date);
  //   const toDate = startOfDay(addDays(date, 1));
  //   console.log(`fetch creation stats from ${fromDate} to ${toDate}`);
  //   const sq = db
  //     .$with("sq")
  //     .as(
  //       db
  //         .select({
  //           id: users.id,
  //           name: users.name,
  //           image: users.image,
  //           createdAt: cards.createdAt,
  //         })
  //         .from(users)
  //         .leftJoin(cards, eq(users.id, cards.createdById)),
  //     );
  //   const usersPusers = await db
  //     .with(sq)
  //     .select({
  //       // name: users.name,
  //       // image: users.image,
  //       cardsTotal: count(cards.id),
  //       //   cardsToday: sql<number>`count(case when ${cards.createdAt}::date = date ${findDate} then 1 end)`,
  //       cardsToday: sql<number>`SUM(CASE WHEN DATE(${cards.createdAt}) = DATE(${findDate}) THEN 1 END)`,
  //       //   cardsToday: sql<number>`count(case when ${users.id} is not null then 1 end)`,
  //     })
  //     .from(sq)
  //     .groupBy(users.id);
  //   return usersPusers;
  const usersStats = await db
    .select({
      name: users.name,
      image: users.image,
      cardsTotal: count(cards.id),
      //   cardsToday: sql<number>`count(case when ${cards.createdAt}::date = date ${findDate} then 1 end)`,
      cardsToday: sql<number>`COUNT(CASE WHEN DATE(${cards.createdAt}) = DATE(${findDate}) THEN 1 END)`,
    })
    .from(users)
    .leftJoin(cards, eq(users.id, cards.createdById))
    .groupBy(users.id);
  const filteredUserStats = usersStats
    .map(({ name, image, cardsToday, cardsTotal }) => ({
      name,
      image,
      cardsToday: cardsToday ?? 0,
      cardsTotal: cardsTotal ?? 0,
    }))
    .filter(({ cardsToday }) => 0 < cardsToday)
    .sort((a, b) => b.cardsToday - a.cardsToday);
  return filteredUserStats;
};
const getCreationStats = cache(uncachedGetCreationStats);

export const statsRouter = createTRPCRouter({
  getCreationStats: userProcedure
    .input(z.coerce.date())
    .query(async ({ input: date }) => {
      return await getCreationStats(date);
    }),
  getTodayCreationCount: userProcedure.query(async ({ ctx }) => {
    // const date = startOfDay("2024-12-15");
    const todayTotal = await db
      .select({
        todayTotal: sql<number>`COUNT(CASE WHEN DATE(${cards.createdAt}) = DATE(now()) THEN 1 END)`,
      })
      .from(cards);
    console.log("today total ", todayTotal);
    return todayTotal.at(0)?.todayTotal ?? 0;
  }),
});
