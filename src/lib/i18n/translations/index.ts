import he from "./he";
import en from "./en";
import ru from "./ru";
import type { Locale, Direction, TranslationDict } from "../types";

export const translations: Record<Locale, TranslationDict> = { he, en, ru };

export const localeConfig: Record<Locale, { dir: Direction; label: string; flag: string }> = {
  he: { dir: "rtl", label: "עברית", flag: "🇮🇱" },
  en: { dir: "ltr", label: "English", flag: "🇬🇧" },
  ru: { dir: "ltr", label: "Русский", flag: "🇷🇺" },
};
