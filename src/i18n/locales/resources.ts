import enTranslations from "./en.json";
import viTranslations from "./vi.json";

export const resources = {
  en: enTranslations,
  vi: viTranslations,
};

export type AppTranslationResources = typeof enTranslations;
export type AppTranslationResourceKeys = keyof AppTranslationResources;
