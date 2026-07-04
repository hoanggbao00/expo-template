import { GestureHandlerRootView as RNGestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAvoidingView as RNKeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const SafeAreaView = withUniwind(RNSSafeAreaView);

export const KeyboardAvoidingView = withUniwind(RNKeyboardAvoidingView);

export const GestureHandlerRootView = withUniwind(RNGestureHandlerRootView);

export const AnimatedView = withUniwind(Animated.View);
