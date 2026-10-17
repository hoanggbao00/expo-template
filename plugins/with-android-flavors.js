// CommonJS on purpose: Expo transpiles app.config.ts itself, but not the files it imports.
const fs = require("node:fs");
const path = require("node:path");
const {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withSettingsGradle,
  withStringsXml,
} = require("expo/config-plugins");

/**
 * @typedef {object} AndroidFlavor
 * @property {string} name Gradle flavor name, e.g. `dev` -> `assembleDevRelease`.
 * @property {string} appName Launcher name.
 * @property {string} scheme Deep link scheme.
 * @property {string} [applicationIdSuffix]
 */

/**
 * @typedef {object} AndroidFlavorsProps
 * @property {string} projectName Name for flavor-independent outputs (Gradle project, main `app_name`).
 * @property {AndroidFlavor[]} flavors
 */

/** @typedef {import("expo/config-plugins").ConfigPlugin<AndroidFlavorsProps>} FlavorsPlugin */

const MARKER = "// @generated with-android-flavors";
// biome-ignore lint/suspicious/noTemplateCurlyInString: Gradle manifest placeholder, not JS.
const SCHEME_PLACEHOLDER = "${appScheme}";
const PACKAGING_OPTIONS_REGEX = /^(\s*)packagingOptions \{/m;
const ROOT_PROJECT_NAME_REGEX = /^rootProject\.name = .*$/m;
const SINGLE_QUOTE_REGEX = /'/g;
const XML_ESCAPES = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
];

/** @param {AndroidFlavor[]} flavors */
function renderFlavors(flavors) {
  const blocks = flavors.map((flavor) => {
    const suffix = flavor.applicationIdSuffix
      ? `\n            applicationIdSuffix "${flavor.applicationIdSuffix}"`
      : "";
    return `        ${flavor.name} {
            dimension "variant"${suffix}
            manifestPlaceholders = [appScheme: "${flavor.scheme}"]
        }`;
  });
  return `    ${MARKER}
    flavorDimensions "variant"
    productFlavors {
${blocks.join("\n")}
    }
`;
}

/** @param {string} value */
function escapeXml(value) {
  return XML_ESCAPES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

/** @type {FlavorsPlugin} */
const withFlavorsGradle = (config, { flavors }) =>
  withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes(MARKER)) {
      cfg.modResults.contents = cfg.modResults.contents.replace(
        PACKAGING_OPTIONS_REGEX,
        (match) => `${renderFlavors(flavors)}${match}`
      );
    }
    return cfg;
  });

/**
 * Collapse the app's scheme `<data>` entries into one flavor-provided placeholder.
 * @type {FlavorsPlugin}
 */
const withFlavorScheme = (config, { flavors }) =>
  withAndroidManifest(config, (cfg) => {
    const schemes = new Set(flavors.map((flavor) => flavor.scheme));
    for (const activity of cfg.modResults.manifest.application?.[0]?.activity ?? []) {
      for (const filter of activity["intent-filter"] ?? []) {
        const data = filter.data;
        if (!data) {
          continue;
        }
        const kept = data.filter((item) => {
          const scheme = item.$["android:scheme"];
          return !(scheme && (schemes.has(scheme) || scheme === SCHEME_PLACEHOLDER));
        });
        if (kept.length !== data.length) {
          filter.data = [...kept, { $: { "android:scheme": SCHEME_PLACEHOLDER } }];
        }
      }
    }
    return cfg;
  });

/**
 * Keep main-source-set outputs identical for every APP_VARIANT so prebuilds don't churn Gradle.
 * @type {FlavorsPlugin}
 */
const withStableProjectName = (config, { projectName }) => {
  const withName = withSettingsGradle(config, (cfg) => {
    cfg.modResults.contents = cfg.modResults.contents.replace(
      ROOT_PROJECT_NAME_REGEX,
      `rootProject.name = '${projectName.replace(SINGLE_QUOTE_REGEX, "\\'")}'`
    );
    return cfg;
  });
  return withStringsXml(withName, (cfg) => {
    cfg.modResults = AndroidConfig.Strings.setStringItem(
      [AndroidConfig.Resources.buildResourceItem({ name: "app_name", value: projectName })],
      cfg.modResults
    );
    return cfg;
  });
};

/**
 * Flavor source sets override `app_name` from main.
 * @type {FlavorsPlugin}
 */
const withFlavorAppNames = (config, { flavors }) =>
  withDangerousMod(config, [
    "android",
    (cfg) => {
      for (const flavor of flavors) {
        const valuesDir = path.join(cfg.modRequest.platformProjectRoot, "app", "src", flavor.name, "res", "values");
        fs.mkdirSync(valuesDir, { recursive: true });
        fs.writeFileSync(
          path.join(valuesDir, "strings.xml"),
          `<resources>\n  <string name="app_name">${escapeXml(flavor.appName)}</string>\n</resources>\n`
        );
      }
      return cfg;
    },
  ]);

/**
 * One native Android project for every variant: the namespace stays fixed and each
 * flavor sets its own applicationId suffix, launcher name, and deep link scheme.
 * Switching variants needs no prebuild and reuses the same Gradle caches.
 * @type {FlavorsPlugin}
 */
const withAndroidFlavors = (config, props) =>
  [withFlavorsGradle, withFlavorScheme, withStableProjectName, withFlavorAppNames].reduce(
    (current, plugin) => plugin(current, props),
    config
  );

module.exports = { withAndroidFlavors };
