import { mock } from "bun:test";

// Globals that Metro/React Native normally provide.
(globalThis as { __DEV__?: boolean }).__DEV__ = true;

// MMKV is a native module; back it with an in-memory map, one instance per id.
const instances = new Map<string, Map<string, string>>();

mock.module("react-native-mmkv", () => ({
  createMMKV: ({ id }: { id: string }) => {
    const data = instances.get(id) ?? new Map<string, string>();
    instances.set(id, data);
    return {
      set: (key: string, value: string) => data.set(key, value),
      getString: (key: string) => data.get(key),
      remove: (key: string) => data.delete(key),
    };
  },
}));
