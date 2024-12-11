import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { userRouter } from "./routers/user-router";
import { cardRouter } from "./routers/card-router";
// import { categoryRouter } from "./routers/category-router"
// import { paymentRouter } from "./routers/payment-router"
// import { projectRouter } from "./routers/project-router"

const app = new Hono().basePath("/api").use(cors());

/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */
const appRouter = app.route("/user", userRouter).route("/card", cardRouter);
//   .route("/category", categoryRouter)
//   .route("/payment", paymentRouter)
//   .route("/project", projectRouter)

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;

// export type definition of API
export type AppType = typeof appRouter;
