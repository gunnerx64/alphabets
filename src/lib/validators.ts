import { CardInsert } from "@/server/db/schema";
import { z } from "zod";

export type InferZodMap<T extends abstract new (...args: any) => any> = {
  [k in keyof Partial<InstanceType<T>>]?: unknown;
};

export const CardsQueryValidator = z.object({
  page: z.number().min(1).optional().default(1),
  itemsPerPage: z.number().optional().default(10),
});

export const CardCreationValidator: z.ZodType<CardInsert> = z.object({
  lastname: z.string({ required_error: "Не указана фамилия" }),
  firstname: z.string({ required_error: "Не указано имя" }),
  middlename: z.string().optional(),
  token: z.string().optional(),
  birthdate: z.coerce.date({
    required_error: "Не указана дата рождения",
  }),
  rankComment: z.string().optional(),
  regionId: z.string({ required_error: "Не указан регион" }).uuid(),
  admissionYear: z
    .number({ required_error: "Не указан год поступления" })
    .min(1922, "Год поступления должен быть в диапазоне [1922:1991]")
    .max(1991, "Год поступления должен быть в диапазоне [1922:1991]"),
  graduateYear: z
    .number()
    .min(1922, "Год выпуска должен быть в диапазоне [1922:1991]")
    .max(1991, "Год выпуска должен быть в диапазоне [1922:1991]")
    .optional(),
  //exclusionDate: z.coerce.date().optional().transform((x) => x ? new Date(x) : undefined),
  exclusionComment: z.string().optional(),
  scanUrl: z.string({ required_error: "Не указана ссылка на скан" }),
  // createdAt: timestamp("created_at").defaultNow().notNull(),
  createdByUserId: z
    .string({ required_error: "Не указан id создателя алфавитки" })
    .uuid(),
  // updatedAt: timestamp("updated_at")
  //   .defaultNow()
  //   .$onUpdate(() => new Date()),
  // updatedByUserId
});
