/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  bundleMode: true,
  strictGlobal: true,
};

module.exports = (api) => {
  api.cache(true);
  return {
    // babel-preset-expo auto-adds react-native-worklets/plugin with default
    // options; disable that so it's only applied once, with bundleMode below.
    presets: [["babel-preset-expo", { worklets: false, reanimated: false }]],
    plugins: [["react-native-worklets/plugin", workletsPluginOptions]],
  };
};
