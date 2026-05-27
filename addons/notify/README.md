# @addons/notify

A thin wrapper around [`react-native-notify-kit`](https://github.com/marcocrupi/react-native-notify-kit) that provides simplified permission handling, Android channel creation, and Firebase Cloud Messaging (FCM) setup.

## Installation

In the target app (e.g. `apps/native`), add the following to `package.json`:

```json
{
  "dependencies": {
    "@addons/notify": "workspace:*",
    "react-native-notify-kit": "catalog:"
  }
}
```

If you plan to use FCM (`@addons/notify/firebase`), also add:

```json
{
  "dependencies": {
    "@react-native-firebase/app": "catalog:",
    "@react-native-firebase/messaging": "catalog:"
  }
}
```

Then run:

```bash
bun install
```

## Exports

| Import path | Description |
|---|---|
| `@addons/notify` | `requestPermission`, `checkPermission`, `createChannel` |
| `@addons/notify/firebase` | `setupFirebaseFCM` |

---

## Usage

### Request notification permission

```ts
import { requestPermission } from "@addons/notify";

await requestPermission({
  onGranted: () => {
    // permission granted — proceed with notification setup
  },
  onDenied: () => {
    // user denied — show a rationale or skip
  },
  onNeverAskAgain: () => {
    // Android only — user selected "Don't ask again"
    // direct them to app settings
  },
});
```

Handles both platforms:
- **Android 13+** — uses `PermissionsAndroid.request(POST_NOTIFICATIONS)`
- **Android < 13 / iOS** — uses the `react-native-notify-kit` permission API

Returns `true` if granted, `false` otherwise.

---

### Check notification permission

```ts
import { checkPermission } from "@addons/notify";

const isGranted = await checkPermission();
```

Returns `true` if the user has previously granted notification permission.

---

### Create an Android notification channel

```ts
import { createChannel } from "@addons/notify";

await createChannel({
  id: "orders",
  name: "Orders",
  description: "Order status updates",
  importance: "high", // "default" | "high" | "low" | "min" | "none"
  badge: true,
});
```

`importance` accepts a plain string and is mapped internally to `AndroidImportance`. Defaults to `"high"` and `badge: true`.

> Android only — no-op on iOS.

---

### Firebase FCM setup

Call `setupFirebaseFCM` once at the **module level** in `index.js`, before `AppRegistry.registerComponent`. It:

1. Configures FCM with a `default` channel and press action.
2. Creates the `default` Android channel.
3. Registers a background message handler via `@react-native-firebase/messaging`.

```ts
// index.js
import { AppRegistry } from "react-native";
import { setupFirebaseFCM } from "@addons/notify/firebase";
import App from "./App";

setupFirebaseFCM();

AppRegistry.registerComponent("MyApp", () => App);
```

For foreground messages, wire it up inside the app:

```ts
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notify from "react-native-notify-kit";

export default function App() {
  useEffect(() => {
    return messaging().onMessage((m) => notify.handleFcmMessage(m));
  }, []);
}
```

---

## References

- [react-native-notify-kit — GitHub](https://github.com/marcocrupi/react-native-notify-kit)
- [react-native-notify-kit — Docs](https://docs.page/marcocrupi/react-native-notify-kit/react-native/overview)
- [FCM Integration guide](https://docs.page/marcocrupi/react-native-notify-kit/react-native/integrations/fcm)
