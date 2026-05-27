import { ImgOnboardingStep1, ImgOnboardingStep2, ImgOnboardingStep3 } from "../../../../assets/images/onboarding";
import { SafeAreaView, Text, View } from "@/components/tw";
import StepIndicators from "@/screens/(initial)/onboarding/components/step-indicators";
import OnboardingStepItem from "@/screens/(initial)/onboarding/components/step-item";
import { updatePreferences } from "@/state/persisted/preferences-store";
import { router } from "expo-router";
import { useRef, useState } from "react";
import PagerView, { type PagerViewOnPageScrollEvent, type PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { useSharedValue } from "react-native-reanimated";

const STEPS = [
  {
    id: "step-1",
    title: "step1_title",
    description: "step1_description",
    image: ImgOnboardingStep1,
  },
  {
    id: "step-2",
    title: "step2_title",
    description: "step2_description",
    image: ImgOnboardingStep2,
  },
  {
    id: "step-3",
    title: "step3_title",
    description: "step3_description",
    image: ImgOnboardingStep3,
  },
];

export default function OnboardingScreen() {
  const pagerViewRef = useRef<PagerView>(null);
  const [step, setStep] = useState(0);
  const scrollPosition = useSharedValue(0);

  const onChangePage = (position: number) => {
    pagerViewRef.current?.setPage(position);
  };

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    setStep(event.nativeEvent.position);
  };

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      updatePreferences({ isOnboarded: true });
      router.replace("/home");
      return;
    }

    const nextStep = step + 1;
    onChangePage(nextStep);
  };

  const handlePageScroll = (event: PagerViewOnPageScrollEvent) => {
    scrollPosition.value = event.nativeEvent.position + event.nativeEvent.offset;
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-2">
      <View className="flex-1">
        <PagerView
          initialPage={0}
          style={{ flex: 1 }}
          ref={pagerViewRef}
          onPageSelected={handlePageSelected}
          onPageScroll={handlePageScroll}
        >
          {STEPS.map((step) => (
            <OnboardingStepItem key={step.id} step={step} />
          ))}
        </PagerView>
        <StepIndicators
          currentStep={step}
          onNext={handleNext}
          scrollPosition={scrollPosition}
          stepCount={STEPS.length}
        />
        <View className="h-[313px] w-full flex-center">
          <Text>Banner Native</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
