import type { ExpoConfig } from "expo/config";
import packageJson from "./package.json";

const APP_NAME = "My App";
const APP_SLUG = "my-app";
const APP_BUNDLE_IDENTIFIER = "com.hoanggbao.myapp";
const APP_SCHEME = "myapp"; // For deep linking open app myapp://

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
            inputDir: "./assets/icons",
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
