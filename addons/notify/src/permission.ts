import { PermissionsAndroid, Platform } from "react-native";
import notify, { AuthorizationStatus } from "react-native-notify-kit";

const POST_NOTIFICATIONS = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

const RESULT = PermissionsAndroid.RESULTS;

interface CallBack {
  onGranted?: () => void | Promise<void>;
  onDenied?: () => void | Promise<void>;
  onNeverAskAgain?: () => void | Promise<void>;
}

/**
 * Request permission to send notifications
 * @param callback - The callback to call when the permission is granted, denied, or never ask again
 * @example
 * requestPermission({
 *   onGranted: () => {
 *     console.log("Permission granted");
 *   },
 *   onDenied: () => {
 *     console.log("Permission denied");
 *   },
 *   onNeverAskAgain: () => {
 *     console.log("Permission never ask again");
 *   },
 * });
 * @returns true if permission is granted, false otherwise
 */
export async function requestPermission(callback: CallBack) {
  // For Android 13+
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(POST_NOTIFICATIONS);

    if (result === RESULT.NEVER_ASK_AGAIN) {
      await callback.onNeverAskAgain?.();
      return false;
    }

    if (result === RESULT.GRANTED) {
      await callback.onGranted?.();
      return true;
    }

    if (result === RESULT.DENIED) {
      await callback.onDenied?.();
      return false;
    }
  }

  // for IOS or Android < 13
  const { authorizationStatus: status } = await notify.requestPermission();
  if (status === AuthorizationStatus.DENIED) {
    await callback.onDenied?.();
    return false;
  }

  if (status === AuthorizationStatus.AUTHORIZED) {
    await callback.onGranted?.();
    return true;
  }
}

export async function checkPermission() {
  const { authorizationStatus: status } = await notify.getNotificationSettings();
  if (status === AuthorizationStatus.AUTHORIZED) {
    return true;
  }
  return false;
}
