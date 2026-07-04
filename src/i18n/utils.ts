import { type LanguageCode, LANGUAGES } from "@/i18n/languages";
import { getPreferences, updatePreferences } from "@/state/persisted/preferences";
import { getLocales } from "expo-localization";
import { I18nManager } from "react-native";

const SUPPORTED_LANGUAGE_CODES = new Set<LanguageCode>(LANGUAGES.map((language) => language.code));

const getDeviceLanguageOrFallback = (): LanguageCode => {
  const primary = getLocales()[0];
  const code = primary?.languageCode?.toLowerCase() as LanguageCode;
  if (!code) return "en";
  if (SUPPORTED_LANGUAGE_CODES.has(code)) return code;
  if (code.startsWith("zh")) return "zh";
  return "en";
};

export const getAndSetInitialLanguage = (): LanguageCode => {
  let language: LanguageCode | undefined;
  let isRTL: boolean | undefined;
  language = getPreferences().language;

  if (language) return language;

  language = getDeviceLanguageOrFallback();

  const lang = LANGUAGES.find((lang) => lang.code === language);
  isRTL = lang?.rtl ?? false;
  if (isRTL !== I18nManager.isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
  }

  updatePreferences({ language, isRTL });
  return language;
};
