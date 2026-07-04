import { GestureHandlerRootView } from "@/components/tw";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { type EdgeInsets, SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useUniwind();

  const onChange = ({ insets }: { insets: EdgeInsets }) => {
    Uniwind.updateInsets(insets);
  };

  return (
    <>
      <StatusBar style={theme === "dark" ? "dark" : "light"} />
      <KeyboardProvider>
        <GestureHandlerRootView className="flex-1">
          <SafeAreaListener onChange={onChange}>{children}</SafeAreaListener>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </>
  );
}
