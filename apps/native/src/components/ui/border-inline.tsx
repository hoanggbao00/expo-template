import { View } from "@/components/tw";
import { useThemeColor } from "@/hooks/use-theme-color";
import { cn } from "@packages/utils/cn";
import type { ThemeColor } from "@/styles/colors.type";
import type React from "react";

interface Props extends React.ComponentProps<typeof View> {
  /**
   * Color of the border
   * @default "border"
   * @type {ThemeColor}
   */
  color?: ThemeColor;
  /**
   * Radius of the border
   * @default 999
   * @type {number}
   */
  radius?: number;
  /**
   * Width of the border
   * @default 1
   * @type {number}
   */
  width?: number;
}

/**
 * BorderInline component with absolute fill
 * @param width - Width of the border (default: 1)
 * @param color - Color of the border (default: "border")
 * @param radius - Radius of the border (default: 999)
 * @returns
 */
export default function BorderInline({
  className,
  style,
  width: borderWidth = 1,
  color = "icon-primary",
  radius: borderRadius = 999,
  ...props
}: Props) {
  const borderColor = useThemeColor(color as ThemeColor) || color;

  const mergedStyle: Props["style"] = [
    {
      borderColor,
      borderRadius,
      borderWidth,
      borderStyle: "solid",
    },
    style,
  ];

  return <View className={cn("absolute inset-0", className)} style={mergedStyle} {...props} />;
}
