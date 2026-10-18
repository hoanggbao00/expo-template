import { expect, test } from "bun:test";
import { resources } from "./resources";

const keysOf = (value: object, prefix = ""): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === "object" && child !== null ? keysOf(child, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

test("every locale has the same keys as en", () => {
  const enKeys = keysOf(resources.en).sort();
  for (const [code, translations] of Object.entries(resources)) {
    expect({ code, keys: keysOf(translations).sort() }).toEqual({ code, keys: enKeys });
  }
});
