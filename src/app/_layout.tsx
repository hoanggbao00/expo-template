import "@@/global.css";
import { Stack } from "expo-router";

import { Providers } from "@/providers/providers";
import * as SplashScreen from "expo-splash-screen";

// Default error boundary
export { ErrorBoundary } from "expo-router";

// Prevent auto hide splash screen when fonts are loaded in the FontProvider
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}
