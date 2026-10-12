declare global {
  type AppRoute = import("expo-router").Href;

  var fetch: typeof import("react-native-nitro-fetch").fetch;
  var Headers: typeof import("react-native-nitro-fetch").Headers;
  var Request: typeof import("react-native-nitro-fetch").Request;
  var Response: typeof import("react-native-nitro-fetch").Response;
}

export {};
