import FontProvider from "./font-provider";
import I18nProvider from "./i18n-provider";
import ThemeProvider from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FontProvider>
      <ThemeProvider>
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </FontProvider>
  );
}
