import type { AppTranslationResources } from "@/i18n/locales/resources";

// Types `t()` keys from `en.json` for `useTranslation` and `i18n.t`.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: AppTranslationResources;
  }
}
