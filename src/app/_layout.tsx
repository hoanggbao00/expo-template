import "@/global.css";
import { Providers } from "@/providers/providers";
import { AdaptiveStatusBar } from "@rbayuokt/expo-adaptive-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AppStack from "@/components/app-stack";
import { useInitDeviceId } from "@/hooks/use-init-device-id";

// Custom error boundary (placeholder for crash reporting inside)
export { ErrorBoundary } from "@/components/error-boundary";

// Prevent auto hide splash screen when fonts are loaded in the FontProvider
SplashScreen.preventAutoHideAsync();

// Native side samples the strip behind the status bar and picks light/dark icons.
AdaptiveStatusBar.enable();

export default function RootLayout() {
  useInitDeviceId();

  return (
    <Providers>
      <AppStack />
    </Providers>
  );
}
