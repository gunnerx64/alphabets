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
import { Input } from "@/components/ui/input";
import { DataFieldProps } from "@/types";

const FormTextField = React.forwardRef<HTMLInputElement, DataFieldProps>(
  function (props: DataFieldProps, ref) {
    const { control } = useFormContext(); // retrieve all hook methods
    const { name, label, desc, placeholder, type, styles, disabled, hideDesc } =
      props;
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                {...field}
                placeholder={placeholder ?? ""}
                className={styles}
                type={type ?? "text"}
                readOnly={disabled}
                ref={ref}
              />
            </FormControl>
            {desc && !hideDesc && <FormDescription>{desc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default FormTextField;
