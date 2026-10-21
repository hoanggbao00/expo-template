// Native modules have no JS fallback under Jest; back them with in-memory stand-ins.
jest.mock("react-native-mmkv", () => {
  const instances = new Map<string, Map<string, string>>();
  return {
    createMMKV: ({ id }: { id: string }) => {
      const data = instances.get(id) ?? new Map<string, string>();
      instances.set(id, data);
      return {
        set: (key: string, value: string) => data.set(key, value),
        getString: (key: string) => data.get(key),
        remove: (key: string) => data.delete(key),
      };
    },
  };
});

jest.mock("react-native-keyboard-controller", () => require("react-native-keyboard-controller/jest"));

// Font files resolve through Metro's asset registry, which Jest does not have.
jest.mock("@expo-google-fonts/nunito", () => ({ useFonts: () => [true, null] }));

// Dev tools try to open a socket to the Metro dev server.
jest.mock("@dev-plugins/react-query", () => ({ useReactQueryDevTools: () => undefined }));

// PlainText renders a native view whose content Testing Library cannot query; RN Text keeps text visible.
jest.mock("react-native-plain-text", () => ({ Text: require("react-native").Text }));

// Native-only module: logs a warning on every run without a dev build.
jest.mock("@rbayuokt/expo-adaptive-status-bar", () => ({ AdaptiveStatusBar: { enable: jest.fn() } }));

// Metro compiles global.css into Uniwind's store; Jest maps CSS to an empty module, so register
// the light theme tokens from colors.css directly to keep useCSSVariable resolvable.
const colorsCss: string = require("node:fs").readFileSync(`${__dirname}/../src/styles/colors.css`, "utf8");
const lightBlock = colorsCss.match(/@variant light \{([^}]*)\}/)?.[1] ?? "";
const lightVars = Object.fromEntries(
  [...lightBlock.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value])
);
require("uniwind").Uniwind.updateCSSVariables("light", lightVars);
