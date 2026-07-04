// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const { getBundleModeMetroConfig } = require("react-native-worklets/bundleMode");

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

config = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: "./global.css",
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: "./uniwind-types.d.ts",
});

// Must run last: wraps resolver/serializer/transformer so worklets can
// access the full bundle (https://docs.swmansion.com/react-native-worklets/docs/bundleMode)
config = getBundleModeMetroConfig(config);

module.exports = config;
