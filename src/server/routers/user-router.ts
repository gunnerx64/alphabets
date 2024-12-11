import { HTTPException } from "hono/http-exception";
import { router } from "../__internals/router";
import { publicProcedure } from "../procedures";
import { auth } from "@/server/auth";
import { db, table } from "@/server/db";
import { eq } from "drizzle-orm";
import { UserInsert } from "../db/schema";

export const dynamic = "force-dynamic";

export const userRouter = router({
  getDatabaseSyncStatus: publicProcedure.query(async ({ c, ctx }) => {
    const session = await auth();
    console.log("CHECK SESSION...");

    if (!session || !session.user.id) {
      return c.json({ isSynced: false });
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
          fullName: session.user.name,
          email: session.user.email || `${Math.random()}`,
        };
        await db.insert(table.user).values(newUser);
      }
    } catch (err: any) {
      throw new HTTPException(501, {
        cause: err,
        message: `Ошибка при регистрации пользователя (${err.message})`,
      });
    }

    return c.json({ isSynced: true });
  }),
});
