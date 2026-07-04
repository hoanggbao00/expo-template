import { type NanoIconName, NanoIcons } from "@/components/nano-icons";
import { cn } from "@/lib/utils";
import { wpx } from "@/utils";
import type { ViewStyle } from "react-native";
import { withUniwind } from "uniwind";

export interface IconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  name: NanoIconName;
  className?: string;
  useIconColor?: boolean;
}

function IconImpl({ name, ...props }: IconProps) {
  return <NanoIcons name={name} {...props} />;
}

const StyledIcon = withUniwind(IconImpl, {
  color: {
    fromClassName: "className",
    styleProperty: "color",
  },
});

/**
 * A wrapper component for Lucide icons with Uniwind `className` support via `withUniwind`.
 *
 * This component allows you to render any Lucide icon while applying utility classes
 * using `uniwind`. It avoids the need to wrap or configure each icon individually.
 *
 * @component
 * @example
 * ```tsx
 * import { Icon } from '@/components/tw/icon';
 *
 * <Icon name="menu-2" className="text-red-500" size={wpx(24)} />
 * ```
 *
 * @param {string} className - Utility classes to style the icon using Uniwind. (default: "text-icon-primary")
 * @param {number} size - Icon size (overrides the size class). (default: wpx(24))
 * @param {NanoIconName} name - Nano icon name.
 * @param {boolean} useIconColor - Whether to use the default color of svg. (default: false)
 * @param {...IIconProps} ...props - Additional icon props passed to the icon.
 */
function Icon({ className, size = wpx(24), useIconColor = false, ...props }: IconProps) {
  const mergedClassName = cn(!useIconColor && "text-icon-primary", className);

  return <StyledIcon className={mergedClassName} size={size} {...props} />;
}

export { Icon };
