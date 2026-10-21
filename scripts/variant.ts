import { cancel, isCancel, select } from "@clack/prompts";
import { type AppVariant, VARIANTS } from "../app.config";

export const VARIANT_ALIASES: Record<string, AppVariant> = {
  prod: "production",
  production: "production",
  preview: "preview",
  dev: "development",
  development: "development",
};

export interface RunArgs {
  /** Variant from `-v/--variant`, if passed. */
  variant?: AppVariant;
  /** Everything else, forwarded to `expo run:*`. */
  rest: string[];
}

/** Pulls `-v/--variant <prod|preview|dev>` out of argv; exits on an invalid value. */
export function parseRunArgs(argv: string[]): RunArgs {
  const rest: string[] = [];
  let variant: AppVariant | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "-v" || argv[i] === "--variant") {
      variant = VARIANT_ALIASES[argv[i + 1] ?? ""];
      if (!variant) {
        process.stderr.write(`Invalid variant: ${argv[i + 1] ?? "<missing>"}. Expected prod | preview | dev\n`);
        process.exit(1);
      }
      i++;
    } else {
      rest.push(argv[i]);
    }
  }
  return { variant, rest };
}

/** Asks for the variant in a terminal; development otherwise. */
export async function pickVariant(): Promise<AppVariant> {
  if (!process.stdin.isTTY) return "development";
  const choice = await select({
    message: "Variant",
    initialValue: "development" as AppVariant,
    options: (Object.keys(VARIANTS) as AppVariant[]).map((value) => ({ value, label: value })),
  });
  if (isCancel(choice)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return choice;
}
