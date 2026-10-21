import { View } from "react-native";
import { SafeAreaView, Text } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

export function HomeScreen() {
  const { t } = useTranslation("home");

  return (
    <SafeAreaView className="flex-1 flex-center bg-card">
      <View className="w-full flex-1 flex-center gap-2">
        <Text>{t("title")}</Text>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
