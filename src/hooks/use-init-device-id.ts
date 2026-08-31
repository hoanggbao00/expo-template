import { updatePreferences, usePreferencesStore } from "@/state/persisted";
import { createLogger } from "@/utils/logger";
import { getDeviceId } from "@/utils/get-device-id";
import { useEffect, useRef } from "react";

const logger = createLogger("useInitDeviceId");

export const useInitDeviceId = () => {
  const deviceId = usePreferencesStore((state) => state.preferences.deviceId);
  const isHydrated = usePreferencesStore((state) => state._isHydrated);
  const isInitialized = useRef(false);

  const initDeviceId = async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    let newDeviceId = deviceId;
    if (!newDeviceId) {
      const deviceId = await getDeviceId();
      if (deviceId) newDeviceId = deviceId;
      if (newDeviceId) updatePreferences({ deviceId: newDeviceId });
    }

    logger.success(`Device ID initialized: ${newDeviceId}`);
  };

  useEffect(() => {
    if (isHydrated) {
      initDeviceId();
    }
  }, [isHydrated]);
};
