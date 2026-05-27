import { APP_VERSION, APP_VERSION_CODE } from "@/app-constants";
import { Text, View } from "@/components/tw";
import { usePreferencesStore } from "@/state/persisted/preferences-store";

export function DevItem() {
  const deviceId = usePreferencesStore((s) => s.preferences.deviceId);
  return (
    <View>
      <Text name="12.regular.text-secondary" center selectable>
        Version: {APP_VERSION} ({APP_VERSION_CODE})
      </Text>
      <Text name="12.regular.text-secondary" center selectable>
        Device ID: {deviceId ?? "Not set"}
      </Text>
    </View>
  );
}
