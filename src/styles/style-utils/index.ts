/**
 * CSS Utils for React Native
 * @module styles
 * @description CSS Utils for React Native with unit converted with wpx()
 */

import { wpx } from "@/utils";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

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
  // Inputs are flat style objects, so a shallow merge matches StyleSheet.flatten.
  // RN 0.88's flatten typing rejects Expo's web `userSelect?: string` augmentation.
  return Object.assign({}, ...styles.filter(Boolean));
}

// UTILS
export const gap = (value: number): ViewStyle => ({
  gap: wpx(value),
});

export * from "./sizing";
export * from "./margin";
export * from "./padding";
export * from "./rounded";
