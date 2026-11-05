#!/usr/bin/env bun
/**
 * Forward the dev API (8080) and MinIO (9000) from every connected Android device to this Mac, so the app and the
 * presigned upload URLs can use `localhost` (no LAN / Tailscale IP to keep in sync). Metro (8081) is reversed by Expo.
 * Run by `bun run android`; run it alone (`bun run adb:reverse`) after replugging a device or restarting an emulator.
 * Only USB or emulator devices: a phone on wireless debugging still reaches localhost through it too.
 */
import { $ } from "bun";

const PORTS = [8080, 9000];

export async function reverseDevPorts() {
  const list = await $`adb devices`.nothrow().quiet().text();
  const serials = list
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t"))
    .filter(([, state]) => state?.trim() === "device")
    .map(([serial]) => serial);
  for (const serial of serials) {
    for (const port of PORTS) await $`adb -s ${serial} reverse tcp:${port} tcp:${port}`.nothrow().quiet();
  }
  return serials;
}

if (import.meta.main) {
  const serials = await reverseDevPorts();
  process.stdout.write(
    serials.length ? `Reversed ${PORTS.join(", ")} on ${serials.join(", ")}\n` : "No Android device connected\n"
  );
}
