import { Icon, PressableScale, SafeAreaView, TextUI, View } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { useAppTranslation } from "@/i18n/use-app-translation";
import { wpx } from "@/utils";

export default function Index() {
  const { t } = useAppTranslation("home");

  return (
    <SafeAreaView className="flex-1 flex-center bg-background-secondary">
      <View className="w-full items-start" style={{ paddingHorizontal: wpx(16) }}>
        <PressableScale className="flex-center rounded-full" hitSlop={10}>
          <Icon className="text-icon-primary" name="chevron-left" size={wpx(24)} />
        </PressableScale>
      </View>
      <View className="w-full flex-1 flex-center gap-2">
        <TextUI>{t("title")}</TextUI>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
