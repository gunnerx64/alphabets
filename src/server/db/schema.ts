import { SQL, relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  date,
  uuid,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { Roles } from "@/types";

export const userRole = pgEnum("role", Roles);

export const user = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  externalId: text("external_id").unique(),
  name: text().notNull(),
  fullName: text("full_name"),
  picture: text(),
  email: text().unique().notNull(),
  active: boolean().default(true).notNull(),
  role: userRole().default("guest").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  setupAt: timestamp("setup_at"),
  termsAcceptedAt: timestamp("terms_accepted_at"),
});

export const oauthAccount = pgTable(
  "oauth_account",
  {
    provider_id: text(),
    provider_user_id: text(),
    user_id: uuid()
      .notNull()
      .references(() => user.id),
  },
  (table) => [
    primaryKey({ columns: [table.provider_id, table.provider_user_id] }),
  ],
);

export const session = pgTable("session", {
  id: text().primaryKey(),
  user_id: uuid()
    .notNull()
    .references(() => user.id),
  expires_at: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const region = pgTable("region", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  state: text(),
  sort: integer(),
});

export const card = pgTable(
  "card",
  {
    id: uuid().defaultRandom().primaryKey(),
    lastname: text().notNull(),
    firstname: text().notNull(),
    middlename: text(),
    token: text(),
    birthdate: date({ mode: "date" }).notNull(),
    rankComment: text("rank_comment"),
    regionId: uuid("region_id")
      .notNull()
      .references(() => region.id),
    admissionYear: integer("admission_year").notNull(),
    // admissionYear: integer("admission_year").generatedAlwaysAs(
    //   (): SQL => sql`YEAR(${card.admissionDate})`,
    // ),
    // admissionComment: text("admission_comment"),
    graduateYear: integer("graduate_year"),
    exclusionDate: date("exclusion_date"),
    exclusionComment: text("exclusion_comment"),
    // exclusionYear: integer("exclusion_year").generatedAlwaysAs(
    //   (): SQL => sql`YEAR(${card.exclusionDate})`,
    // ),
    scanUrl: text("scan_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdByUserId: uuid("created_by_user_id").references(() => user.id),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    updatedByUserId: uuid("updated_by_user_id").references(() => user.id),
  },
  (tbl) => {
    return {
      lastnameIdx: index("lastname_idx").on(tbl.lastname),
      admissionIdx: index("admission_idx").on(tbl.admissionYear),
      graduateIdx: index("graduate_idx").on(tbl.graduateYear),
    };
  },
);

export const cardRelations = relations(card, ({ one }) => ({
  region: one(region, {
    fields: [card.regionId],
    references: [region.id],
  }),
  createdBy: one(user, {
    fields: [card.createdByUserId],
    references: [user.id],
  }),
  updatedBy: one(user, {
    fields: [card.updatedByUserId],
    references: [user.id],
  }),
}));

export type User = typeof user.$inferSelect;

export type Region = Omit<typeof region.$inferSelect, "sort">;

export type Card = typeof card.$inferSelect;

export type CardInsert = typeof card.$inferInsert;
