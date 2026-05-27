import { Linking, Platform } from "react-native";
import Constants from "expo-constants";

const APP_BUNDLE_IDENTIFIER = Constants.expoConfig?.android?.package ?? "Unknown";

export async function openNotificationSettings() {
  try {
    if (Platform.OS === "android") {
      await Linking.sendIntent("android.settings.APP_NOTIFICATION_SETTINGS", [
        { key: "android.provider.extra.APP_PACKAGE", value: APP_BUNDLE_IDENTIFIER },
      ]);
    } else {
      await Linking.openSettings();
    }
  } catch (_) {
    // Ignore error
  }
}
