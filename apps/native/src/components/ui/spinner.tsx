import { Icon, type IconProps } from "@/components/tw";
import { EaseView } from "react-native-ease";

interface Props extends Omit<IconProps, "name"> {
  duration?: number;
}

export function Spinner({ style, size, duration = 1000, ...props }: Props) {
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
      style={[
        style,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Icon name="loader" style={style} size={size} {...props} />
    </EaseView>
  );
}
