import type { MMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const getJsonStorage = (mmkvStorage: MMKV): StateStorage => {
  return {
    setItem: (name, value) => {
      return mmkvStorage.set(name, value);
    },
    getItem: (name) => {
      const value = mmkvStorage.getString(name);
      return value ?? null;
    },
    removeItem: (name) => {
      return mmkvStorage.remove(name);
    },
  };
};
