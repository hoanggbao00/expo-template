import FontProvider from "@/providers/font-provider";
import I18nProvider from "@/providers/i18n-provider";
import QueryProvider from "@/providers/query-provider";
import ThemeProvider from "@/providers/theme-provider";
import "@/i18n";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <FontProvider>
      <ThemeProvider>
        <I18nProvider>
          <QueryProvider>{children}</QueryProvider>
        </I18nProvider>
      </ThemeProvider>
    </FontProvider>
  );
}
