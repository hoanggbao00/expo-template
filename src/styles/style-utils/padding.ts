import type { ViewStyle } from "react-native";
import { wpx } from "@/utils";

/**
 * Padding Horizontal
 */
export const px = (value: number): ViewStyle => ({
  paddingHorizontal: wpx(value),
});

/**
 * Padding Vertical
 */
export const py = (value: number): ViewStyle => ({
  paddingVertical: wpx(value),
});

export const p = (value: number): ViewStyle => ({
  padding: wpx(value),
});

export const pt = (value: number): ViewStyle => ({
  paddingTop: wpx(value),
});

export const pb = (value: number): ViewStyle => ({
  paddingBottom: wpx(value),
});

export const pl = (value: number): ViewStyle => ({
  paddingLeft: wpx(value),
});

export const pr = (value: number): ViewStyle => ({
  paddingRight: wpx(value),
});
