import { SplashComponent } from "@/screens/(initial)/splash/components/splash-component";
import { MAX_SPLASH_SCREEN_DURATION } from "@/app-constants";
import { useRegisterDevice } from "@/screens/(initial)/splash/hooks/use-register-device";
import { useSplashTimer } from "@/screens/(initial)/splash/hooks/use-splash-timer";
import { useEffect } from "react";
import { router } from "expo-router";

const HOME_PATH: AppRoute = "/home";
const SELECT_LANGUAGE_PATH: AppRoute = "/onboarding-language";

export default function SplashScreen() {
  const { minTimerPassed, maxTimerPassed, clearTimers } = useSplashTimer();
  const { isRegistered, isStoreHydrated, isOnboarded } = useRegisterDevice();

  const pathToRedirect: AppRoute = isStoreHydrated && isOnboarded ? HOME_PATH : SELECT_LANGUAGE_PATH;
  const shouldRedirect = maxTimerPassed || (minTimerPassed && isRegistered);

  useEffect(() => {
    if (shouldRedirect) {
      clearTimers("all");
      setTimeout(() => {
        router.dismissTo(pathToRedirect);
      }, 100);
    }
  }, [shouldRedirect]);

  return <SplashComponent duration={MAX_SPLASH_SCREEN_DURATION} />;
}
