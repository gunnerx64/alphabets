"use client";
import { PropsWithChildren, useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RegionInsert } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { useZodForm } from "@/hooks/use-zod-form";
import { RegionUpsertValidator } from "@/lib/validators";
import FormTextField from "@/components/form/form-textfield";

interface RegionFormDialogProps extends PropsWithChildren {
  region?: RegionInsert;
  mode: "create" | "edit";
}

const defaultValues: RegionInsert = {
  title: "",
  state: "",
  sort: 100,
};

export function RegionFormDialog({
  region,
  mode,
  children,
}: RegionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const form = useZodForm({
    schema: RegionUpsertValidator,
    mode: "all",
    defaultValues: region ?? defaultValues,
  });

  // const form = useForm<RegionInsert>({
  //   mode: "onSubmit",
  //   defaultValues: region ?? defaultValues,
  // });
  const { register, handleSubmit } = form;

  const { mutate: upsertRegion, isPending } =
    api.region.upsertRegion.useMutation({
      onSettled: (res, error) => {
        if (res?.success) {
          utils.region.getAllRegions.invalidate();
          form.reset();
          setOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Неуспешная операция",
            description: res?.message || error?.message,
          });
        }
      },
    });

  useEffect(() => {
    if (region) {
      form.reset(region);
    }
  }, [region]);

  const onSubmit: SubmitHandler<RegionInsert> = (data) => {
    upsertRegion(data); //{ ...data, active }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[568px]">
        <DialogHeader>
          <DialogTitle>{`${
            mode === "create" ? "Добавление" : "Изменение"
          } региона`}</DialogTitle>
          <DialogDescription>
            Укажите данные региона в форме. Республику указывайте в сокращённом
            виде (РСФСР, УССР) или полном (Такжикская ССР). Поле сортировка
            отвечает за порядок в выпадающем списке регионов на форме создания
            алфавитки, а также в этой таблице. Нажмите сохранить после
            завершения редактирования.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Название региона
                </Label>
                <div className="col-span-2">
                  <FormTextField name="title" placeholder="Воронежская обл." />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  Республика
                </Label>
                <div className="col-span-2">
                  <FormTextField name="state" placeholder="БССР" />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sort" className="text-right">
                  Сортировка
                </Label>
                <div className="col-span-2">
                  <FormTextField name="sort" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={!form.formState.isValid}>Сохранить</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
