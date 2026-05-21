import { LANGUAGES, type LanguageCode } from "@/i18n/languages";
import { resources } from "@/i18n/locales/resources";
import { getAndSetInitialLanguage } from "@/i18n/utils";
import { updatePreferences } from "@/state/persisted";
import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

export const i18n: I18nInstance = i18next.createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: getAndSetInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: LANGUAGES.map((language) => language.code),
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export const changeAppLanguage = async (language: LanguageCode): Promise<void> => {
  const lang = LANGUAGES.find((lang) => lang.code === language);
  const isRTL = lang?.rtl ?? false;

  if (isRTL !== I18nManager.isRTL) {
    I18nManager.allowRTL(isRTL);
  }

  updatePreferences({ language, isRTL });

  await i18n.changeLanguage(language);
};
