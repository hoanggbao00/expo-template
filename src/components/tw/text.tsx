import { useThemeColor } from "@/hooks/use-theme-color";
import type { ThemeColor } from "@/styles/colors.type";
import { FONT_MAP, type FontWeight } from "@/styles/fonts";
import { nf } from "@/utils/screen-utils";
import type React from "react";
import { Text as RNText } from "react-native";
import { withUniwind } from "uniwind";

// biome-ignore format: disable lineWidth format
export type FontSize = 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52;
export type FontColor = ThemeColor;

type NameWithSWC = `${FontSize}.${FontWeight}.${FontColor}`;
type NameWithSW = `${FontSize}.${FontWeight}`;
type Name = NameWithSWC | NameWithSW;

/** Design line-height: 133.333% (4/3) */
const LINE_HEIGHT_RATIO = 4 / 3;

const DEFAULT_NAME: Name = "14.regular.text-primary";
interface Props extends React.ComponentProps<typeof RNText> {
  /**
   * The shorthand for the Text component. (default: "14.regular.text-primary")
   */
  name?: Name;
  /**
   * The alignment for the Text component. (default: "center")
   */
  align?: "left" | "center" | "right";
  /**
   * The center alignment for the Text component. (default: false)
   */
  center?: boolean;

  /**
   * The size for the Text component. (default: 14) or number in px.
   */
  size?: number;
  /**
   * The weight for the Text component. (default: "regular")
   */
  weight?: FontWeight;
  /**
   * The color for the Text component. (default: "text-primary")
   */
  color?: FontColor;
}

/**
 * ThemedText component.
 * @param {Name} name - The shorthand for the Text component. (default: "14.regular.text-primary")
 * @param {"left" | "center" | "right"} align - The alignment for the Text component. (default: "left")
 * @param {boolean} center - The center alignment for the Text component.
 * @param {number} size - The size for the Text component. (default: 14) or number in px.
 * @param {FontWeight} weight - The weight for the Text component. (default: "regular")
 * @param {FontColor} color - The color for the Text component. (default: "text-primary")
 */
export function Text({
  name = DEFAULT_NAME,
  style: _style,
  align,
  center = false,

  // Custom more
  size,
  weight,
  color: colorProp,
  ...props
}: Props) {
  const [fs, fw, fc] = name.split(".");
  const fontSizeNumber = size ?? Number.parseInt(fs, 10);
  const fontFamily = FONT_MAP[weight || (fw as FontWeight)] || FONT_MAP.regular;
  const lineHeight = nf(fontSizeNumber) * LINE_HEIGHT_RATIO;
  const color = useThemeColor(colorProp || (fc as ThemeColor) || "text-primary");

  const baseStyle: Props["style"] = {
    fontFamily,
    fontSize: nf(fontSizeNumber),
    lineHeight,
    color,
    textAlign: align || (center ? "center" : undefined),
  };

  const mergedStyle = [baseStyle, _style];

  return withUniwind(RNText)({ style: mergedStyle, ...props });
}
