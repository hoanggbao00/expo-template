import FontProvider from "./font-provider";
import I18nProvider from "./i18n-provider";
import { QueryProvider } from "./query-provider";
import ThemeProvider from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <FontProvider>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </FontProvider>
    </QueryProvider>
  );
}
