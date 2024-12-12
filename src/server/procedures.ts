import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { j } from "./__internals/j";
import { auth } from "@/server/auth";
import { db, table } from "@/server/db";

const authMiddleware = j.middleware(async ({ c, next }) => {
  // const authHeader = c.req.header("Authorization")

  // if (authHeader) {
  //   const apiKey = authHeader.split(" ")[1] // bearer <API_KEY>

  //   const user = await db.user.findUnique({
  //     where: { apiKey },
  //   })

  //   if (user) return next({ user })
  // }

  const session = await auth();

  if (!session?.user || !session?.user.id) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const user = await db.query.user.findFirst({
    columns: { id: true, name: true, role: true, active: true },
    where: eq(table.user.externalId, session.user.id),
  });

  if (!user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  if (!user.active) {
    throw new HTTPException(422, { message: "Your account is not active" });
  }

  return next({ user });
});

const userMiddleware = j.middleware(async ({ c, next, ctx }) => {
  // if (ctx.user) return next({ user })
  // }

  console.log("called user context, ctx=", ctx);

  // if (!user.active) {
  //   throw new HTTPException(422, { message: "Your account is not active" });
  // }

  return next({});
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
export const userProcedure = privateProcedure.use(userMiddleware);
