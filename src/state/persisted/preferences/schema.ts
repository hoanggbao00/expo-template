import type { LanguageCode } from "@/i18n/languages";

export interface Preferences {
  language: LanguageCode;
  isOnboarded: boolean;
  selectedTheme: "system" | "light" | "dark";
  isRTL: boolean;
  isDevMode: boolean;
  deviceId: string;
}

export const defaultPreferences: Preferences = {
  deviceId: "",
  language: "en",
  isOnboarded: false,
  selectedTheme: "system",
  isRTL: false,
  isDevMode: __DEV__,
};
