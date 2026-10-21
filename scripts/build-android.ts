#!/usr/bin/env bun
/**
 * Android release build: prebuild, sign, and copy artifacts to output/android/<version>/.
 *
 *   bun run android:build                          # interactive
 *   bun run android:build -v prod -b aab           # production AAB
 *   bun run android:build -v all -b all            # every variant, APK + AAB
 *   bun run android:build -v preview -b apk -n qa  # output/android/<version>/qa.apk
 *
 * Anything not passed as a flag is asked. Without a terminal (CI) the defaults are production APK.
 * Signing reads ANDROID_KEYSTORE_PASSWORD / ANDROID_KEY_ALIAS (e.g. from .env.production.local).
 */
import { cancel, confirm, intro, isCancel, log, note, outro, select, taskLog, text } from "@clack/prompts";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { cpus, platform, totalmem } from "node:os";
import path from "node:path";
import { parseArgs, styleText } from "node:util";
import { spawn } from "bun";
import { type AppVariant, getAppName, VARIANTS } from "../app.config";
import appJson from "../app.json";
import packageJson from "../package.json";
import { VARIANT_ALIASES } from "./variant";

type BuildFormat = "apk" | "aab";

interface BuildJob {
  variant: AppVariant;
  format: BuildFormat;
  fileName: string;
}

interface RunOptions {
  cwd?: string;
  env?: Record<string, string>;
  /** Called for every output line (stdout and stderr). */
  onLine?: (line: string) => void;
}

const ROOT_DIR = path.resolve(import.meta.dir, "..");
const ANDROID_DIR = path.join(ROOT_DIR, "android");
const APP_DIR = path.join(ANDROID_DIR, "app");
const GRADLE_PROPERTIES = path.join(ANDROID_DIR, "gradle.properties");
const BUILD_LOG = path.join(ANDROID_DIR, "android_build.log");

const KEYSTORE_FILE = "release.keystore";
const SOURCE_KEYSTORE = path.join(ROOT_DIR, KEYSTORE_FILE);
const DEST_KEYSTORE = path.join(APP_DIR, KEYSTORE_FILE);
// shortcut: defaults match the existing local keystore, move them to .env.production.local before sharing builds.
const KEYSTORE_PASSWORD = process.env.ANDROID_KEYSTORE_PASSWORD ?? "hoanggbao00";
const KEY_ALIAS = process.env.ANDROID_KEY_ALIAS ?? "hoanggbao.alias";
const KEY_DNAME = "CN=Hoang Bao, OU=Personal, O=Personal, L=Bac Ninh, S=Bac Ninh, C=VN";

const ALL_VARIANTS = Object.keys(VARIANTS) as AppVariant[];
const ALL_FORMATS: BuildFormat[] = ["apk", "aab"];
const GRADLE_PROGRESS = /^> Task|BUILD|FAILURE/;

const APP_VERSION = packageJson.androidVersion || "1.0.0";
const APP_VERSION_CODE = packageJson.androidVersionCode || 1;
const OUTPUT_DIR = path.join(ROOT_DIR, "output", "android", APP_VERSION);
const INTERACTIVE = Boolean(process.stdin.isTTY);

const OPTIONS = {
  variant: { type: "string", short: "v" },
  type: { type: "string", short: "b" },
  name: { type: "string", short: "n" },
} as const;
const USAGE = "Usage: bun run android:build [-v prod|preview|dev|all] [-b apk|aab|all] [-n file-name]";

const NON_ALPHANUMERIC = /[^A-Za-z0-9]+/;
const ARTIFACT_EXTENSION = /\.(apk|aab)$/i;
const GRADLE_JVM_ARGS_LINE = /^org\.gradle\.jvmargs=.*$/m;

function fail(message: string): never {
  log.error(message);
  process.exit(1);
}

/** Exit cleanly when the user presses Ctrl+C / Esc in a prompt. */
function unwrap<T>(value: T): Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel("Build cancelled.");
    process.exit(0);
  }
  return value as Exclude<T, symbol>;
}

function toPascal(name: string) {
  return name
    .split(NON_ALPHANUMERIC)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function generatedName(variant: AppVariant, stamp: string) {
  return `${toPascal(getAppName(appJson.expo.name, variant))}-${stamp}`;
}

/** Empty means generated; drop a typed extension and path separators. */
function cleanFileName(input: string) {
  return input.trim().replace(ARTIFACT_EXTENSION, "").replaceAll("/", "-");
}

function gradleJvmArgs() {
  if (process.env.GRADLE_JVM_ARGS) return process.env.GRADLE_JVM_ARGS;
  const memoryMb = totalmem() / 1024 / 1024;
  if (memoryMb >= 32_768) return "-Xmx6144m -XX:MaxMetaspaceSize=1024m";
  if (memoryMb >= 16_384) return "-Xmx4096m -XX:MaxMetaspaceSize=1024m";
  if (memoryMb >= 8192) return "-Xmx3072m -XX:MaxMetaspaceSize=768m";
  return "-Xmx2048m -XX:MaxMetaspaceSize=512m";
}

/** Lower CPU/IO priority so the machine stays usable during the build. */
function lowPriorityPrefix() {
  return platform() === "darwin" ? ["nice", "-n", "10"] : ["nice", "-n", "19", "ionice", "-c", "3"];
}

async function pipeLines(stream: ReadableStream<Uint8Array>, onLine: (line: string) => void) {
  const decoder = new TextDecoder();
  let buffered = "";
  for await (const chunk of stream) {
    buffered += decoder.decode(chunk, { stream: true });
    const lines = buffered.split("\n");
    buffered = lines.pop() ?? "";
    for (const line of lines) onLine(line);
  }
  if (buffered) onLine(buffered);
}

async function run(cmd: string[], { cwd = ROOT_DIR, env, onLine }: RunOptions = {}) {
  const output: string[] = [];
  const handle = (line: string) => {
    output.push(line);
    onLine?.(line);
  };
  const proc = spawn(cmd, { cwd, env: { ...process.env, ...env }, stdout: "pipe", stderr: "pipe" });
  await Promise.all([pipeLines(proc.stdout, handle), pipeLines(proc.stderr, handle)]);
  return { code: await proc.exited, output };
}

async function resolveVariants(flag: string | undefined): Promise<AppVariant[]> {
  let choice = flag;
  if (choice === undefined) {
    if (!INTERACTIVE) return ["production"];
    choice = unwrap(
      await select({
        message: "Variant",
        initialValue: "production",
        options: [...ALL_VARIANTS.map((value) => ({ value, label: value })), { value: "all", label: "all" }],
      })
    );
  }
  if (choice === "all") return ALL_VARIANTS;
  const variant = VARIANT_ALIASES[choice];
  if (!variant) fail(`Invalid variant: ${choice}\n${USAGE}`);
  return [variant];
}

async function resolveFormats(flag: string | undefined): Promise<BuildFormat[]> {
  let choice = flag;
  if (choice === undefined) {
    if (!INTERACTIVE) return ["apk"];
    choice = unwrap(
      await select({
        message: "Format",
        options: [...ALL_FORMATS.map((value) => ({ value, label: value })), { value: "all", label: "all" }],
      })
    );
  }
  if (choice === "all") return ALL_FORMATS;
  if (!ALL_FORMATS.includes(choice as BuildFormat)) fail(`Invalid type: ${choice}\n${USAGE}`);
  return [choice as BuildFormat];
}

async function resolveFileName(flag: string | undefined, variants: AppVariant[], stamp: string) {
  if (flag !== undefined || !INTERACTIVE) return cleanFileName(flag ?? "");
  const placeholder = variants.length === 1 ? generatedName(variants[0], stamp) : "<AppName>-<timestamp>";
  return cleanFileName(unwrap(await text({ message: "File name", placeholder, defaultValue: "" })));
}

function planJobs(variants: AppVariant[], formats: BuildFormat[], customName: string, stamp: string): BuildJob[] {
  return variants.flatMap((variant) =>
    formats.map((format) => {
      // One custom name for several variants would overwrite; suffix the variant.
      const base = customName && variants.length > 1 ? `${customName}-${variant}` : customName;
      return { variant, format, fileName: `${base || generatedName(variant, stamp)}.${format}` };
    })
  );
}

async function prebuild(variant: AppVariant) {
  const task = taskLog({ title: "Expo prebuild (Android)", limit: 8 });
  const { code } = await run(["bun", "expo", "prebuild", "--platform", "android", "--no-clean"], {
    env: { APP_VARIANT: variant },
    onLine: (line) => line.trim() && task.message(line),
  });
  if (code !== 0) {
    task.error("Expo prebuild failed.", { showLog: true });
    process.exit(1);
  }
  task.success("Prebuild done");
}

function applyGradleHeap() {
  if (!existsSync(GRADLE_PROPERTIES)) fail(`${GRADLE_PROPERTIES} not found after prebuild.`);
  const jvmArgs = gradleJvmArgs();
  const current = readFileSync(GRADLE_PROPERTIES, "utf8");
  const line = `org.gradle.jvmargs=${jvmArgs}`;
  const next = GRADLE_JVM_ARGS_LINE.test(current)
    ? current.replace(GRADLE_JVM_ARGS_LINE, line)
    : `${current}\n${line}\n`;
  writeFileSync(GRADLE_PROPERTIES, next);
  log.step(`Gradle heap: ${styleText("cyan", jvmArgs)}`);
}

async function ensureKeystore() {
  if (!existsSync(SOURCE_KEYSTORE)) {
    const { code, output } = await run([
      "keytool",
      "-genkey",
      "-v",
      "-keystore",
      SOURCE_KEYSTORE,
      "-alias",
      KEY_ALIAS,
      "-keyalg",
      "RSA",
      "-keysize",
      "2048",
      "-validity",
      "10000",
      "-storepass",
      KEYSTORE_PASSWORD,
      "-keypass",
      KEYSTORE_PASSWORD,
      "-dname",
      KEY_DNAME,
    ]);
    if (code !== 0) fail(`Keystore generation failed:\n${output.join("\n")}`);
    log.success(`Generated ${KEYSTORE_FILE}`);
  }
  copyFileSync(SOURCE_KEYSTORE, DEST_KEYSTORE);
  log.step(`Keystore: ${styleText("cyan", KEYSTORE_FILE)}`);
}

async function buildJob(job: BuildJob) {
  const { flavor } = VARIANTS[job.variant];
  const flavorTask = flavor.charAt(0).toUpperCase() + flavor.slice(1);
  const gradleTask = `${job.format === "aab" ? "bundle" : "assemble"}${flavorTask}Release`;
  const artifact =
    job.format === "aab"
      ? path.join(APP_DIR, "build", "outputs", "bundle", `${flavor}Release`, `app-${flavor}-release.aab`)
      : path.join(APP_DIR, "build", "outputs", "apk", flavor, "release", `app-${flavor}-release.apk`);
  const maxWorkers = Math.max(1, cpus().length - 2);

  const task = taskLog({ title: `${job.variant} ${job.format} (${gradleTask})`, limit: 6 });
  const { code, output } = await run(
    [
      ...lowPriorityPrefix(),
      "./gradlew",
      gradleTask,
      `--max-workers=${maxWorkers}`,
      "--build-cache",
      "--configure-on-demand",
      "--console=plain",
      `-Pandroid.injected.signing.store.file=${DEST_KEYSTORE}`,
      `-Pandroid.injected.signing.store.password=${KEYSTORE_PASSWORD}`,
      `-Pandroid.injected.signing.key.alias=${KEY_ALIAS}`,
      `-Pandroid.injected.signing.key.password=${KEYSTORE_PASSWORD}`,
    ],
    {
      cwd: ANDROID_DIR,
      // The release JS bundle reads app.config.ts, so it must see the matching variant.
      env: { APP_VARIANT: job.variant, NODE_ENV: "production" },
      onLine: (line) => GRADLE_PROGRESS.test(line) && task.message(line),
    }
  );

  if (code !== 0) {
    writeFileSync(BUILD_LOG, output.join("\n"));
    task.error(`Gradle build failed. Full log: ${BUILD_LOG}`, { showLog: true });
    process.exit(1);
  }
  if (!existsSync(artifact)) {
    task.error(`Artifact not found: ${artifact}`);
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const dest = path.join(OUTPUT_DIR, job.fileName);
  renameSync(artifact, dest);
  task.success(`${job.variant} ${job.format} -> ${path.relative(ROOT_DIR, dest)}`);
  return dest;
}

function parseFlags() {
  try {
    return parseArgs({ options: OPTIONS, strict: true }).values;
  } catch (error) {
    fail(`${(error as Error).message}\n${USAGE}`);
  }
}

async function main() {
  const args = parseFlags();
  intro(styleText(["bgGreen", "black"], " Android build "));

  const variants = await resolveVariants(args.variant);
  const formats = await resolveFormats(args.type);
  const stamp = timestamp();
  const customName = await resolveFileName(args.name, variants, stamp);
  const jobs = planJobs(variants, formats, customName, stamp);

  note(
    [
      `App      ${styleText("cyan", appJson.expo.name)}`,
      `Version  ${styleText("cyan", `${APP_VERSION} (${APP_VERSION_CODE})`)}`,
      `Output   ${styleText("cyan", path.relative(ROOT_DIR, OUTPUT_DIR))}`,
      "",
      ...jobs.map(
        (job) => `${styleText("green", "•")} ${job.variant.padEnd(12)} ${job.format}  ${styleText("dim", job.fileName)}`
      ),
    ].join("\n"),
    "Build summary"
  );

  if (INTERACTIVE && !unwrap(await confirm({ message: "Start build?" }))) {
    cancel("Build cancelled.");
    return;
  }

  // Prebuild output is identical for every flavor, so it runs once.
  await prebuild(jobs[0].variant);
  applyGradleHeap();
  await ensureKeystore();

  const outputs: string[] = [];
  for (const job of jobs) outputs.push(await buildJob(job));

  outro(
    `${styleText("green", "Build successful")}\n${outputs.map((file) => `   ${path.relative(ROOT_DIR, file)}`).join("\n")}`
  );
}

await main();
