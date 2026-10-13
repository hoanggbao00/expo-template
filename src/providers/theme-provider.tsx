import { useThemeColor } from "@/hooks/use-theme-color";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { PanelUIProvider } from "panelui-native/provider";
import { useEffect } from "react";
import { type EdgeInsets, SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useUniwind();
  const background = useThemeColor("background");

  useEffect(() => {
    setBackgroundColorAsync(background);
  }, [background]);

  const onChange = ({ insets }: { insets: EdgeInsets }) => {
    Uniwind.updateInsets(insets);
  };

  // PanelUIProvider owns GestureHandlerRootView, KeyboardProvider, portals, and the themed background.
  return (
    <PanelUIProvider>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <SafeAreaListener onChange={onChange}>{children}</SafeAreaListener>
    </PanelUIProvider>
  );
}
