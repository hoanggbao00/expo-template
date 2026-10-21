import type { ExpoConfig } from "expo/config";
import packageJson from "./package.json";
import { withAndroidFlavors } from "./plugins/with-android-flavors";

// Native identifiers (name/slug/bundle id/scheme) must stay in source, not .env:
// they bake into the native project at prebuild time, so an out-of-sync .env
// would silently diverge from the installed binary. Only APP_VARIANT is env-driven.
const IS_PRODUCTION = process.env.APP_VARIANT === "production";

const BASE_APP_NAME = "My App";
const BASE_APP_SLUG = "my-app";
const BASE_BUNDLE_IDENTIFIER = "com.hoanggbao.myapp";
const BASE_APP_SCHEME = "myapp";

// Dev build gets a distinct name/id/scheme so it can be installed alongside production.
const DEV_APP_NAME = `${BASE_APP_NAME} (Dev)`;
const DEV_ID_SUFFIX = ".dev";
const DEV_APP_SCHEME = `${BASE_APP_SCHEME}-dev`;

const APP_NAME = IS_PRODUCTION ? BASE_APP_NAME : DEV_APP_NAME;
const APP_SLUG = IS_PRODUCTION ? BASE_APP_SLUG : `${BASE_APP_SLUG}-dev`;
const APP_BUNDLE_IDENTIFIER = IS_PRODUCTION ? BASE_BUNDLE_IDENTIFIER : `${BASE_BUNDLE_IDENTIFIER}${DEV_ID_SUFFIX}`;
const APP_SCHEME = IS_PRODUCTION ? BASE_APP_SCHEME : DEV_APP_SCHEME;

// Installed Android applicationId (package + flavor suffix). Read by scripts/run-android.sh.
export const ANDROID_APPLICATION_ID = IS_PRODUCTION
  ? BASE_BUNDLE_IDENTIFIER
  : `${BASE_BUNDLE_IDENTIFIER}${DEV_ID_SUFFIX}`;

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
    // Fixed across variants: the dev/prod split lives in Gradle product flavors
    // (see withAndroidFlavors), so switching variants never re-prebuilds Android.
    package: BASE_BUNDLE_IDENTIFIER,
    versionCode: AndroidVersionCode,
  },
  plugins: [
    [
      "expo-build-properties",
      {
        android: {
          minSdkVersion: 28, // Android 9
          buildArchs: ["arm64-v8a"],
          // Only affects RN <Image>; expo-image ships its own GIF/WebP decoders.
          gifEnabled: false,
          webpEnabled: false,
        },
      },
    ],
    "expo-font",
    "expo-image",
    "expo-router",
    "expo-status-bar",
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

export default withAndroidFlavors(expoConfig, {
  projectName: BASE_APP_NAME,
  flavors: [
    { name: "dev", appName: DEV_APP_NAME, scheme: DEV_APP_SCHEME, applicationIdSuffix: DEV_ID_SUFFIX },
    { name: "prod", appName: BASE_APP_NAME, scheme: BASE_APP_SCHEME },
  ],
});
