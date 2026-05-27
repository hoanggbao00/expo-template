import notify, { type AndroidChannel, AndroidImportance as AndroidImportanceEnum } from "react-native-notify-kit";
import { devLog } from "@packages/utils";

export const AndroidImportance = AndroidImportanceEnum;

const IMPORTANCE_MAP = {
  default: AndroidImportance.DEFAULT,
  high: AndroidImportance.HIGH,
  low: AndroidImportance.LOW,
  min: AndroidImportance.MIN,
  none: AndroidImportance.NONE,
};

type CreateChannelOptions = Omit<AndroidChannel, "importance"> & {
  importance?: "default" | "high" | "low" | "min" | "none";
};

/**
 * Create a android channel
 * @platform android
 */
export async function createNotificationChannel(options: CreateChannelOptions) {
  const { id, name, importance = "default", badge = true, ...rest } = options ?? {};

  try {
    await notify.createChannel({
      id,
      name,
      importance: IMPORTANCE_MAP[importance],
      badge,
      ...rest,
    });
    devLog.success(`[@addons/notify] Created ${importance.toUpperCase()} notification channel: ${id}`);
  } catch (error) {
    devLog.error(`[@addons/notify] Failed to create ${importance.toUpperCase()} notification channel: ${id}`, error);
  }
}
