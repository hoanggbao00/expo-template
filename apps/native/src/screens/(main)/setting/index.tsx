import Flag from "@/components/flag";
import HeaderLayout from "@/components/layout/header-layout";
import { Icon, SafeAreaView, View } from "@/components/tw";
import { LANGUAGES } from "@/i18n/languages";
import { useAppTranslation } from "@/i18n/use-app-translation";
import { DevItem } from "@/screens/(main)/setting/components/dev-item";
import { usePreferencesStore } from "@/state/persisted/preferences-store";
import { wpx, ms } from "@/utils";
import { toast } from "sonner-native";
import { SettingItem } from "@/screens/(main)/setting/components/setting-item";

export default function SettingScreen() {
  const { t } = useAppTranslation("setting");

  const isDevMode = usePreferencesStore((state) => state.preferences.isDevMode);
  const currentLanguage = usePreferencesStore((state) => state.preferences.language);
  const languageFlag = LANGUAGES.find((language) => language.code === currentLanguage);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const FlagComponent = Flag({
    code: languageFlag?.flag ?? "us",
    size: wpx(24),
  });

  const onLongPressLanguage = () => {
    const newIsDevMode = !isDevMode;
    setPreferences({ isDevMode: newIsDevMode });
    const message = newIsDevMode ? "Dev mode enabled" : "Dev mode disabled";
    toast(message, {
      duration: ms.Sec(1),
      position: "bottom-center",
    });
  };

  return (
    <SafeAreaView className="flex-1 gap-4 bg-background px-4">
      <HeaderLayout title={t("page_title")} />
      <View className="flex-1 gap-3">
        <SettingItem
          icon={Icon({ name: "world" })}
          label={t("language")}
          href="/setting-language"
          right={FlagComponent}
          onLongPress={onLongPressLanguage}
        />
        {isDevMode && <DevItem />}
      </View>
    </SafeAreaView>
  );
}
