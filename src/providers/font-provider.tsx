import { NunitoFonts } from "@/styles/fonts";
import { createLogger } from "@/utils/logger";
import { useFonts } from "@expo-google-fonts/nunito";
import { hideAsync as hideSplashScreenAsync } from "expo-splash-screen";
import { useEffect } from "react";

const logger = createLogger("font-provider");

interface FontProviderProps {
  children: React.ReactNode;
}
export default function FontProvider({ children }: FontProviderProps) {
  const [loaded, error] = useFonts(NunitoFonts);
  const ready = loaded || error !== null;

  useEffect(() => {
    if (error) {
      // Do not block the app: fall back to system fonts rather than staying on the splash forever.
      logger.error("Failed to load fonts, using system fallback", error);
    }
  }, [error]);

  useEffect(() => {
    if (ready) hideSplashScreenAsync();
  }, [ready]);

  if (!ready) return null;

  return children;
}
