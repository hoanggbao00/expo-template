import SettingScreen from "@/screens/(main)/setting";
import { Stack } from "expo-router";

export default function Setting() {
  return (
    <>
      <Stack.Screen options={{ animation: "slide_from_left" }} />
      <SettingScreen />
    </>
  );
}
