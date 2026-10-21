import { Image as RNImage } from "expo-image";
import { Pressable as RNPressable } from "react-native";
import { Pressable as RNGHPressable } from "react-native-gesture-handler";
import { withUniwind } from "uniwind";

const RNGHPressableComponent = withUniwind(RNGHPressable);

type RNPressableProps = React.ComponentProps<typeof RNPressable>;
type RNGHPressableProps = React.ComponentProps<typeof RNGHPressableComponent>;

type PressableProps = ({ isRNGH?: false } & RNPressableProps) | ({ isRNGH: true } & RNGHPressableProps);

export function Pressable(props: PressableProps) {
  if (props.isRNGH) {
    const { isRNGH: _, ...rest } = props;
    return <RNGHPressableComponent {...rest} />;
  }

  const { isRNGH: _, ...rest } = props;
  return <RNPressable {...rest} />;
}
Pressable.displayName = "CSS(Pressable)";

const StyledImage = withUniwind(RNImage);

export function Image(props: React.ComponentProps<typeof StyledImage>) {
  return <StyledImage transition={200} {...props} />;
}
