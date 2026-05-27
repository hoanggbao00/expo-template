import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { Alert } from "react-native";

interface FontProviderProps {
  children: React.ReactNode;
}
export default function FontProvider({ children }: FontProviderProps) {
  const [loaded, error] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    Montserrat_500Medium,
    Montserrat_400Regular,
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
