import { useThemeColor } from "@/hooks/use-theme-color";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { ToasterNative } from "@packages/ui-kit/toast-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { type EdgeInsets, SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const colorBackgroundSecondary = useThemeColor("background-secondary");
  const { theme } = useUniwind();

  const onChange = ({ insets }: { insets: EdgeInsets }) => {
    Uniwind.updateInsets(insets);
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colorBackgroundSecondary);
  }, [colorBackgroundSecondary]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <KeyboardProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaListener onChange={onChange}>{children}</SafeAreaListener>
          <ToasterNative theme={theme === "dark" ? "dark" : "light"} />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </>
  );
}
