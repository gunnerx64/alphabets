"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DataFieldProps } from "@/types";
import { cn } from "@/lib/utils";

export const FormTextArea = React.forwardRef<
  HTMLTextAreaElement,
  DataFieldProps
>(function (props: DataFieldProps, ref) {
  const { control } = useFormContext(); // retrieve all hook methods
  const { name, label, desc, placeholder, styles, disabled } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder ?? ""}
              className={cn("h-32", styles && styles)}
              readOnly={disabled}
              ref={ref}
            />
          </FormControl>
          {desc && <FormDescription>{desc}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

export default FormTextArea;
