import { expect, test } from "bun:test";
import { createMMKV } from "react-native-mmkv";
import { defaultPreferences } from "./schema";
import { usePreferencesStore } from "./store";

const seed = (preferences: Record<string, unknown>) =>
  createMMKV({ id: "preferences" }).set("preferences", JSON.stringify({ state: { preferences }, version: 0 }));

test("rehydrate keeps stored values, fills new defaults, drops removed fields", async () => {
  seed({ language: "vi", isRTL: true });
  await usePreferencesStore.persist.rehydrate();

  expect(usePreferencesStore.getState().preferences).toEqual({ ...defaultPreferences, language: "vi" });
});
