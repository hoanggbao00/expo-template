import { View } from "@/components/tw";
import { cn } from "@packages/utils/cn";
import { Gradient } from "@/styles/gradients";

interface Props extends React.ComponentProps<typeof View> {
  gradient?: string;
}

/**
 *
 * @param gradient - The gradient for the gradient fill. (default: Gradient.primary)
 * @returns
 */
export default function GradientFill({
  className,
  gradient: experimental_backgroundImage = Gradient.primary,
  style,
  ...props
}: Props) {
  const mergedStyle: Props["style"] = [{ experimental_backgroundImage }, style];

  return <View className={cn("absolute inset-0", className)} style={mergedStyle} {...props} />;
}
