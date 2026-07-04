import { updatePreferences, usePreferencesStore } from "@/state/persisted";
import { devLog } from "@/utils/dev-log";
import { getDeviceId } from "@/utils/get-device-id";
import { useEffect, useRef } from "react";

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

    devLog.success(`[Device ID]: Device ID initialized: ${newDeviceId}`);
  };

  useEffect(() => {
    if (isHydrated) {
      initDeviceId();
    }
  }, [isHydrated]);
};
