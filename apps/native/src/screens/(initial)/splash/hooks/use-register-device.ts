import { getPreferences, usePreferencesStore } from "@/state/persisted/preferences-store";
import { devLog } from "@packages/utils";
import { getDeviceId } from "@/utils/get-device-id";
import { useEffect, useState } from "react";

export const useRegisterDevice = () => {
  const isStoreHydrated = usePreferencesStore((state) => state._isHydrated);
  const isOnboarded = usePreferencesStore((state) => state.preferences.isOnboarded);
  const setPreferences = usePreferencesStore((state) => state.setPreferences);
  const [isRegistered, setIsRegistered] = useState(getPreferences().isRegistered);

  const setInitialDeviceId = async () => {
    let deviceId = getPreferences().deviceId;
    if (!deviceId) {
      deviceId = await getDeviceId();
      if (deviceId) setPreferences({ deviceId });
    }

    if (deviceId && !isRegistered) return registerAPI(deviceId);

    devLog.error("❌ Failed to register device ID");
  };

  // TODO: Implement API registration
  const registerAPI = (deviceId: string) => {
    devLog.info(`ℹ️ [Splash]: Registered device ID: ${deviceId}`);
    setIsRegistered(true);
  };

  useEffect(() => {
    if (isStoreHydrated) {
      setInitialDeviceId();
    }
  }, [isStoreHydrated]);

  return { isRegistered, isStoreHydrated, isOnboarded };
};
