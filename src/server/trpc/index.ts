import { router } from "./trpc";
import { userRouter } from "./routers/user-router";
import { cardRouter } from "./routers/card-router";
import { regionRouter } from "./routers/region-router";

// const appRouter = router({
//   greeting: publicProcedure.query(() => "hello tRPC v10!"),
// });

// You can then access the merged route with
// http://localhost:3000/trpc/<NAMESPACE>.<PROCEDURE>
export const appRouter = router({
  user: userRouter, // put procedures under "user" namespace
  card: cardRouter, // put procedures under "card" namespace
  region: regionRouter, // put procedures under "region" namespace
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;
