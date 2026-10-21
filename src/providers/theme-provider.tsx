import { useThemeColor } from "@/hooks/use-theme-color";
import { setBackgroundColorAsync } from "expo-system-ui";
import { PanelUIProvider } from "panelui-native/provider";
import { useEffect } from "react";
import { type EdgeInsets, SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
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
      <SafeAreaListener onChange={onChange}>{children}</SafeAreaListener>
    </PanelUIProvider>
  );
}
