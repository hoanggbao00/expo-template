#!/usr/bin/env bun
/**
 * Run the Android app for a variant. Flavor and applicationId come from app.config.ts.
 *
 *   bun run android                 # asks for the variant (dev without a terminal)
 *   bun run android -v dev          # dev flavor, debug build (Metro)
 *   bun run android -v preview      # preview flavor, release build
 *   bun run android -v prod         # prod flavor, release build
 *   Other args go to `expo run:android` (e.g. --device, --no-bundler).
 */
import { spawn } from "bun";
import { getUniqueIdentifier, VARIANTS } from "../app.config";
import appJson from "../app.json";
import { parseRunArgs, pickVariant } from "./variant";

const { variant: flag, rest } = parseRunArgs(process.argv.slice(2));
const variant = flag ?? (await pickVariant());

// Debug (with Metro) only for development; other variants mirror what ships.
const buildType = variant === "development" ? "Debug" : "Release";
const proc = spawn(
  [
    "bun",
    "expo",
    "run:android",
    "--variant",
    `${VARIANTS[variant].flavor}${buildType}`,
    "--app-id",
    getUniqueIdentifier(appJson.expo.android.package, variant),
    ...rest,
  ],
  { stdio: ["inherit", "inherit", "inherit"], env: { ...process.env, APP_VARIANT: variant } }
);

process.exit(await proc.exited);
