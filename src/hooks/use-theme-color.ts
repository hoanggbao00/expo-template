import type { ThemeColor } from "@/styles/colors.type";
import { useCSSVariable } from "uniwind";

export function useThemeColor(themeColor: ThemeColor): string;
export function useThemeColor(themeColor: readonly ThemeColor[]): string[];

/**
 * Get the theme color from the CSS variables
 * @param themeColor - The theme color to get
 * @returns The theme color
 * @example
 * const color = useThemeColor("background");
 * const [background, textPrimary] = useThemeColor(["background", "text-primary"]);
 */
export function useThemeColor(themeColor: ThemeColor | readonly ThemeColor[]): string | string[] {
  const isArray = Array.isArray(themeColor);
  const cssVariables = isArray ? themeColor.map((color) => `--${color}`) : [`--${themeColor}`];

  const resolvedColors = useCSSVariable(cssVariables);

  const processedColors: string[] = resolvedColors.map((color) => {
    if (typeof color === "string") {
      return color;
    }
    if (typeof color === "number") {
      return String(color);
    }
    return "invalid";
  });

  if (isArray) {
    return processedColors;
  }
  return processedColors[0];
}
