// import { HTTPException } from "hono/http-exception";
import { publicProcedure, router } from "../trpc";
import { auth } from "@/server/auth";
import { db, table } from "@/server/db";
import { eq } from "drizzle-orm";
import { UserInsert } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";

// export const dynamic = "force-dynamic";

export const userRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async (opts) => {
    const session = await auth();
    console.log("CHECK SESSION...");

    if (!session || !session.user.id) {
      return { isSynced: false };
    }
    console.log("FIND USER...");
    try {
      const user = await db.query.user.findFirst({
        columns: {
          externalId: true,
        },
        where: eq(table.user.externalId, session.user.id),
      });

      console.log("USER IN DB:", user);

      if (!user) {
        const newUser: UserInsert = {
          externalId: session.user.id,
          role: "guest",
          active: true,
          name: session.user.given_name || session.user.name || "N/A",
          fullName: session.user.name || "нет имени",
          email: session.user.email || `${Math.random()}`,
        };
        await db.insert(table.user).values(newUser);
      }
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Ошибка при регистрации пользователя (${err.message})`,
        cause: err,
      });
    }

    return { isSynced: true };
  }),
});
