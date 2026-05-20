import { Icon, type IconProps } from "@/components/tw";
import { wpx } from "@/utils";
import { EaseView } from "react-native-ease/uniwind";

interface Props extends Omit<IconProps, "name"> {
  duration?: number;
  className?: string;
}

export function Spinner({ style = {}, size = wpx(24), duration = 1000, className, ...props }: Props) {
  const mergedStyle = [
    style,
    {
      width: size,
      height: size,
    },
  ];

  return (
    <EaseView
      initialAnimate={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        type: "timing",
        duration,
        easing: "linear",
        loop: "repeat",
      }}
      className={className}
      style={mergedStyle}
    >
      <Icon name="loader" className={className} style={style} size={size} {...props} />
    </EaseView>
  );
}
