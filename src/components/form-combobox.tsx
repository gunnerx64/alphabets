"use client";
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DataFieldProps, OptionItem } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";

export const FormCombobox = React.forwardRef<HTMLButtonElement, DataFieldProps>(
  function (props: DataFieldProps, ref) {
    const [open, setOpen] = useState(false);
    const [searchString, setSearchString] = useState<string>("");
    const [debouncedSearchString] = useDebounce(searchString, 300);
    const [filteredOptions, setFilteredOptions] = useState<OptionItem[]>([]);
    const { control, setValue, watch } = useFormContext(); // retrieve all hook methods
    const {
      name,
      label,
      desc,
      placeholder,
      styles,
      options,
      disabled,
      hideDesc,
    } = props;
    const currentValue = watch(name);

    useEffect(() => {
      if (name) setValue(name, currentValue, { shouldValidate: true });
    }, [name, currentValue]);

    useEffect(() => {
      let opts: OptionItem[] = [];
      if (!debouncedSearchString && currentValue)
        opts.push({ id: "", title: "Не указано" });
      // если поиск пуст, то добавляем 10 первых элементов
      if (!debouncedSearchString && options) {
        const newOpts = options.slice(0, 7);
        opts.push(...newOpts);
        //console.log("opts after empty: ", opts);

        // добавляем текущий выбранный элемент в выпадающий список (если его там нет!)
        if (currentValue && options) {
          const found = options.find(({ id }) => id === currentValue);
          if (found) {
            const dupFound = opts.find(({ id }) => id === found.id);
            if (!dupFound) opts.push(found); // добавляем только если объекта еще нет в списке
          }
          //console.log("opts after curr: ", opts);
        }
      }
      // если поиск задан, то фильтруем по нему и добавляем 10 первых элементов
      else if (!!debouncedSearchString && options) {
        const filteredOpts = options.filter(({ title }) =>
          title.toLowerCase().startsWith(debouncedSearchString.toLowerCase()),
        );
        const newOpts = filteredOpts.slice(0, 7);
        opts.push(...newOpts);
        //console.log("opts after not empty search: ", opts);
      }

      setFilteredOptions(opts);
    }, [options, debouncedSearchString, currentValue]);

    useEffect(() => {
      setSearchString("");
    }, [open]);

    return (
      <FormField
        control={control}
        name={name}
        // {...register(name)}
        // {...otherProps}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label && <FormLabel className="my-1">{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    ref={ref}
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                      !field.value && "text-muted-foreground",
                      styles && styles,
                    )}
                    disabled={disabled}
                  >
                    {field.value && options
                      ? options.find((option) => option.id === field.value)
                          ?.title
                      : (placeholder ?? "")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className={cn("p-0", styles && styles)}>
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Поиск.."
                    onValueChange={(value) => {
                      setSearchString(value);
                    }}
                  />
                  <CommandEmpty>Ничего не найдено.</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions &&
                      filteredOptions.map(({ id, title }) => (
                        <CommandItem
                          value={id}
                          key={id}
                          onSelect={() => {
                            setValue(name, id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              id === field.value ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {title}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {desc && !hideDesc && <FormDescription>{desc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  },
);

export default FormCombobox;
