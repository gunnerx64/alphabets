import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const uncachedGetRegionsOptions = async () => {
  console.log("getRegionsOptions: NEW DB QUERY");
  return await db.query.regions.findMany({
    columns: { id: true, title: true },
  });
};

export const getRegionsOptions = uncachedGetRegionsOptions;

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
});
