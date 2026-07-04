import type { ViewStyle } from "react-native";
import { wpx } from "@/utils";

/**
 * Margin
 */
export const m = (value: number): ViewStyle => ({
  margin: wpx(value),
});

/**
 * Margin Horizontal
 */
export const mx = (value: number): ViewStyle => ({
  marginHorizontal: wpx(value),
});

/**
 * Margin Vertical
 */
export const my = (value: number): ViewStyle => ({
  marginVertical: wpx(value),
});

/**
 * Margin Top
 */
export const mt = (value: number): ViewStyle => ({
  marginTop: wpx(value),
});

/**
 * Margin Bottom
 */
export const mb = (value: number): ViewStyle => ({
  marginBottom: wpx(value),
});

/**
 * Margin Left
 */
export const ml = (value: number): ViewStyle => ({
  marginLeft: wpx(value),
});

/**
 * Margin Right
 */
export const mr = (value: number): ViewStyle => ({
  marginRight: wpx(value),
});
