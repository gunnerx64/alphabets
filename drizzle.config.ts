"use server";
import type { Config } from "drizzle-kit";
import "@/envConfig";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.* file");

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  breakpoints: true,
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
