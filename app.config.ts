import type { ExpoConfig } from "expo/config";
import packageJson from "./package.json";

const APP_VARIANT = process.env.APP_VARIANT === "production" ? "production" : "development";
const IS_PRODUCTION = APP_VARIANT === "production";

const BASE_APP_NAME = "My App";
const BASE_APP_SLUG = "my-app";
const BASE_BUNDLE_IDENTIFIER = "com.hoanggbao.myapp";
const BASE_APP_SCHEME = "myapp";

const APP_NAME = IS_PRODUCTION ? BASE_APP_NAME : `${BASE_APP_NAME} (Dev)`;
const APP_SLUG = IS_PRODUCTION ? BASE_APP_SLUG : `${BASE_APP_SLUG}-dev`;
const APP_BUNDLE_IDENTIFIER = IS_PRODUCTION ? BASE_BUNDLE_IDENTIFIER : `${BASE_BUNDLE_IDENTIFIER}.dev`;
const APP_SCHEME = IS_PRODUCTION ? BASE_APP_SCHEME : `${BASE_APP_SCHEME}-dev`;

const AndroidVersionCode = packageJson.androidVersionCode || 1;
const AndroidVersion = packageJson.androidVersion || "1.0.0";
const IosVersion = packageJson.iosVersion || "1.0.0";
const IosBuildNumber = packageJson.iosBuildNumber || 1;

const expoConfig: ExpoConfig = {
  name: APP_NAME,
  slug: APP_SLUG,
  version: AndroidVersion,
  orientation: "portrait",
  icon: "./assets/icon-app/icon.png",
  scheme: APP_SCHEME,
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    version: IosVersion,
    buildNumber: String(IosBuildNumber),
    supportsTablet: true,
    requireFullScreen: true, // The ui will be broken, didn't test it yet
    bundleIdentifier: APP_BUNDLE_IDENTIFIER,
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      CFBundleDisplayName: APP_NAME,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/icon-app/android-icon-foreground.png",
      backgroundImage: "./assets/icon-app/android-icon-background.png",
      monochromeImage: "./assets/icon-app/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: APP_BUNDLE_IDENTIFIER,
    versionCode: AndroidVersionCode,
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          buildToolsVersion: "36.0.0",
          kotlinVersion: "2.2.0",
          compileSdkVersion: 36,
          targetSdkVersion: 36,
          minSdkVersion: 28, // Android 9
          buildArchs: ["arm64-v8a"],
          // R8: smaller release builds; may crash if rules are wrong — retest APK after each build.
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
        },
      },
    ],
    "expo-font",
    "expo-image",
    "expo-localization",
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/icon-app/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    [
      // https://github.com/software-mansion-labs/react-native-nano-icons
      "react-native-nano-icons",
      {
        iconSets: [
          {
            inputDir: "./assets/icons/common",
            outputDir: "./assets/icons/output",
          },
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default expoConfig;
