#!/usr/bin/env bun
/**
 * Run the iOS app for a variant. iOS has no flavors: bundle id and name are baked into the
 * native project, so switching variants re-runs prebuild (only when the bundle id differs).
 *
 *   bun run ios                     # asks for the variant (dev without a terminal)
 *   bun run ios -v dev              # Debug build (Metro)
 *   bun run ios -v preview          # Release build
 *   bun run ios -v prod             # Release build
 *   Other args go to `expo run:ios` (e.g. --device).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "bun";
import { type AppVariant, getUniqueIdentifier } from "../app.config";
import appJson from "../app.json";
import { parseRunArgs, pickVariant } from "./variant";

const IOS_DIR = path.resolve(import.meta.dir, "..", "ios");

/** True when the generated Xcode project is missing or still carries another variant's bundle id. */
function needsPrebuild(bundleId: string) {
  if (!existsSync(IOS_DIR)) return false; // expo run:ios prebuilds a missing project itself
  const project = readdirSync(IOS_DIR).find((entry) => entry.endsWith(".xcodeproj"));
  if (!project) return true;
  const pbxproj = readFileSync(path.join(IOS_DIR, project, "project.pbxproj"), "utf8");
  return !(
    pbxproj.includes(`PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";`) ||
    pbxproj.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${bundleId};`)
  );
}

async function exec(cmd: string[], variant: AppVariant) {
  const proc = spawn(cmd, { stdio: ["inherit", "inherit", "inherit"], env: { ...process.env, APP_VARIANT: variant } });
  const code = await proc.exited;
  if (code !== 0) process.exit(code);
}

const { variant: flag, rest } = parseRunArgs(process.argv.slice(2));
const variant = flag ?? (await pickVariant());

if (needsPrebuild(getUniqueIdentifier(appJson.expo.ios.bundleIdentifier, variant))) {
  await exec(["bun", "expo", "prebuild", "--platform", "ios", "--no-clean"], variant);
}

// Debug (with Metro) only for development; other variants mirror what ships.
const configuration = variant === "development" ? "Debug" : "Release";
await exec(["bun", "expo", "run:ios", "--configuration", configuration, ...rest], variant);
