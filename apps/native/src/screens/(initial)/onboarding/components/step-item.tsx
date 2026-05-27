import { ScrollView, Text, View } from "@/components/tw";
import { useAppTranslation } from "@/i18n/use-app-translation";
import { Image } from "expo-image";
import type { ImageSourcePropType } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface Step {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

interface Props {
  step: Step;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function OnboardingStepItem({ step }: Props) {
  const { _: t } = useAppTranslation(["onboarding"]);

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerClassName="grow-1">
      <View className="flex-1 gap-[23px] pt-5">
        <AnimatedImage source={step.image} style={{ flex: 1, width: "100%" }} contentFit="contain" entering={FadeIn} />
        <View className="w-full gap-1 py-2">
          <Text name="16.semibold.text-primary" center>
            {t(step.title)}
          </Text>
          <Text name="14.regular.text-secondary" center>
            {t(step.description)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
