import { z } from "zod";
import { count, desc, eq } from "drizzle-orm";
import { CardUpsertValidator, CardsQueryValidator } from "@/lib/validators";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CardInsert, cards } from "@/server/db/schema";
import { db } from "@/server/db";

export const getCard = async (id: string) =>
  await db.query.cards.findFirst({
    with: {
      region: true,
      createdBy: { columns: { name: true } },
      updatedBy: { columns: { name: true } },
    },
    where: eq(cards.id, id),
  });

export const cardRouter = createTRPCRouter({
  getCards: protectedProcedure
    .input(CardsQueryValidator)
    .query(async ({ ctx, input }) => {
      console.log("INPUPt = ", input);
      // const now = new Date();
      // const firstDayOfMonth = startOfMonth(now);
      // const input = { page: 1, pageSize: 10 };
      const offset = ((input.page as number) - 1) * (input.pageSize as number);
      const foundCards = await ctx.db.query.cards.findMany({
        with: {
          region: true,
          createdBy: { columns: { name: true } },
          updatedBy: { columns: { name: true } },
        },
        orderBy: desc(cards.createdAt),
        //TODO: add advanced search
        //where: { userId: ctx.user.id },
        limit: input.pageSize,
        offset,
      });
      console.log(
        `getCards: page ${input.page}, limit ${input.pageSize}, got ${foundCards.length} items`,
      );

      return foundCards;
    }),

  getCardsCount: protectedProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.select({ count: count() }).from(cards);
    console.log("Total cards: ", total[0]?.count);
    return total[0]?.count ?? 0;
  }),

  /**
   * Fetch single card by id
   */
  getCard: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const fetchedCard = await getCard(input.id);
      /*ctx.db.query.cards.findFirst({
        with: {
          region: true,
          createdBy: { columns: { name: true } },
          updatedBy: { columns: { name: true } },
        },
        where: eq(cards.id, input.id),
      });*/

      if (!fetchedCard)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Алфавитка с id ${input.id} не найдена`,
        });

      return fetchedCard;
    }),

  deleteCard: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(cards).where(eq(cards.id, input.id));

      return { success: true };
    }),

  upsertCard: protectedProcedure
    .input(CardUpsertValidator)
    .mutation(async ({ ctx, input }) => {
      console.log(
        input.id ? `updating card ${input.id}...` : "creating new card...",
      );
      const values: CardInsert = {
        ...input,
        // if card is created set createdById to current user
        createdById: input.id ? input.createdById : ctx.session.user.id,
        // if card is updated set updatedById to current user
        updatedById: input.id ? ctx.session.user.id : null,
      };

      const upsertedCard = await ctx.db
        .insert(cards)
        .values(values)
        .onConflictDoUpdate({ target: cards.id, set: input })
        .returning({ id: cards.id });

      console.log("successfully upserted card: ", upsertedCard);
      return upsertedCard.at(0);
    }),
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
