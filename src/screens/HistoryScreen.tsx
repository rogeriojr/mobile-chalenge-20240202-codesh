import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WordCard } from "../components/WordCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useApp } from "../contexts/AppContext";
import { theme } from "../theme";
import { RootStackParamList } from "../navigation/types";

type HistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "History"
>;

/**
 * History screen component
 */
export const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const {
    history,
    clearHistory,
    isFavorite,
    addFavorite,
    removeFavorite,
    searchWord,
    isLoading,
  } = useApp();

  // Handle word selection
  const handleWordPress = (word: string) => {
    searchWord(word);
    navigation.navigate("WordDetails", { word });
  };

  // Handle favorite toggle
  const handleToggleFavorite = (word: string) => {
    if (isFavorite(word)) {
      removeFavorite(word);
    } else {
      addFavorite(word);
    }
  };

  // Render empty component for FlatList
  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="history"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyText}>No viewed words yet</Text>
        <Text style={styles.emptySubtext}>Words you view will appear here</Text>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading history..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <MaterialIcons name="delete" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            onPress={() => handleWordPress(item)}
            isFavorite={isFavorite(item)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === "ios" ? theme.spacing.xl : theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    textAlign: "center",
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.sm,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    opacity: 0.7,
  },
});
