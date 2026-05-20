import FontProvider from "./font-provider";
import ThemeProvider from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FontProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </FontProvider>
  );
}
