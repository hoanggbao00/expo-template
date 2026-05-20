import FontProvider from "@/providers/font-provider";
import ThemeProvider from "@/providers/theme-provider";
import { Stack } from "expo-router";
import "../../global.css";

import * as SplashScreen from "expo-splash-screen";

// Default error boundary
export { ErrorBoundary } from "expo-router";

// Prevent auto hide splash screen when fonts are loaded in the FontProvider
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <FontProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </FontProvider>
  );
}
