import { APP_NAME } from "@/app-constants";
import { Text, View } from "@/components/tw";
import { wpx } from "@/utils/screen-utils";
import { EaseView } from "react-native-ease/uniwind";

interface Props {
  duration: number;
}

export function SplashComponent({ duration }: Props) {
  return (
    <View className="flex-1 bg-background">
      <View className="abs-center absolute gap-6">
        <View className="size-30 rounded-[16px] bg-black" />
        <Text name="24.bold.action" center>
          {APP_NAME}
        </Text>
      </View>
      <View className="absolute bottom-1/4 left-1/2 -translate-x-1/2">
        <View className="h-1.5 overflow-hidden rounded-full bg-background-secondary" style={{ width: wpx(100) }}>
          <EaseView
            initialAnimate={{ translateX: -wpx(100) }}
            animate={{ translateX: 0 }}
            transition={{ type: "timing", duration }}
            className="absolute size-full rounded-full bg-action"
          />
        </View>
      </View>
    </View>
  );
}
