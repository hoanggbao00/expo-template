import { Image as RNImage } from "expo-image";
import { Link as RouterLink } from "expo-router";
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";

import { withUniwind } from "uniwind";

export const Pressable = (props: React.ComponentProps<typeof RNPressable>) => {
  return withUniwind(RNPressable)(props);
};

Pressable.displayName = "CSS(Pressable)";

export const Link = (props: React.ComponentProps<typeof RouterLink>) => {
  return withUniwind(RouterLink)(props);
};
Link.displayName = "CSS(Link)";

export const TextInput = (props: React.ComponentProps<typeof RNTextInput>) => {
  return withUniwind(RNTextInput)(props);
};
TextInput.displayName = "CSS(TextInput)";

export const View = (props: React.ComponentProps<typeof RNView>) => {
  return withUniwind(RNView)(props);
};
View.displayName = "CSS(View)";

export const ScrollView = (props: React.ComponentProps<typeof RNScrollView>) => {
  return withUniwind(RNScrollView)(props);
};
ScrollView.displayName = "CSS(ScrollView)";

export const Image = (props: React.ComponentProps<typeof RNImage>) => {
  return withUniwind(RNImage)(props);
};
Image.displayName = "CSS(Image)";
