"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputMask, { ReactInputMask } from "react-input-mask";
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

const FormMaskTextField = React.forwardRef<ReactInputMask, DataFieldProps>(
  function (props: DataFieldProps, ref) {
    const { control } = useFormContext(); // retrieve all hook methods
    const {
      name,
      label,
      desc,
      placeholder,
      type,
      styles,
      mask,
      ...otherProps
    } = props;
    return (
      <FormField
        control={control}
        name={name}
        // {...register(name)}
        // {...otherProps}
        render={({ field }) => (
          <FormItem className={styles}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <InputMask
                {...field}
                ref={ref}
                // mask options
                mask={mask ?? ""}
                alwaysShowMask={false}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder ?? ""}
              >
                {(inputProps) => <Input {...inputProps} type="text" />}
              </InputMask>
            </FormControl>
            {desc && <FormDescription>{desc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default FormMaskTextField;
