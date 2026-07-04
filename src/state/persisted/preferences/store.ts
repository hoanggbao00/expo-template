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
      onRehydrateStorage: () => (state) => state?.setIsHydrated(true),
    }
  )
);

// === Utils for get and update preferences outside hooks ===
export const getPreferences = () => usePreferencesStore.getState().preferences;

export const updatePreferences = (preferences: Partial<Preferences>) => {
  usePreferencesStore.getState().setPreferences(preferences);
};
