import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { Alert } from "react-native";

interface FontProviderProps {
  children: React.ReactNode;
}
export default function FontProvider({ children }: FontProviderProps) {
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("❌ Error loading fonts", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) hideSplashScreenAsync();
  }, [loaded]);

  if (!loaded) return null;

  return children;
}
