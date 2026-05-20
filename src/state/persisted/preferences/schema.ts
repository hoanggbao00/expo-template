export interface Preferences {
  isOnboarded: boolean;
  selectedTheme: "system" | "light" | "dark";
  isRTL: boolean;
  isDevMode: boolean;
}

export const defaultPreferences: Preferences = {
  isOnboarded: false,
  selectedTheme: "system",
  isRTL: false,
  isDevMode: __DEV__,
};
