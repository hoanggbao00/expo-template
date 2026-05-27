import { createNotificationChannel, notify } from "@addons/notify";
import { devLog } from "@packages/utils";
import firebaseMessaging from "@react-native-firebase/messaging";

// See: https://docs.page/marcocrupi/react-native-notify-kit/react-native/integrations/fcm
// Limited: Sound not configured: https://docs.page/marcocrupi/react-native-notify-kit/react-native/android/behaviour#device-sound

export const handleBackgroundMessage = () => {
  notify.setFcmConfig({
    defaultChannelId: "default",
    defaultPressAction: { id: "default", launchActivity: "default" },
  });

  createNotificationChannel({
    id: "default",
    name: "Default",
    importance: "high",
    vibration: true,
    vibrationPattern: [300, 500],
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    await notify.handleFcmMessage({
      data: remoteMessage.data as Record<string, string>,
    });
  });

  devLog.success("[@addons/firebase/messaging] Background message handler initialized");
};

export const messaging = () => firebaseMessaging();
