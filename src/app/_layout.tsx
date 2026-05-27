import "@@/global.css";

import { Providers } from "@/providers/providers";
import * as SplashScreen from "expo-splash-screen";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

// Default error boundary
export { ErrorBoundary } from "expo-router";

// Prevent auto hide splash screen when fonts are loaded in the FontProvider
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <>
      <AnimatedSplashOverlay />
      <Providers>
        <AppTabs />
      </Providers>
    </>
  );
}
