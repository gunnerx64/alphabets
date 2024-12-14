import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseColor = (color: string) => {
  const hex = color.startsWith("#") ? color.slice(1) : color;
  return parseInt(hex, 16);
};

export function shortenFullName(
  lastname: string,
  firstname: string,
  middlname: string | null = null,
): string {
  return `${lastname} ${firstname.at(0)}.${middlname ? middlname.at(0) + "." : ""}`;
}
