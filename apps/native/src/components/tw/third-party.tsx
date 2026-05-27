import { GestureHandlerRootView as RNGestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAvoidingView as RNKeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const SafeAreaView = (props: React.ComponentProps<typeof RNSSafeAreaView>) => {
  return withUniwind(RNSSafeAreaView)(props);
};
SafeAreaView.displayName = "CSS(SafeAreaView)";

export const KeyboardAvoidingView = (props: React.ComponentProps<typeof RNKeyboardAvoidingView>) => {
  return withUniwind(RNKeyboardAvoidingView)(props);
};
KeyboardAvoidingView.displayName = "CSS(KeyboardAvoidingView)";

export const GestureHandlerRootView = (props: React.ComponentProps<typeof RNGestureHandlerRootView>) => {
  return withUniwind(RNGestureHandlerRootView)(props);
};
GestureHandlerRootView.displayName = "CSS(GestureHandlerRootView)";
