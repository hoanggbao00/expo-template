/**
 * CSS Utils for React Native
 * @module styles
 * @description CSS Utils for React Native with unit converted with wpx()
 */

import { wpx } from "@/utils";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

export type ModifierStyle = ViewStyle | TextStyle | ImageStyle;
type FalsyModifierStyle = false | null | undefined;
export type ModifierInput = ModifierStyle | FalsyModifierStyle;

/**
 * Merge style fragments into one object for RN `style` props.
 *
 * @example
 * style={modifier([
 *   size(48),
 *   px(12),
 *   isActive && { borderWidth: 1.5 },
 * ])}
 */
export function modifier<const T extends readonly (ViewStyle | FalsyModifierStyle)[]>(styles: T): ViewStyle {
  return (StyleSheet.flatten(styles.filter(Boolean)) ?? {}) as ViewStyle;
}

// UTILS
export const gap = (value: number): ViewStyle => ({
  gap: wpx(value),
});

export * from "./sizing";
export * from "./margin";
export * from "./padding";
export * from "./rounded";
