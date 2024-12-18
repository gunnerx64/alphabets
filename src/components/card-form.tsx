"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { shortenFullName } from "@/lib/utils";
import { uploadScan } from "@/server/actions";

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
  graduateYear: null,
  exclusionDate: null,
  exclusionComment: "",
  scanUrl: "",
};

interface CardFormProps {
  mode?: "create" | "edit";
  regions: OptionItem[];
  editCard?: CardInsert;
  storageUrl?: string;
}

const errorToast = (errors: object) => {
  toast({
    variant: "destructive",
    title: "Не заполнены обязательные поля",
    description: (
      <div className="flex max-h-72 w-full flex-col items-start space-y-0 overflow-y-auto">
        {Object.keys(errors).map((key, index) => (
          <div key={index}>{`${key}: ${Object.values(errors)[index]}`}</div>
        ))}
      </div>
    ),
  });
};

export const CardForm = ({
  mode = "create",
  regions,
  editCard,
  storageUrl,
}: CardFormProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const [scanBlob, setScanBlob] = useState<Blob | null>(null);
  const {
    mutate: upsertCard,
    isSuccess,
    isPending: isUpserting,
  } = api.card.upsertCard.useMutation({
    onSuccess(data) {
      toast({
        title: `${mode === "create" ? "Создание" : "Редактирование"}`,
        description: `${mode === "create" ? "Алфавитка создана" : "Алфавитка изменена"}`,
      });
      utils.card.getCards.invalidate();
      utils.card.getCardsCount.invalidate();
      if (data) router.push(`/dashboard/card/${data.id}`);
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка: " + error.message,
      });
    },
  });

  // const {
  //   mutate: uploadScan_Server,
  //   isSuccess: isScanUploaded,
  //   isPending: isUploading,
  // } = useMutation({
  //   mutationKey: ["upload-scan"],
  //   mutationFn: uploadScan,
  //   // async (scanBase64: string, scanTitle: string): Promise<GenericResponse<string>>=>{
  //   // 'use server'
  //   // const formData = new FormData();
  //   // formData.set("scan", scanBase64)
  //   // formData.set("scanTitle", scanTitle)
  //   // const res = await fetch('/api/upload',{
  //   //   method:"POST",
  //   //   body:

  //   // })
  //   // const data = await res.json()
  //   // },
  //   onSuccess(data) {
  //     if (!data.success) {
  //       toast({
  //         variant: "destructive",
  //         title: "Ошибка",
  //         description: `Не удалось загрузить скан на сервер (${data.message})`,
  //       });
  //     }
  //     toast({
  //       title: `${mode === "create" ? "Создание" : "Редактирование"}`,
  //       description: `${mode === "create" ? "Алфавитка создана" : "Алфавитка изменена"}`,
  //     });
  //   },
  //   onError(error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Ошибка",
  //       description:
  //         "Произошла ошибка при загрузке скана на сервер: " + error.message,
  //     });
  //   },
  // });

  const cardForm = useZodForm({
    schema: CardUpsertValidator,
    // mode: "onSubmit",
    mode: "all",
    defaultValues: editCard || cardFormDefaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors: clearFormErrors,
    trigger: validateForm,
    formState: { errors, isDirty: isFormDirty, isValid: isFormValid },
  } = cardForm;
  const cardFormRef = useRef(cardForm);
  const lastname = watch("lastname");
  const firstname = watch("firstname");
  const middlename = watch("middlename");
  const scanUrl = watch("scanUrl");

  // console.log(errors);

  useEffect(() => {
    (async () => {
      await validateForm();
    })();
  }, []);

  // original state came from server
  const cardFormInitialState = useMemo(() => cardForm.getValues(), []);

  const onSubmit = async (data: CardInsert) => {
    if (mode === "edit") {
      upsertCard(data);
      return;
    }
    const formData = new FormData();
    formData.append("scan", scanBlob as Blob);

    const res = await uploadScan(formData);
    if (res.success) {
      data.scanUrl = res.payload as string;
      upsertCard(data);
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: `Не удалось загрузить скан на сервер (${res.message})`,
      });
    }
  };

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
              (mode === "create" ? "создания" : "редактирования") +
              ` алфавитки ${shortenFullName(lastname, firstname, middlename)}`}
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
                {mode === "create" && (
                  <ImageCrop
                    onCropped={async (blob: Blob | null) => {
                      if (!blob) {
                        setValue("scanUrl", "");
                        setScanBlob(null);
                      } else {
                        setScanBlob(blob);
                        // const base64 = await blobToBase64(blob);
                        // setValue("scanUrl", base64, { shouldValidate: true });
                        setValue("scanUrl", "set", { shouldValidate: true });
                      }
                    }}
                    errorMessage={errors.scanUrl?.message}
                  />
                )}
                {mode === "edit" &&
                  (scanUrl && storageUrl ? (
                    <ImageZoom src={storageUrl + scanUrl} />
                  ) : (
                    <p className="text-red-400">
                      Не удалось отобразить скан оригинала
                    </p>
                  ))}
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
                  label="Комментарий"
                  placeholder="к выпуску или причина исключения"
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
                  disabled={isUpserting || isSuccess || !isFormValid}
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
