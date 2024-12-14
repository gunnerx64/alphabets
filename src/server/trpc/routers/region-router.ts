import { z } from "zod";
import { asc, count, desc, eq } from "drizzle-orm";
import { db, table } from "@/server/db";
import { CardUpsertValidator, CardsQueryValidator } from "@/lib/validators";
import { privateProcedure, router } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { CardInsert } from "@/server/db/schema";

const { region } = table;

export const regionRouter = router({
  getRegionOptions: privateProcedure
    .output(
      z.array(z.object({ id: z.string().uuid(), title: z.string().min(1) })),
    )
    .query(async () => {
      const regions = await db.query.region.findMany({
        columns: { id: true, title: true },
      });
      // console.log(`getRegions: `, regions);

      return regions;
    }),

  // getCardsCount: privateProcedure.query(async ({ ctx }) => {
  //   const total = await db.select({ count: count() }).from(table.card);
  //   console.log("Total cards: ", total);
  //   return total[0].count;
  // }),
  // /**
  //  * Fetch single card by id
  //  */
  // getCard: privateProcedure
  //   .input(z.object({ id: z.string().uuid() }))
  //   .query(async ({ input, ctx }) => {
  //     const fetchedCard = await db.query.card.findFirst({
  //       with: {
  //         region: true,
  //         createdBy: true,
  //         updatedBy: true,
  //       },
  //       where: eq(card.id, input.id),
  //     });

  //     if (!fetchedCard)
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: `Алфавитка с id ${input.id} не найдена`,
  //       });

  //     return fetchedCard;
  //   }),

  // deleteCard: privateProcedure
  //   .input(z.object({ id: z.string().uuid() }))
  //   .mutation(async ({ input, ctx }) => {
  //     await db.delete(card).where(eq(card.id, input.id));

  //     return { success: true };
  //   }),

  // upsertCard: privateProcedure
  //   .input(CardUpsertValidator)
  //   .mutation(async ({ ctx, input }) => {
  //     const { user } = ctx;
  //     console.log(
  //       input.id ? `updating card ${input.id}...` : "creating new card...",
  //     );
  //     const values: CardInsert = {
  //       ...input,
  //       updatedByUserId: input.id ? user.id : null,
  //     };

  //     const upsertedCard = await db
  //       .insert(card)
  //       .values(values)
  //       .onConflictDoUpdate({ target: card.id, set: input })
  //       .returning({ id: card.id });

  //     console.log("successfully upserted card: ", upsertedCard);
  //     return upsertedCard.at(0);
  //   }),
  // insertQuickstartCategories: privateProcedure.mutation(async ({ ctx, c }) => {
  //   const categories = await db.eventCategory.createMany({
  //     data: [
  //       { name: "bug", emoji: "🐛", color: 0xff6b6b },
  //       { name: "sale", emoji: "💰", color: 0xffeb3b },
  //       { name: "question", emoji: "🤔", color: 0x6c5ce7 },
  //     ].map((category) => ({
  //       ...category,
  //       userId: ctx.user.id,
  //     })),
  //   });

  //   return c.json({ success: true, count: categories.count });
  // }),

  // pollCategory: privateProcedure
  //   .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
  //   .query(async ({ c, ctx, input }) => {
  //     const { name } = input;

  //     const category = await db.eventCategory.findUnique({
  //       where: { name_userId: { name, userId: ctx.user.id } },
  //       include: {
  //         _count: {
  //           select: {
  //             events: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!category) {
  //       throw new HTTPException(404, {
  //         message: `Category "${name}" not found`,
  //       });
  //     }

  //     const hasEvents = category._count.events > 0;

  //     return c.json({ hasEvents });
  //   }),

  // getEventsByCategoryName: privateProcedure
  //   .input(
  //     z.object({
  //       name: CATEGORY_NAME_VALIDATOR,
  //       page: z.number(),
  //       limit: z.number().max(50),
  //       timeRange: z.enum(["today", "week", "month"]),
  //     }),
  //   )
  //   .query(async ({ c, ctx, input }) => {
  //     const { name, page, limit, timeRange } = input;

  //     const now = new Date();
  //     let startDate: Date;

  //     switch (timeRange) {
  //       case "today":
  //         startDate = startOfDay(now);
  //         break;
  //       case "week":
  //         startDate = startOfWeek(now, { weekStartsOn: 0 });
  //         break;
  //       case "month":
  //         startDate = startOfMonth(now);
  //         break;
  //     }

  //     const [events, eventsCount, uniqueFieldCount] = await Promise.all([
  //       db.event.findMany({
  //         where: {
  //           EventCategory: { name, userId: ctx.user.id },
  //           createdAt: { gte: startDate },
  //         },
  //         skip: (page - 1) * limit,
  //         take: limit,
  //         orderBy: { createdAt: "desc" },
  //       }),
  //       db.event.count({
  //         where: {
  //           EventCategory: { name, userId: ctx.user.id },
  //           createdAt: { gte: startDate },
  //         },
  //       }),
  //       db.event
  //         .findMany({
  //           where: {
  //             EventCategory: { name, userId: ctx.user.id },
  //             createdAt: { gte: startDate },
  //           },
  //           select: {
  //             fields: true,
  //           },
  //           distinct: ["fields"],
  //         })
  //         .then((events) => {
  //           const fieldNames = new Set<string>();
  //           events.forEach((event) => {
  //             Object.keys(event.fields as object).forEach((fieldName) => {
  //               fieldNames.add(fieldName);
  //             });
  //           });
  //           return fieldNames.size;
  //         }),
  //     ]);

  //     return c.superjson({
  //       events,
  //       eventsCount,
  //       uniqueFieldCount,
  //     });
  //   }),
});
