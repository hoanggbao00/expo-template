export const LANGUAGES = [
  { code: "en", name: "English", flag: "gb" },
  { code: "vi", name: "Tiếng Việt", flag: "vn" },
] as const;

export const DEFAULT_LANGUAGE = "en" satisfies LanguageCode;

export type LanguageItem = (typeof LANGUAGES)[number];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const isLanguageCode = (value: unknown): value is LanguageCode =>
  LANGUAGES.some((language) => language.code === value);
