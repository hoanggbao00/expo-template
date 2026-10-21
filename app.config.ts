import type { ConfigContext, ExpoConfig } from "expo/config";
import appJson from "./app.json";
import packageJson from "./package.json";
import { withAndroidFlavors } from "./plugins/with-android-flavors";

// app.json holds the static base (production identity). This file only applies per-variant
// overrides selected by APP_VARIANT. Identifiers stay in source, not .env: prebuild bakes
// them into the native project, so an out-of-sync .env would diverge from the installed binary.
type AppVariant = "development" | "preview" | "production";

interface VariantConfig {
  /** Gradle product flavor name, e.g. `dev` -> `assembleDevRelease`. */
  flavor: string;
  nameSuffix: string;
  idSuffix: string;
}

const VARIANTS: Record<AppVariant, VariantConfig> = {
  development: { flavor: "dev", nameSuffix: " (Dev)", idSuffix: ".dev" },
  preview: { flavor: "preview", nameSuffix: " (Preview)", idSuffix: ".preview" },
  production: { flavor: "prod", nameSuffix: "", idSuffix: "" },
};

// Defaults to development so a missing variable never produces the production identity.
const APP_VARIANT = (process.env.APP_VARIANT ?? "development") as AppVariant;
if (!(APP_VARIANT in VARIANTS)) {
  throw new Error(`Invalid APP_VARIANT "${APP_VARIANT}". Expected: ${Object.keys(VARIANTS).join(" | ")}`);
}

/** Suffix without the leading dot, e.g. `dev`; empty for production. */
const tagOf = (variant: AppVariant) => VARIANTS[variant].idSuffix.slice(1);

const getAppName = (name: string, variant: AppVariant) => `${name}${VARIANTS[variant].nameSuffix}`;
const getUniqueIdentifier = (id: string, variant: AppVariant) => `${id}${VARIANTS[variant].idSuffix}`;
const getSlug = (slug: string, variant: AppVariant) => (tagOf(variant) ? `${slug}-${tagOf(variant)}` : slug);
/** Dash instead of dot so it stays a valid URI scheme: `myapp-dev`, `myapp-preview`. */
const getScheme = (scheme: string, variant: AppVariant) => (tagOf(variant) ? `${scheme}-${tagOf(variant)}` : scheme);

// Read by scripts/run-android.sh and scripts/build-android.sh, which load this file without Expo's config context.
export const APP_NAME = getAppName(appJson.expo.name, APP_VARIANT);
export const ANDROID_APPLICATION_ID = getUniqueIdentifier(appJson.expo.android.package, APP_VARIANT);

export default ({ config }: ConfigContext): ExpoConfig => {
  // config is app.json's `expo` object; the cast restores its non-optional fields.
  const { name, slug, scheme, ios } = config as typeof appJson.expo;

  return withAndroidFlavors(
    {
      ...config,
      name: getAppName(name, APP_VARIANT),
      slug: getSlug(slug, APP_VARIANT),
      scheme: getScheme(scheme, APP_VARIANT),
      version: packageJson.androidVersion || "1.0.0",
      ios: {
        ...config.ios,
        version: packageJson.iosVersion || "1.0.0",
        buildNumber: String(packageJson.iosBuildNumber || 1),
        bundleIdentifier: getUniqueIdentifier(ios.bundleIdentifier, APP_VARIANT),
        infoPlist: { ...config.ios?.infoPlist, CFBundleDisplayName: getAppName(name, APP_VARIANT) },
      },
      android: {
        ...config.android,
        // Fixed across variants: the split lives in Gradle product flavors (see withAndroidFlavors),
        // so switching variants never re-prebuilds Android.
        versionCode: packageJson.androidVersionCode || 1,
      },
    },
    {
      projectName: name,
      flavors: (Object.keys(VARIANTS) as AppVariant[]).map((variant) => ({
        name: VARIANTS[variant].flavor,
        appName: getAppName(name, variant),
        scheme: getScheme(scheme, variant),
        applicationIdSuffix: VARIANTS[variant].idSuffix || undefined,
      })),
    }
  );
};
