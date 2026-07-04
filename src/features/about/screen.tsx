import { SafeAreaView, Text, View } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { useAppTranslation } from "@/i18n/use-app-translation";

export default function AboutScreen() {
  const { t } = useAppTranslation("about");

  return (
    <SafeAreaView className="flex-1 flex-center bg-background-secondary">
      <View className="w-full flex-1 flex-center gap-2">
        <Text>{t("title")}</Text>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
