import { queryClient } from "@/lib/query-client";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

// Dev-only: the require is dead-code eliminated in production, so the package stays out of the release bundle.
const useDevTools: (client: typeof queryClient) => void = __DEV__
  ? require("@dev-plugins/react-query").useReactQueryDevTools
  : () => undefined;

// React Query has no app-focus signal on React Native; map AppState so `refetchOnWindowFocus` works.
const onAppStateChange = (status: AppStateStatus) => focusManager.setFocused(status === "active");

export function QueryProvider({ children }: { children: React.ReactNode }) {
  useDevTools(queryClient);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
