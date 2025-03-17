import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WordCard } from "../components/WordCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useApp } from "../contexts/AppContext";
import { theme } from "../theme";
import { RootStackParamList } from "../navigation/types";

type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Favorites"
>;

/**
 * Favorites screen component
 */
export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const {
    favorites,
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
          name="favorite-border"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyText}>No favorite words yet</Text>
        <Text style={styles.emptySubtext}>
          Words you mark as favorites will appear here
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Browse Dictionary</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading favorites..." />;
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
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            onPress={handleWordPress}
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
    paddingTop: theme.spacing.xl,
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
  headerRight: {
    width: 40,
  },
  listContent: {
    padding: theme.spacing.md,
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
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  buttonText: {
    color: "white",
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
  },
});
