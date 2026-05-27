import HeaderLayout from "@/components/layout/header-layout";
import { SafeAreaView, Text, View } from "@/components/tw";

export default function SecondScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background px-4">
      <HeaderLayout title="Second Screen" />
      <View className="flex-1 items-center justify-center">
        <Text>Second Screen</Text>
      </View>
    </SafeAreaView>
  );
}
