import { NunitoFonts } from "@/styles/fonts";
import { useFonts } from "@expo-google-fonts/nunito";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { Alert } from "react-native";

interface FontProviderProps {
  children: React.ReactNode;
}
export default function FontProvider({ children }: FontProviderProps) {
  const [loaded, error] = useFonts(NunitoFonts);

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
