import { AnimatedView, PressableOpacity, Text, View } from "@/components/tw";
import { useAppTranslation } from "@/i18n/use-app-translation";
import { wpx } from "@/utils/screen-utils";
import { useEffect } from "react";
import type { SharedValue } from "react-native-reanimated";
import { cancelAnimation, Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";

interface Props {
  currentStep: number;
  onNext: () => void;
  scrollPosition: SharedValue<number>;
  stepCount: number;
}

const ACTIVE_INDICATOR_WIDTH = wpx(32);
const CENTER_INDICATOR_WIDTH = wpx(16);
const INACTIVE_INDICATOR_WIDTH = wpx(8);
const INDICATOR_GAP = wpx(8);

interface IndicatorDotProps {
  index: number;
  scrollPosition: SharedValue<number>;
}

function IndicatorDot({ index, scrollPosition }: IndicatorDotProps) {
  const animatedDotContainerStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollPosition.value - index);

    const width = interpolate(
      distance,
      [0, 0.5, 1],
      [ACTIVE_INDICATOR_WIDTH, CENTER_INDICATOR_WIDTH, INACTIVE_INDICATOR_WIDTH],
      Extrapolation.CLAMP
    );

    return {
      width,
    };
  });

  return (
    <AnimatedView className="flex-center" style={[{ height: INACTIVE_INDICATOR_WIDTH }, animatedDotContainerStyle]}>
      <View className="aspect-square rounded-full bg-icon-disabled" style={{ width: INACTIVE_INDICATOR_WIDTH }} />
    </AnimatedView>
  );
}

export default function StepIndicators({ currentStep, onNext, scrollPosition, stepCount }: Props) {
  const { t } = useAppTranslation(["common"]);
  const steps = Array.from({ length: stepCount }, (_, index) => index);
  const isLastStep = currentStep === stepCount - 1;
  const text = isLastStep ? t("common:done") : t("common:next");

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const position = scrollPosition.value;

    const translateX = position * (INACTIVE_INDICATOR_WIDTH + INDICATOR_GAP);

    const fractionalPart = position - Math.floor(position);
    const width = interpolate(
      fractionalPart,
      [0, 0.5, 1],
      [ACTIVE_INDICATOR_WIDTH, CENTER_INDICATOR_WIDTH, ACTIVE_INDICATOR_WIDTH],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
      width,
    };
  });

  useEffect(() => {
    return () => {
      cancelAnimation(scrollPosition);
    };
  }, []);

  return (
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center gap-2">
        {steps.map((step) => (
          <IndicatorDot key={step} index={step} scrollPosition={scrollPosition} />
        ))}

        <AnimatedView
          className="absolute rounded-full bg-action"
          style={[{ height: INACTIVE_INDICATOR_WIDTH }, animatedIndicatorStyle]}
        />
      </View>

      <PressableOpacity onPress={onNext} className="px-6">
        <Text name="16.semibold.action">{text}</Text>
      </PressableOpacity>
    </View>
  );
}
