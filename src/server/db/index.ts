// import type {
//   BuildQueryResult,
//   DBQueryConfig,
//   ExtractTablesWithRelations,
// } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import type { Exact } from "type-fest";

import * as schema from "./schema";

const driver = postgres(process.env.DATABASE_URL as string);

export const db = drizzle({ client: driver, schema });
export const table = schema;

// type TSchema = ExtractTablesWithRelations<typeof schema>;

// type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
//   "one" | "many",
//   boolean,
//   TSchema,
//   TSchema[TableName]
// >;

// export type InferQueryModel<
//   TableName extends keyof TSchema,
//   QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {}, // <-- notice Exact here
// > = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
