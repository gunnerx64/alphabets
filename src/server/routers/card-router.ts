import { HTTPException } from "hono/http-exception";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { z } from "zod";
import { count, desc, eq } from "drizzle-orm";
import { router } from "../__internals/router";
import { privateProcedure, userProcedure } from "../procedures";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { parseColor } from "@/utils";
import { db, table } from "@/server/db";
import { CardCreationValidator, CardsQueryValidator } from "@/lib/validators";

const { card } = table;

export const cardRouter = router({
  getCards: privateProcedure
    .input(CardsQueryValidator)
    .query(async ({ c, ctx, input }) => {
      // const now = new Date();
      // const firstDayOfMonth = startOfMonth(now);
      const offset =
        ((input.page as number) - 1) * (input.itemsPerPage as number);
      const cards = await db.query.card.findMany({
        with: {
          region: true,
          createdBy: true,
          updatedBy: true,
        },
        orderBy: desc(table.card.createdAt),
        //TODO: make adv. search
        //where: { userId: ctx.user.id },
        limit: input.itemsPerPage,
        offset,
      });

      return c.superjson(cards);
    }),

  getCardsCount: privateProcedure.query(async ({ c, ctx }) => {
    const total = await db.select({ count: count() }).from(table.card);
    console.log("Total cards: ", total);
    return c.superjson(total[0].count);
  }),
  /**
   * Fetch single card by id
   */
  getCard: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ c, input, ctx }) => {
      const fetchedCard = await db.query.card.findFirst({
        with: {
          region: true,
          createdBy: true,
          updatedBy: true,
        },
        where: eq(card.id, input.id),
      });

      if (!fetchedCard)
        throw new HTTPException(404, {
          message: `Алфавитка с id ${input.id} не найдена`,
        });

      return c.superjson(fetchedCard);
    }),

  deleteCard: privateProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ c, input, ctx }) => {
      await db.delete(card).where(eq(card.id, input.id));

      return c.json({ success: true });
    }),

  createCard: userProcedure
    .input(CardCreationValidator)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;

      // TODO: ADD PAID PLAN LOGIC

      const newCard = await db.insert(card).values(input);

      return c.json(newCard);
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
