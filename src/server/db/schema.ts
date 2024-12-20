import { Roles } from "@/types";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `alphabets_${name}`);

export const regions = createTable("region", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  state: varchar("state", { length: 128 }),
  sort: integer("sort"),
});

export const cards = createTable(
  "card",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lastname: varchar("lastname", { length: 128 }).notNull(),
    firstname: varchar("firstname", { length: 128 }).notNull(),
    middlename: varchar("middlename", { length: 128 }),
    token: varchar("token", { length: 32 }),
    birthdate: date("birthdate", { mode: "string" }).notNull(),
    rankComment: varchar("rank_comment", { length: 255 }),
    regionId: uuid("region_id")
      .notNull()
      .references(() => regions.id),
    admissionYear: integer("admission_year").notNull(),
    graduateYear: integer("graduate_year").default(sql`NULL`),
    exclusionDate: date("exclusion_date", { mode: "string" }).default(
      sql`NULL`,
    ),
    exclusionComment: varchar("exclusion_comment", { length: 255 }),
    scanUrl: varchar("scan_url", { length: 128 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdById: uuid("created_by_id").references(() => users.id),
    updatedAt: timestamp("updated_at")
      .default(sql`NULL`)
      .$onUpdate(() => new Date()),
    updatedBy: varchar("updated_by", { length: 64 }),
  },
  (tbl) => {
    return {
      lastnameIdx: index("lastname_idx").on(tbl.lastname),
      admissionIdx: index("admission_idx").on(tbl.admissionYear),
      graduateIdx: index("graduate_idx").on(tbl.graduateYear),
    };
  },
);

export const cardRelations = relations(cards, ({ one }) => ({
  region: one(regions, {
    fields: [cards.regionId],
    references: [regions.id],
  }),
  createdBy: one(users, {
    fields: [cards.createdById],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
// export type UserInsert = typeof users.$inferInsert;

export type RegionInsert = typeof regions.$inferInsert;
export type RegionSelect = typeof regions.$inferSelect;
export type Region = Omit<RegionSelect, "sort">;

export type Card = typeof cards.$inferSelect; //& { createdBy: User };
export type CardInsert = typeof cards.$inferInsert;
export type CardWithRefs = Card & { region?: Region } & {
  createdBy: Pick<User, "name"> | null;
};

const userRole = pgEnum("role", Roles);

export const users = createTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 128 }),
  email: varchar("email", { length: 64 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  active: boolean("active").notNull().default(true),
  role: userRole("role").notNull().default("guest"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  createdCards: many(cards),
}));

export const accounts = createTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 64 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 64 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 64,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
