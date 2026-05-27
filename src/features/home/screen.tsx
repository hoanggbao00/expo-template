import { SafeAreaView, TextUI, View } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { useAppTranslation } from "@/i18n/use-app-translation";

export default function HomeScreen() {
  const { t } = useAppTranslation("home");

  return (
    <SafeAreaView className="flex-1 flex-center bg-background-secondary">
      <View className="w-full flex-1 flex-center gap-2">
        <TextUI>{t("title")}</TextUI>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
