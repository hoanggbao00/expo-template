import type { ViewStyle } from "react-native";
import { wpx } from "@/utils";

export const rounded = (value?: number): ViewStyle => ({
  borderRadius: value ? wpx(value) : 999,
});

export const roundedTop = (value: number): ViewStyle => ({
  borderTopLeftRadius: value ? wpx(value) : 999,
  borderTopRightRadius: value ? wpx(value) : 999,
});

export const roundedBottom = (value: number): ViewStyle => ({
  borderBottomLeftRadius: value ? wpx(value) : 999,
  borderBottomRightRadius: value ? wpx(value) : 999,
});

export const roundedLeft = (value: number): ViewStyle => ({
  borderTopLeftRadius: value ? wpx(value) : 999,
  borderBottomLeftRadius: value ? wpx(value) : 999,
});

export const roundedRight = (value: number): ViewStyle => ({
  borderTopRightRadius: value ? wpx(value) : 999,
  borderBottomRightRadius: value ? wpx(value) : 999,
});

export const roundedTopLeft = (value: number): ViewStyle => ({
  borderTopLeftRadius: value ? wpx(value) : 999,
});

export const roundedTopRight = (value: number): ViewStyle => ({
  borderTopRightRadius: value ? wpx(value) : 999,
});

export const roundedBottomLeft = (value: number): ViewStyle => ({
  borderBottomLeftRadius: value ? wpx(value) : 999,
});
