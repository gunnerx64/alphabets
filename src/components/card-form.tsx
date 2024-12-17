"use client";
import { useEffect, useMemo, useRef } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "./ui/button";
import { CardInsert } from "@/server/db/schema";
import { CardUpsertValidator } from "@/lib/validators";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import FormTextField from "./form/form-textfield";
import { useZodForm } from "@/hooks/use-zod-form";
import FormMaskTextField from "./form/form-mask-textfield";
import FormTextArea from "./form/form-textarea";
import FormCombobox from "./form/form-combobox";
import { AlertDialogBase } from "./alert-dialog-base";
import { addLineBreak } from "@/lib/addLineBreak";
import { OptionItem } from "@/types";
import { api } from "@/trpc/react";
import { ImageCrop } from "./image/image-crop";
import { ImageZoom } from "./image/image-zoom";

// type CardUpsert = z.infer<typeof CardFormValidator>;

// type CardUpsert = CardInsert & { birthdate_ru?: string };

const cardFormDefaultValues = {
  lastname: "",
  firstname: "",
  middlename: "",
  token: "",
  rankComment: "",
  regionId: "",
  // admissionYear: "",
  // graduateYear: "",
  // exclusionDate: null,
  exclusionComment: "",
  scanUrl: "etert",
};

interface CardFormProps {
  mode?: "create" | "edit";
  regions: OptionItem[];
  editCard?: CardInsert;
}

export const CardForm = ({
  mode = "create",
  regions,
  editCard,
}: CardFormProps) => {
  const router = useRouter();
  // const { mutate: upsertCard, isPending: isUpserting } =
  //   trpc.card.upsertCard.useMutation({
  //     onSuccess(data, variables, context) {
  //       console.log("success: ", data);
  //       toast({
  //         title: `${mode === "create" ? "Создание" : "Редактирование"}`,
  //         content: `${mode === "create" ? "Алфавитка создана" : "Алфавитка изменена"}`,
  //       });
  //       if (data) router.push(`/dashboard/card/${data.id}`);
  //     },
  //     onError(error) {
  //       toast({
  //         variant: "destructive",
  //         title: "Ошибка",
  //         content: "Произошла ошибка: " + error.message,
  //       });
  //     },
  //   });
  const { mutate: upsertCard, isPending: isUpserting } =
    api.card.upsertCard.useMutation({
      onSuccess(data, variables, context) {
        console.log("success: ", data);
        toast({
          title: `${mode === "create" ? "Создание" : "Редактирование"}`,
          content: `${mode === "create" ? "Алфавитка создана" : "Алфавитка изменена"}`,
        });
        if (data) router.push(`/dashboard/card/${data.id}`);
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          content: "Произошла ошибка: " + error.message,
        });
      },
    });

  // const { data: regions } = trpc.region.getRegionOptions.useQuery();
  // const { data: regions } = useQuery({
  //   queryKey: ["region-options"],
  //   queryFn: async () => getRegionOptionsAction,
  // });

  const cardForm = useZodForm({
    schema: CardUpsertValidator,
    mode: "onSubmit",
    // mode: "all",
    defaultValues: editCard || cardFormDefaultValues,
  });

  // const cardForm = useForm<CardInsert>({
  //   resolver: zodResolver(CardCreateOrUpdateValidator),
  // });

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors: clearFormErrors,
    trigger: validateForm,
    formState: { errors, isDirty: isFormDirty },
  } = cardForm;
  const cardFormRef = useRef(cardForm);
  const lastname = watch("lastname");
  const scanUrl = watch("scanUrl");
  const exDate = watch("exclusionDate");
  console.log(exDate);
  // const birthdate_ru = watch("birthdate_ru");

  console.log(errors);

  // original state came from server
  const cardFormInitialState = useMemo(() => cardForm.getValues(), []);

  const onSubmit = (data: CardInsert) => {
    // data.birthdate = data.birthdate_ru
    //   ? parse(data.birthdate_ru, "dd.MM.yyyy", new Date(), { locale: ru })
    //   : null;
    console.log("submitting... ", data);
    upsertCard(data);
  };

  // watch for birthdate_ru changes and updates birthdate
  // useEffect(() => {
  //   if (birthdate_ru)
  //     setValue(
  //       "birthdate",
  //       parse(birthdate_ru, "dd.MM.yyyy", new Date(), { locale: ru }),
  //     );
  // }, [birthdate_ru]);

  const buttonCaption = useMemo(
    () =>
      mode === "create"
        ? isUpserting
          ? "Добавляем..."
          : "Добавить"
        : isUpserting
          ? "Обновляем..."
          : "Обновить",
    [mode, isUpserting],
  );

  /** Предотвращает уход со страницы (кроме случаев скачивания протокола \
   * и обновления пустой (не dirty) формы) */
  const preventRefresh = (e: BeforeUnloadEvent) => {
    if (cardFormRef.current.formState.isDirty) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  // защита от F5
  useEffect(() => {
    cardFormRef.current = cardForm;
    window.addEventListener("beforeunload", preventRefresh);
    return () => {
      window.removeEventListener("beforeunload", preventRefresh);
    };
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">
            {"Форма " +
              (mode === "create"
                ? "создания алфавитки"
                : `редактирования алфавитки ${lastname}`)}
          </CardTitle>
          <CardDescription className="text-base">
            Внесите в форму необходимые поля. Для печати возможно потребуется
            заполнить дополнительные поля.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <FormProvider {...cardForm}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex w-full items-center">
                {mode === "create" && <ImageCrop />}
                {mode === "edit" && scanUrl && <ImageZoom src={scanUrl} />}
              </div>
              <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-4">
                <FormTextField
                  name="lastname"
                  label="Фамилия *"
                  placeholder="Иванов"
                  type="text"
                />
                <FormTextField
                  name="firstname"
                  label="Имя *"
                  placeholder="Иван"
                  type="text"
                />
                <FormTextField
                  name="middlename"
                  label="Отчество"
                  placeholder="Иванович"
                  type="text"
                />
                <FormMaskTextField
                  name="birthdate"
                  label="Дата рождения *"
                  placeholder="1940-02-01"
                  desc="в формате гггг-мм-дд"
                  mask="9999-99-99"
                  type="text"
                />
                <FormTextField
                  name="token"
                  label="Личный номер"
                  placeholder="Х-111222"
                  type="text"
                />
                <div className="col-span-1 lg:col-span-2">
                  <FormTextArea
                    name="rankComment"
                    label="В.звание, кем присвоено, когда присвоено"
                    styles="h-[32px]"
                  />
                </div>
                <FormCombobox
                  name="regionId"
                  label="Откуда прибыл *"
                  placeholder="Выберите из списка"
                  options={regions || []}
                  type="combobox"
                />
                <FormTextField
                  name="admissionYear"
                  label="Год поступления *"
                  placeholder="1970"
                  type="text"
                />
                <FormTextField
                  name="graduateYear"
                  label="Год выпуска"
                  placeholder="1984"
                  type="text"
                />
                <FormMaskTextField
                  name="exclusionDate"
                  label="Дата исключения"
                  placeholder="1982-02-21"
                  desc="в формате гггг-мм-дд"
                  mask="9999-99-99"
                  type="text"
                />
                <FormTextArea
                  name="exclusionComment"
                  label="Причина исключения"
                  styles="h-[24px]"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                <AlertDialogBase
                  title="Сбросить состояние формы"
                  desc={addLineBreak(
                    `Вы действительно хотите сбросить форму?\nЭто приведёт к очистке всех полей.`,
                  )}
                  confirmCallback={() => cardForm.reset()}
                >
                  <Button
                    className="w-[200px]"
                    type="button"
                    variant={"outline"}
                    disabled={!isFormDirty}
                  >
                    Очистить форму
                  </Button>
                </AlertDialogBase>
                <Button
                  className="w-[200px]"
                  disabled={isUpserting}
                  type="submit"
                  // onClick={async () => {
                  //   console.log("SUBM CLICK");
                  //   clearFormErrors();
                  //   await validateForm();
                  //   // cardFormRef.current.handleSubmit(cardFormRef.current.getValues());
                  // }}
                >
                  {buttonCaption}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </>
  );
};
