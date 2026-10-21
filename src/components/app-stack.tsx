import { useThemeColor } from "@/hooks/use-theme-color";
import { DarkTheme, DefaultTheme, Stack, type Theme, ThemeProvider as StackThemeProvider } from "expo-router";
import { useUniwind } from "uniwind";

export default function AppStack() {
  const { theme } = useUniwind();
  const [background, card, text, border, primary, notification] = useThemeColor([
    "background",
    "card",
    "foreground",
    "border",
    "primary",
    "destructive",
  ]);

  const base = theme === "dark" ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...base,
    colors: { background, card, text, border, primary, notification },
  };

  return (
    <StackThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </StackThemeProvider>
  );
}
