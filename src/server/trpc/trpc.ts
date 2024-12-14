import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { Context } from "./context";
import { auth } from "@/server/auth";

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
/** Procedure that asserts that the user is logged in */
export const privateProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await auth();
  if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    // ✅ user value is known to be non-null now
    ctx: { user: session.user },
  });
});
