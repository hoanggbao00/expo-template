import { DEFAULT_LANGUAGE, isLanguageCode, LANGUAGES, type LanguageCode } from "@/i18n/languages";
import { resources } from "@/i18n/locales/resources";
import { getPreferences, updatePreferences } from "@/state/persisted";
import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

// Stored preference wins; anything missing or unsupported falls back to English.
const getInitialLanguage = (): LanguageCode => {
  const { language } = getPreferences();
  return isLanguageCode(language) ? language : DEFAULT_LANGUAGE;
};

export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES.map((language) => language.code),
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export const changeAppLanguage = async (language: LanguageCode): Promise<void> => {
  updatePreferences({ language });
  await i18n.changeLanguage(language);
};
