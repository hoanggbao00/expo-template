import { getJsonStorage } from "@/state/persisted/utils";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultPreferences, type Preferences } from "./schema";

interface State {
  preferences: Preferences;
  _isHydrated: boolean;
}

interface Action {
  setPreferences: (preferences: Partial<Preferences>) => void;
  setIsHydrated: (isHydrated: boolean) => void;
}

const STORAGE_KEY = "preferences";

const storage = createMMKV({ id: STORAGE_KEY });
const mmkvStorage = getJsonStorage(storage);

export const usePreferencesStore = create<State & Action>()(
  persist(
    (set, get) => ({
      _isHydrated: false,
      setIsHydrated: (isHydrated) => set({ _isHydrated: isHydrated }),

      preferences: defaultPreferences,
      setPreferences: (values) => set({ preferences: { ...get().preferences, ...values } }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ preferences: state.preferences }),
      // Default merge is shallow: fill fields added since last save, drop fields that were removed.
      merge: (persisted, current) => {
        const stored: Partial<Preferences> = (persisted as Partial<State> | undefined)?.preferences ?? {};
        const preferences = Object.fromEntries(
          Object.entries(current.preferences).map(([key, value]) => [key, stored[key as keyof Preferences] ?? value])
        ) as Preferences;
        return { ...current, preferences };
      },
      onRehydrateStorage: () => (state) => state?.setIsHydrated(true),
    }
  )
);

// === Utils for get and update preferences outside hooks ===
export const getPreferences = () => usePreferencesStore.getState().preferences;

export const updatePreferences = (preferences: Partial<Preferences>) => {
  usePreferencesStore.getState().setPreferences(preferences);
};
