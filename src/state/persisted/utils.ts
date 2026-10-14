import type { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

const isValidJson = (value: string) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const getJsonStorage = (mmkvStorage: MMKV): StateStorage => ({
  setItem: (name, value) => mmkvStorage.set(name, value),
  getItem: (name) => {
    const value = mmkvStorage.getString(name);
    if (value === undefined) return null;
    // Corrupted payload would make persist skip hydration forever; drop it and fall back to defaults.
    if (!isValidJson(value)) {
      mmkvStorage.remove(name);
      return null;
    }
    return value;
  },
  removeItem: (name) => mmkvStorage.remove(name),
});
