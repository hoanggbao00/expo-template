import * as ExpoHaptics from "expo-haptics";

export const Haptics = {
  impact: ExpoHaptics.impactAsync,
  selection: ExpoHaptics.selectionAsync,
  notification: ExpoHaptics.notificationAsync,
  performAndroidHaptics: ExpoHaptics.performAndroidHapticsAsync,
};

export const HapticsType = {
  ImpactFeedbackStyle: ExpoHaptics.ImpactFeedbackStyle,
  AndroidHaptics: ExpoHaptics.AndroidHaptics,
  NotificationFeedbackType: ExpoHaptics.NotificationFeedbackType,
};
