import { CardInsert } from "@/server/db/schema";
import { z } from "zod";
import { MaxAllowedBirthYear, MinAllowedBirthYear } from "@/config";
import { zod } from "./zod-helpers";

export type InferZodMap<T extends abstract new (...args: any) => any> = {
  [k in keyof Partial<InstanceType<T>>]?: unknown;
};

export const CardsQueryValidator = z.object({
  page: z.number().min(1).optional().default(1),
  pageSize: z.number().min(5).max(50).optional().default(10),
});

export const CardUpsertValidator: z.ZodType<CardInsert> = z
  .object({
    id: z.string().uuid().optional(),
    lastname: zod.string("Не указана фамилия"),
    firstname: zod.string("Не указано имя"),
    middlename: z.string().optional(),
    token: z.string().optional(),
    // birthdate: zod.stringDate().refine((value) => {
    //   const year = value.getFullYear();
    //   return MinAllowedBirthYear <= year && year <= MaxAllowedBirthYear;
    // }, `Год рождения от ${MinAllowedBirthYear} до ${MaxAllowedBirthYear}`),
    birthdate: zod.stringDate().refine((value) => {
      const date = new Date(value);
      const year = date.getFullYear();
      return MinAllowedBirthYear <= year && year <= MaxAllowedBirthYear;
    }, `Год рождения от ${MinAllowedBirthYear} до ${MaxAllowedBirthYear}`),
    rankComment: z.string().optional(),
    regionId: zod.string("Укажите регион").uuid(),
    admissionYear: z.coerce
      .number({
        required_error: "Не указан год поступления",
        invalid_type_error: "Укажите год поступления",
      })
      .min(1922, "Год поступления должен быть в диапазоне [1922:1991]")
      .max(1991, "Год поступления должен быть в диапазоне [1922:1991]"),
    graduateYear: z.coerce
      .number({ invalid_type_error: "Некорректный год" })
      // .min(1922, "Год выпуска должен быть в диапазоне [1922:1991]")
      // .max(1991, "Год выпуска должен быть в диапазоне [1922:1991]")
      .optional()
      .nullable(),
    exclusionDate: zod.optionalStringDate(),
    exclusionComment: z.string().optional(),
    scanUrl: zod.string("Загрузите и обрежьте скан алфавитки"),
    // createdAt: timestamp("created_at").defaultNow().notNull(),
    createdByUserId: z
      .string(/*{ required_error: "Не указан id создателя алфавитки" }*/)
      .uuid()
      .optional(),
    // updatedAt: timestamp("updated_at")
    //   .defaultNow()
    //   .$onUpdate(() => new Date()),
    // updatedByUserId
  })
  .superRefine((values, context) => {
    function addMissingError(path: string, msg?: string): void {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg ?? "Поле не может быть пустым", //😡
        path: [path],
      });
    }
    const { admissionYear, graduateYear } = values;
    if (
      values.admissionYear &&
      graduateYear &&
      (5 < graduateYear - admissionYear || graduateYear - admissionYear < 2)
    ) {
      addMissingError(
        "graduateYear",
        `Год выпуска должен быть в диапазоне [${admissionYear + 1}:${admissionYear + 5}]`,
      );
    }
  });
