import { View } from "@/components/tw";
import { cn } from "@/lib/utils";
import { Gradient } from "@/styles/gradients";

interface Props extends React.ComponentProps<typeof View> {
  radius?: number;
  gradient?: string;
}

/**
 *
 * @param radius - The radius for the gradient fill. (default: 999)
 * @param gradient - The gradient for the gradient fill. (default: Gradient.primary)
 * @returns
 */
export default function GradientFill({
  className,
  radius: borderRadius,
  gradient: experimental_backgroundImage = Gradient.primary,
  style,
  ...props
}: Props) {
  const mergedStyle: Props["style"] = [{ experimental_backgroundImage, borderRadius }, style];

  return <View className={cn("absolute inset-0", className)} style={mergedStyle} {...props} />;
}
