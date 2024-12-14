import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { auth } from "@/server/auth";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await auth(opts.req, opts.res);

  return {
    session,
  };
};

export type Context = typeof createContext;
// export type Context = Awaited<ReturnType<typeof createContext>>;
