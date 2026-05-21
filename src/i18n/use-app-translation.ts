import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import type { AppTranslationResourceKeys, AppTranslationResources } from "./locales/resources";

export type NamespaceKey<N extends AppTranslationResourceKeys> = keyof AppTranslationResources[N] & string;

export type NamespacedKey<N extends AppTranslationResourceKeys> = `${N}:${NamespaceKey<N>}`;

export type NamespacedKeysForNamespaces<Ns extends readonly AppTranslationResourceKeys[]> = {
  [N in Ns[number]]: NamespacedKey<N>;
}[Ns[number]];

/**
 * Strongly typed translation hook.
 *
 * - If you pass a single namespace (string), you call: `t("key")`
 * - If you pass multiple namespaces (array), you call: `t("namespace:key")`
 *
 * Tip: Array literals preserve tuple types automatically with the `const` generic,
 * and VSCode can autocomplete namespace values when typing inside the array.
 */

// Overload 1: single namespace -> `t("key")`
export function useAppTranslation<const N extends AppTranslationResourceKeys>(
  namespace: N
): {
  _: TFunction<[N], undefined>;
  t: (key: NamespaceKey<N>, options?: Record<string, string>) => string;
};

// Overload 2: multiple namespaces (const tuple) -> enables `ns:key` autocomplete
// The `& readonly AppTranslationResourceKeys[]` intersection provides a concrete
// contextual type so VSCode can autocomplete values *inside the array literal*.
export function useAppTranslation<Ns extends readonly AppTranslationResourceKeys[]>(
  namespaces: Ns & AppTranslationResourceKeys[]
): {
  _: TFunction<Ns, undefined>;
  t: (key: NamespacedKeysForNamespaces<Ns>, options?: Record<string, string>) => string;
};

// Implementation
export function useAppTranslation(namespaces: AppTranslationResourceKeys | AppTranslationResourceKeys[]) {
  const nsArray = (Array.isArray(namespaces) ? namespaces : [namespaces]) as readonly string[] | [string, ...string[]];

  const { t: _ } = useTranslation(nsArray);

  const t = (key: unknown, options?: Record<string, string>): string => _(key as never, options);

  return { _, t };
}
