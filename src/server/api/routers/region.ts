import "server-only";
import { cache } from "react";
import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { regions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  GenericResponseValidator,
  RegionUpsertValidator,
} from "@/lib/validators";

const uncachedGetRegionsOptions = async () => {
  console.log("getRegionsOptions: NEW DB QUERY");
  return await db.query.regions.findMany({
    columns: { id: true, title: true },
  });
};

export const getRegionsOptions = cache(uncachedGetRegionsOptions);

export const regionRouter = createTRPCRouter({
  getRegionOptions: protectedProcedure
    .output(
      z.array(z.object({ id: z.string().uuid(), title: z.string().min(1) })),
    )
    .query(async ({ ctx }) => {
      // const regions = await ctx.db.query.regions.findMany({
      //   columns: { id: true, title: true },
      // });
      // console.log(`getRegions: `, regions);

      return await getRegionsOptions();
    }),

  getAllRegions: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.regions.findMany();
  }),

  upsertRegion: adminProcedure
    .input(RegionUpsertValidator)
    .mutation(async ({ ctx, input }) => {
      console.log(
        "upsertRegion: " + input.id
          ? `updating region ${input.id}...`
          : "creating new region...",
      );
      const upsertedRegion = await ctx.db
        .insert(regions)
        .values(input)
        .onConflictDoUpdate({ target: regions.id, set: input })
        .returning({ id: regions.id });
      if (0 < upsertedRegion.length) {
        console.log(
          "upsertRegion: successfully upserted region: ",
          upsertedRegion,
        );
        // TODO: log regular action if success
        return { success: true };
      } else
        return {
          success: false,
          message: `Не удалось ${input.id ? "обновить" : "создать"} регион ${input.title}`,
        };
    }),

  deleteRegion: adminProcedure
    .input(z.string().uuid())
    .output(GenericResponseValidator)
    .mutation(async ({ ctx, input: id }) => {
      try {
        const deletedRegion = await ctx.db
          .delete(regions)
          .where(eq(regions.id, id))
          .returning({ id: regions.id, title: regions.title });
        if (0 < deletedRegion.length) {
          console.log(
            `deleteRegion: пользователь ${ctx.session.user.name} удалил регион ${deletedRegion.at(0)?.title}`,
          );
          // TODO: log critical action if success
          return { success: true };
        } else
          return { success: false, message: "Регион с указанным id не найден" };
      } catch (e: unknown) {
        let message = "Непредвиденная ошибка сервера 🙃";
        if (e instanceof Error) {
          if (e.message.includes("foreign"))
            message =
              "Регион привязан минимум к одной алфавитке. Удаление невозможно.";
          else {
            console.warn(`deleteRegion: непредвиденная ошибка: ${e.message}`);
          }
        }
        return { success: false, message };
      }
    }),
});
