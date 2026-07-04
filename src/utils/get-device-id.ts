import { IS_ANDROID, IS_IOS } from "@/app-constants";
import { getPreferences } from "@/state/persisted";
import { getAndroidId, getIosIdForVendorAsync } from "expo-application";

export const getDeviceId = async (): Promise<string | undefined> => {
  let deviceId = getPreferences()?.deviceId;
  if (deviceId) return deviceId;

  if (IS_ANDROID) deviceId = getAndroidId();
  if (IS_IOS) {
    const iosDeviceId = await getIosIdForVendorAsync();
    if (iosDeviceId) deviceId = iosDeviceId;
  }

  return deviceId ?? undefined;
};
