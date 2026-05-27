import { useThemeColor } from "@/hooks/use-theme-color";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function AppTabs() {
  const [colorBackground, colorText] = useThemeColor(["background-secondary", "text-primary"]);

  return (
    <NativeTabs
      backgroundColor={colorBackground}
      indicatorColor={colorText}
      labelStyle={{ selected: { color: colorText } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require("@/assets/images/tabIcons/home.png")} renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={require("@/assets/images/tabIcons/explore.png")} renderingMode="template" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
