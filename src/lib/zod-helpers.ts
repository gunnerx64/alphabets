import { z } from "zod";
import { isValid, parse } from "date-fns";
import { ru } from "date-fns/locale";
import { MaxAllowedBirthYear, MinAllowedBirthYear } from "@/config";

const russianDate = () =>
  z
    .string()
    .refine(
      (value) => /^\d{2}\.\d{2}\.\d{4}$/.test(value) || value === "", // костыль
      "Формат даты дд.мм.гггг",
    )
    .refine((value) => {
      // костыль
      if (value === "") return true;
      const parsedDate = parse(value, "dd.MM.yyyy", new Date(), {
        locale: ru,
      });
      return isValid(parsedDate);
    }, "Недействительная дата")
    .refine((value) => {
      // костыль
      if (value === "") return true;
      const parsedDate = parse(value, "dd.MM.yyyy", new Date(), {
        locale: ru,
      });
      const year = parsedDate.getFullYear();
      return MinAllowedBirthYear <= year && year <= MaxAllowedBirthYear;
    }, `Допустимые года - ${MinAllowedBirthYear}-${MaxAllowedBirthYear} гг.`);

const zod = {
  /** Проверка строки на пустоту, игнорируя пробелы
   * @param msg сообщение (default: "Поле не может быть пустым.")
   * @param len мин. длина строки (default: 1)
   */
  string: (msg?: string, len?: number) =>
    z
      .string({ required_error: "Поле не может быть пустым." })
      .trim()
      .min(len ?? 1, { message: msg ?? "Поле не может быть пустым." }),
  /** Необязательная строка, в т.ч. null */
  optionalNullableString: () =>
    z
      .string()
      .nullish()
      .transform((x) => x ?? undefined),
  /** Необязательная дата, в т.ч. null */
  nullableDate: () =>
    z.coerce
      .date()
      .nullish()
      .optional()
      .transform((x) => x ?? undefined),
  /**Обязательная дата в российском формате */
  russianDate,
  /** Необязательная дата в российском формате */
  optionalRussianDate: () => russianDate().optional(),
  stringDate: () =>
    z.preprocess(
      (arg) => (arg === "" ? undefined : arg),
      z.coerce.date({
        errorMap: ({ code }, { defaultError }) => {
          if (code == "invalid_date") return { message: "Некорректная дата" };
          return { message: defaultError };
        },
      }),
    ) as z.ZodEffects<z.ZodDate, Date, Date>,
};

export { zod };
