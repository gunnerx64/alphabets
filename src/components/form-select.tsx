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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataFieldProps } from "@/types";

export const FormSelect = React.forwardRef<HTMLInputElement, DataFieldProps>(
  function (props: DataFieldProps, ref) {
    const { control } = useFormContext(); // retrieve all hook methods
    const {
      name,
      label,
      desc,
      placeholder,
      options,
      //allowEmptyOption,
      styles,
      disabled,
      hideDesc,
    } = props;
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className={styles && styles}>
            {label && <FormLabel>{label}</FormLabel>}
            <Select
              value={field.value}
              onValueChange={field.onChange}
              //defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl ref={ref}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder ?? ""} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[24rem] overflow-y-auto">
                <SelectGroup>
                  {/* {allowEmptyOption && (
                  <SelectItem defaultChecked value={"undefined"}>
                    Не указано
                  </SelectItem>
                )} */}
                  {/* {defaultValue && <SelectLabel>{defaultValue}</SelectLabel>} */}
                  {options &&
                    options.map(({ id, title }) => (
                      <SelectItem key={id} value={id}>
                        {title}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {desc && !hideDesc && <FormDescription>{desc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default FormSelect;
