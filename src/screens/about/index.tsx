import { SafeAreaView, Text, View } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

export function AboutScreen() {
  const { t } = useTranslation("about");

  return (
    <SafeAreaView className="flex-1 flex-center bg-card">
      <View className="w-full flex-1 flex-center gap-2">
        <Text>{t("title")}</Text>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
