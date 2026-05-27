export const LANGUAGES = [
  { code: "en", name: "English", flag: "gb", rtl: false },
  { code: "de", name: "Deutsch", flag: "de", rtl: false },
  { code: "fr", name: "Français", flag: "fr", rtl: false },
  { code: "ja", name: "日本語", flag: "jp", rtl: false },
  { code: "ko", name: "한국어", flag: "kr", rtl: false },
  { code: "zh", name: "中文", flag: "cn", rtl: false },
  { code: "pt", name: "Português", flag: "pt", rtl: false },
  { code: "es", name: "Español", flag: "es", rtl: false },
  { code: "vi", name: "Tiếng Việt", flag: "vn", rtl: false },
  { code: "it", name: "Italiano", flag: "it", rtl: false },
  { code: "hi", name: "हिंदी", flag: "in", rtl: false },
  { code: "th", name: "ไทย", flag: "th", rtl: false },
  { code: "ar", name: "عربي", flag: "ae", rtl: true },
];

export type LanguageItem = (typeof LANGUAGES)[number];

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
