export const LANGUAGES = [
  { code: "en", name: "English", flag: "gb", rtl: false },
  { code: "vi", name: "Tiếng Việt", flag: "vn", rtl: false },
];

export type LanguageItem = (typeof LANGUAGES)[number];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
