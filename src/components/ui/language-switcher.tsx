"use client";

import { useTranslation } from "@/lib/i18n/context";
import { localeConfig } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { locale, setLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors">
        <Globe className="h-4 w-4" />
        {!compact && localeConfig[locale].label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeConfig) as Locale[]).map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={locale === loc ? "bg-muted" : ""}
          >
            <span className="me-2">{localeConfig[loc].flag}</span>
            {localeConfig[loc].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
