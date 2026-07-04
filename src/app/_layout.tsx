import "@@/global.css";

import { Providers } from "@/providers/providers";
import * as SplashScreen from "expo-splash-screen";
import AppTabs from "@/components/app-tabs";
import { useInitDeviceId } from "@/hooks/use-init-device-id";

// Default error boundary
export { ErrorBoundary } from "expo-router";

// Prevent auto hide splash screen when fonts are loaded in the FontProvider
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useInitDeviceId();

  return (
    <Providers>
      <AppTabs />
    </Providers>
  );
}
