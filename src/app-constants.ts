import { ms } from "@/utils/time";
import Constants from "expo-constants";
import { Dimensions, Platform } from "react-native";

export const MIN_SPLASH_SCREEN_DURATION = ms.Sec(3);
export const MAX_SPLASH_SCREEN_DURATION = ms.Sec(5);

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";

// App Constants
export const APP_NAME = Constants.expoConfig?.name ?? "Unknown";
export const APP_BUNDLE_IDENTIFIER = Constants.expoConfig?.android?.package ?? "Unknown";
export const APP_VERSION = Constants.expoConfig?.version ?? "Unknown";
export const APP_VERSION_CODE = Constants.expoConfig?.android?.versionCode ?? "Unknown";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
