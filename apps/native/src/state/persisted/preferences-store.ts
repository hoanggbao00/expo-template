import type { LanguageCode } from "@/i18n/languages";
import { getJsonStorage } from "@/state/persisted/utils";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface Preferences {
  isOnboarded: boolean;
  selectedTheme: "light" | "dark";
  deviceId?: string;
  language?: LanguageCode;
  isRegistered: boolean;
  isRTL: boolean;
  isDevMode: boolean;
}

export const defaultPreferences: Preferences = {
  isOnboarded: false,
  selectedTheme: "light",
  deviceId: undefined,
  language: undefined,
  isRegistered: false,
  isRTL: false,
  isDevMode: __DEV__,
};

interface PreferencesStore {
  preferences: Preferences;
  setPreferences: (preferences: Partial<Preferences>) => void;
  _isHydrated: boolean;
  setIsHydrated: (isHydrated: boolean) => void;
}

const STORAGE_KEY = "preferences";

// === MMKV Storage ===
const storage = createMMKV({ id: STORAGE_KEY });
const mmkvStorage = getJsonStorage(storage);

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      setPreferences: (values) => set({ preferences: { ...get().preferences, ...values } }),
      _isHydrated: false,
      setIsHydrated: (isHydrated) => set({ _isHydrated: isHydrated }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ preferences: state.preferences }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    }
  )
);

// === Utils for get and update preferences outside hooks ===
export const getPreferences = () => {
  return usePreferencesStore.getState().preferences;
};

export const updatePreferences = (preferences: Partial<Preferences>) => {
  usePreferencesStore.getState().setPreferences(preferences);
};
