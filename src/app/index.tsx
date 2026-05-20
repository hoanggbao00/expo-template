import { Icon, PressableScale, SafeAreaView, TextUI, View } from "@/components/tw";
import { Spinner } from "@/components/ui/spinner";
import { wpx } from "@/utils";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 flex-center bg-background-secondary">
      <View className="w-full items-start" style={{ paddingHorizontal: wpx(16) }}>
        <PressableScale className="flex-center rounded-full" hitSlop={10}>
          <Icon className="text-icon-primary" name="chevron-left" size={wpx(24)} />
        </PressableScale>
      </View>
      <View className="w-full flex-1 flex-center gap-2">
        <TextUI>Edit src/app/index.tsx to edit this screen.</TextUI>
        <Spinner />
      </View>
    </SafeAreaView>
  );
}
