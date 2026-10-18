import { DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n/languages";

export interface Preferences {
  language: LanguageCode;
  isOnboarded: boolean;
  selectedTheme: "system" | "light" | "dark";
  isDevMode: boolean;
  deviceId: string;
}

export const defaultPreferences: Preferences = {
  deviceId: "",
  language: DEFAULT_LANGUAGE,
  isOnboarded: false,
  selectedTheme: "system",
  isDevMode: __DEV__,
};
