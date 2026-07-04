/* Should sync with src/styles/fonts.css */

import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from "@expo-google-fonts/nunito";

export type FontWeight = "bold" | "semibold" | "medium" | "regular";

export const NunitoFonts = {
  Nunito_700Bold,
  Nunito_600SemiBold,
  Nunito_500Medium,
  Nunito_400Regular,
} as const;

export type NunitoFont = keyof typeof NunitoFonts;

export const FONT_MAP: Record<FontWeight, NunitoFont> = {
  bold: "Nunito_700Bold",
  semibold: "Nunito_600SemiBold",
  medium: "Nunito_500Medium",
  regular: "Nunito_400Regular",
};
