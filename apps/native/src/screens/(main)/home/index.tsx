import { Icon, Pressable, PressableScale, SafeAreaView, Text, View } from "@/components/tw";
import BorderInline from "@/components/ui/border-inline";
import GradientFill from "@/components/ui/gradient-fill";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "expo-router";
import { wpx } from "@/utils/screen-utils";
import { toastNative } from "@packages/ui-kit/toast-native";

export default function HomeScreen() {
  const onPress = () => {
    toastNative.success("Hello, world!");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center justify-between px-4">
        <Link asChild href="/setting">
          <Pressable>
            <Icon name="menu-2" size={wpx(24)} />
          </Pressable>
        </Link>
      </View>
      <View className="flex-1 items-center justify-center gap-6 px-4">
        <Text name="24.bold.text-primary">HomeScreen</Text>
        <Link asChild href="/second">
          <Pressable>
            <Text>Go to second screen</Text>
          </Pressable>
        </Link>

        <PressableScale
          onPress={onPress}
          className="w-full items-center justify-center rounded-full bg-background-secondary py-2"
        >
          <GradientFill className="rounded-full" />
          <BorderInline className="rounded-full" />
          <Text>Pressable Scale + Gradient + Border Inline</Text>
        </PressableScale>

        <Spinner className="text-action" size={wpx(24)} />
      </View>
    </SafeAreaView>
  );
}
