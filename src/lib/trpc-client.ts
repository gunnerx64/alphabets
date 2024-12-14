import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@/server/trpc";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCReact<AppRouter>({});
// export const trpc = createTRPCNext<AppRouter>({
//   config() {
//     return {
//       links: [
//         httpBatchLink({
//           // transformer: superjson,
//           /**
//            * If you want to use SSR, you need to use the server's full URL
//            * @see https://trpc.io/docs/v11/ssr
//            **/
//           url: `${getBaseUrl()}/api/trpc`,
//           maxURLLength: 2083,

//           // You can pass any HTTP headers you wish here
//           // async headers() {
//           //   return {
//           //     // authorization: getAuthCookie(),
//           //   };
//           // },
//         }),
//       ],
//     };
//   },
//   /**
//    * @see https://trpc.io/docs/v11/ssr
//    **/
//   ssr: false,
//   transformer: superjson,
// });
