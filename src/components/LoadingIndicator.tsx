import React from "react";
import { StyleSheet, ActivityIndicator, Text } from "react-native";
import { View } from "react-native/Libraries/Components/View/View";
import { theme } from "../theme";

interface LoadingIndicatorProps {
  message?: string;
}

/**
 * Loading indicator component
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "Loading...",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  message: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
