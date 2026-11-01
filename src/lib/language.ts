"use client";

import { useState, useEffect } from "react";

export type Language = "en" | "hi";

const STORAGE_KEY = "aethriz_preferred_language";
const EVENT_NAME = "aethriz_language_changed";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: lang }));
  } catch (err) {
    console.warn("Could not save language to localStorage:", err);
  }
}

export function useLanguage(): [Language, (lang: Language) => void] {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(getStoredLanguage());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "en" || e.newValue === "hi")) {
        setLang(e.newValue);
      }
    };

    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<Language>;
      if (custom.detail) {
        setLang(custom.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomChange);
    };
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    setStoredLanguage(newLang);
  };

  return [lang, changeLanguage];
}
