import { i18n } from "@/i18n";
import type { ErrorBoundaryProps } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Plain React Native primitives on purpose: this renders when the tree above may be broken
// (theme, fonts, uniwind), so it must not depend on any app provider.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  // TODO: report `error` to a crash reporting service (e.g. Sentry) once one is integrated.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("error:title")}</Text>
      <Text style={styles.message}>{__DEV__ ? error.message : i18n.t("error:message")}</Text>
      <Pressable accessibilityRole="button" onPress={retry} style={styles.button}>
        <Text style={styles.buttonText}>{i18n.t("error:retry")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  message: { fontSize: 14, textAlign: "center", color: "#555" },
  button: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: "#208AEF" },
  buttonText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
