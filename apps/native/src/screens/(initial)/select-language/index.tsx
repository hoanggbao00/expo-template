import {
  Icon,
  Pressable,
  PressableOpacity,
  PressableScale,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "@/components/tw";
import { changeAppLanguage } from "@/i18n";
import { LANGUAGES, type LanguageCode } from "@/i18n/languages";
import { useAppTranslation } from "@/i18n/use-app-translation";
import { cn } from "@packages/utils/cn";
import { LanguageItem } from "@/screens/(initial)/select-language/components/language-item";
import { usePreferencesStore } from "@/state/persisted/preferences-store";
import { router } from "expo-router";
import { useState } from "react";

interface Props {
  isFromOnboarding?: boolean;
}

export default function SelectLanguageScreen({ isFromOnboarding }: Props) {
  const { t } = useAppTranslation(["onboarding", "common"]);

  // Stores
  const initialLanguageCode = usePreferencesStore((state) => state.preferences.language);

  // States
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<LanguageCode | undefined>(
    isFromOnboarding ? undefined : initialLanguageCode || "en"
  );

  const handleApply = () => {
    changeAppLanguage(selectedLanguageCode ?? "en");

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/onboarding");
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-4 bg-background">
      <View className={cn("flex-row items-center justify-between px-4", !isFromOnboarding && "justify-start gap-2")}>
        {!isFromOnboarding && (
          <PressableOpacity onPress={router.back} hitSlop={10}>
            <Icon name="chevron-left" />
          </PressableOpacity>
        )}
        <Text name="18.semibold.text-primary">{t("onboarding:select_language")}</Text>
        {isFromOnboarding && (
          <Pressable
            className={cn("rounded-8 bg-action px-4 py-1.5", !selectedLanguageCode && "opacity-0")}
            onPress={handleApply}
          >
            <Text name="14.semibold.primary-inverse">{t("common:apply")}</Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-4">
        {LANGUAGES.map((language) => (
          <LanguageItem
            key={language.code}
            {...language}
            isSelected={language.code === selectedLanguageCode}
            onPress={() => setSelectedLanguageCode(language.code)}
          />
        ))}
      </ScrollView>

      {!isFromOnboarding && (
        <View className="px-4">
          <PressableScale onPress={handleApply} className="h-12 flex-center rounded-8 bg-action">
            <Text name="14.semibold.primary-inverse" center>
              {t("common:apply")}
            </Text>
          </PressableScale>
        </View>
      )}
    </SafeAreaView>
  );
}
