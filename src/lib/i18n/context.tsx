"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Locale, Direction } from "./types";
import { translations, localeConfig } from "./translations";

type I18nContext = {
  locale: Locale;
  dir: Direction;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<I18nContext | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "he";
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored && stored in localeConfig) return stored;
  return "he";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const dir = localeConfig[locale].dir;

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = localeConfig[newLocale].dir;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = translations[locale][key] ?? translations["en"][key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(`{${k}}`, String(v));
        });
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nCtx.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
