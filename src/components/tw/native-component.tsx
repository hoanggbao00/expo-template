import { Image as RNImage } from "expo-image";
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";
import { Pressable as RNGHPressable } from "react-native-gesture-handler";

import { withUniwind } from "uniwind";

const RNPressableComponent = withUniwind(RNPressable);
const RNGHPressableComponent = withUniwind(RNGHPressable);

type RNPressableProps = React.ComponentProps<typeof RNPressableComponent>;
type RNGHPressableProps = React.ComponentProps<typeof RNGHPressableComponent>;

type PressableProps = ({ isRNGH?: false } & RNPressableProps) | ({ isRNGH: true } & RNGHPressableProps);

export function Pressable(props: PressableProps) {
  if (props.isRNGH) {
    const { isRNGH: _, ...rest } = props;
    return <RNGHPressableComponent {...rest} />;
  }

  const { isRNGH: _, ...rest } = props;
  return <RNPressableComponent {...rest} />;
}
Pressable.displayName = "CSS(Pressable)";

export const TextInput = withUniwind(RNTextInput);

export const View = withUniwind(RNView);

export const ScrollView = withUniwind(RNScrollView);

export const Image = (props: React.ComponentProps<typeof RNImage>) =>
  withUniwind(RNImage)({ transition: 200, ...props });
