import { ms } from "@/utils/time";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Dimensions, Platform } from "react-native";

export const MIN_SPLASH_SCREEN_DURATION = ms.Sec(3);
export const MAX_SPLASH_SCREEN_DURATION = ms.Sec(5);

export const IS_IOS = Platform.OS === "ios";
export const IS_ANDROID = Platform.OS === "android";

// App Constants
export const APP_NAME = Constants.expoConfig?.name ?? "Unknown";
// Native value: Android flavors add the `.dev` suffix after the config's fixed package.
export const APP_BUNDLE_IDENTIFIER = Application.applicationId ?? "Unknown";
export const APP_VERSION =
  Platform.select({
    ios: Constants.expoConfig?.ios?.version,
    android: Constants.expoConfig?.android?.version,
  }) ?? "Unknown";
export const APP_VERSION_CODE =
  Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber?.toString(),
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }) ?? "Unknown";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
