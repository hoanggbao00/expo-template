import type { ExpoConfig } from "expo/config";
import packageJson from "./package.json";

const APP_NAME = "My App";
const APP_SLUG = "my-app";
const APP_BUNDLE_IDENTIFIER = "com.hoanggbao.myapp";
const APP_SCHEME = "myapp"; // For deep linking open app myapp://

const VERSION_CODE = packageJson.versionCode || 1;
const VERSION_NAME = packageJson.version || "1.0.0";

const config: ExpoConfig = {
  name: APP_NAME,
  slug: APP_SLUG,
  version: VERSION_NAME,
  orientation: "portrait",
  icon: "./assets/app-icon/icon.png",
  scheme: APP_SCHEME,
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/app-icon/expo.icon",
    supportsTablet: true,
    bundleIdentifier: APP_BUNDLE_IDENTIFIER,
    infoPlist: {
      UIDesignRequiresCompatibility: true,
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/app-icon/android-icon-foreground.png",
      backgroundImage: "./assets/app-icon/android-icon-background.png",
      monochromeImage: "./assets/app-icon/android-icon-monochrome.png",
    },
    // googleServicesFile: "./google-services.json",
    predictiveBackGestureEnabled: false,
    package: APP_BUNDLE_IDENTIFIER,
    versionCode: VERSION_CODE,
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
          minSdkVersion: 24,
          buildArchs: ["arm64-v8a", "x86_64"],
        },
      },
    ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        android: {
          image: "./assets/app-icon/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    "expo-localization",
    "expo-font",
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

export default config;
