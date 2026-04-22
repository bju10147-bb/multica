"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { en } from "./en";
import { ko } from "./ko";
import type { Dictionary, Locale } from "./types";

const dictionaries: Record<Locale, Dictionary> = { 
  ko, 
  en,
  zh: en, // Fallback zh to en for now if zh dictionary not yet created here
};

const COOKIE_NAME = "multica-locale";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "ko",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Sync with cookie on mount
    const match = document.cookie.match(/(?:^|;\s*)multica-locale=(\w+)/);
    const savedLocale = match?.[1] as Locale;
    if (savedLocale && (savedLocale === "ko" || savedLocale === "en" || savedLocale === "zh")) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      document.documentElement.lang = l;
    }
  }, []);

  return (
    <LocaleContext.Provider
      value={{ locale, t: dictionaries[locale] || dictionaries.en, setLocale }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
