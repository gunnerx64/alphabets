import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getDatabaseSyncStatus: publicProcedure.query(async ({ ctx }) => {
    const session = await auth();

    if (!session || !session.user) {
      return { isSynced: false };
    }
    console.log(`FINDing USER with id ${session.user.id}`);

    const user = await ctx.db.query.users.findFirst({
      with: { accounts: true },
      where: eq(users.id, session.user.id),
    });

    if (user) return { isSynced: true };
    else throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
  }),
});
