import type { ViewStyle } from "react-native";
import { wpx } from "@/utils";

export const minWidth = (value: number): ViewStyle => ({
  minWidth: wpx(value),
});

export const minHeight = (value: number): ViewStyle => ({
  minHeight: wpx(value),
});

export const maxWidth = (value: number): ViewStyle => ({
  maxWidth: wpx(value),
});

export const maxHeight = (value: number): ViewStyle => ({
  maxHeight: wpx(value),
});

export const height = (value: number): ViewStyle => ({
  height: wpx(value),
});

export const width = (value: number): ViewStyle => ({
  width: wpx(value),
});

export const size = (width: number, height?: number): ViewStyle => ({
  width: wpx(width),
  height: wpx(height ?? width),
});

export const aspect = (ratio: number): ViewStyle => ({
  aspectRatio: ratio,
});
