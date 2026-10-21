import { cn } from "@/lib/utils";
import type { SemanticColor, TextColor } from "@/styles/colors.type";
import { FONT_MAP, type FontWeight } from "@/styles/fonts";
import { nf } from "@/utils/screen-utils";
import type React from "react";
import { Text as RNText } from "react-native-plain-text";
import { withUniwind } from "uniwind";

// biome-ignore format: disable lineWidth format
export type FontSize = 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 28 | 32 | 36 | 40 | 44 | 48 | 52;
export type FontColor = TextColor | SemanticColor | "primary";

type NameWithSWC = `${FontSize}.${FontWeight}.${FontColor}`;
type NameWithSW = `${FontSize}.${FontWeight}`;
type Name = NameWithSWC | NameWithSW;

/** Design line-height: 133.333% (4/3) */
const LINE_HEIGHT_RATIO = 4 / 3;

const DEFAULT_NAME: Name = "14.regular.foreground";

// Static class strings so Tailwind can see them; a className color passed by the caller wins via cn().
const COLOR_CLASS: Record<FontColor, string> = {
  foreground: "text-foreground",
  "card-foreground": "text-card-foreground",
  "muted-foreground": "text-muted-foreground",
  "secondary-foreground": "text-secondary-foreground",
  "accent-foreground": "text-accent-foreground",
  "primary-foreground": "text-primary-foreground",
  primary: "text-primary",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const StyledText = withUniwind(RNText);

interface Props extends React.ComponentProps<typeof StyledText> {
  /**
   * The shorthand for the Text component. (default: "14.regular.foreground")
   */
  name?: Name;
  /**
   * The alignment for the Text component.
   */
  align?: "left" | "center" | "right";
  /**
   * Shorthand for `align="center"`. `align` wins when both are set.
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
   * The color for the Text component. (default: "foreground")
   */
  color?: FontColor;
}

/**
 * ThemedText component.
 * @param {Name} name - The shorthand for the Text component. (default: "14.regular.foreground")
 * @param {"left" | "center" | "right"} align - The alignment for the Text component.
 * @param {boolean} center - Shorthand for `align="center"`.
 * @param {number} size - The size for the Text component. (default: 14) or number in px.
 * @param {FontWeight} weight - The weight for the Text component. (default: "regular")
 * @param {FontColor} color - The color for the Text component. (default: "foreground")
 */
export function Text({
  name = DEFAULT_NAME,
  style: _style,
  className,
  align,
  center,

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
  const colorClass = COLOR_CLASS[colorProp || (fc as FontColor)] ?? COLOR_CLASS.foreground;

  const baseStyle: Props["style"] = {
    fontFamily,
    fontSize: nf(fontSizeNumber),
    lineHeight,
    textAlign: align || (center ? "center" : undefined),
  };

  return <StyledText className={cn(colorClass, className)} style={[baseStyle, _style]} {...props} />;
}
