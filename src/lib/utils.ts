import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const switchLanguage = (lang: string, pathname: string): string => {
  const segments = pathname.split("/");
  segments[1] = lang;
  return segments.join("/");
};

export function getUserTimeZone(): string {
  if (typeof window !== "undefined" && Intl && Intl.DateTimeFormat) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  return "UTC";
}
