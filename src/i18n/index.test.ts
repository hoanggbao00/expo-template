import { expect, test } from "bun:test";
import { createMMKV } from "react-native-mmkv";

test("unsupported stored language falls back to en, changeAppLanguage persists the choice", async () => {
  createMMKV({ id: "preferences" }).set(
    "preferences",
    JSON.stringify({ state: { preferences: { language: "fr" } }, version: 0 })
  );
  const { getPreferences, usePreferencesStore } = await import("@/state/persisted");
  await usePreferencesStore.persist.rehydrate();
  // Import after seeding: the initial language is read when the module loads.
  const { changeAppLanguage, i18n } = await import("@/i18n");

  expect(i18n.language).toBe("en");

  await changeAppLanguage("vi");
  expect(i18n.language).toBe("vi");
  expect(i18n.t("home:title")).toBe("Trang chủ");
  expect(getPreferences().language).toBe("vi");
});
