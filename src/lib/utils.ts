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
  firstname: string | undefined | null = null,
  middlename: string | undefined | null = null,
): string {
  return `${lastname} ${firstname ? firstname.at(0) + "." : ""}${middlename ? middlename.at(0) + "." : ""}`;
}

/** async convert Blob image to base64 image */
export async function blobToBase64(blob: Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
}
