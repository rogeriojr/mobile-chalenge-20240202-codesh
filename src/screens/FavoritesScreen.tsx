import React from "react";
import {
  StyleSheet,
  Text,
  FlatList as RNFlatList,
  View,
  TouchableOpacity,
  // ScrollView, // Removendo importação não utilizada
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WordCard } from "../components/WordCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useApp } from "../contexts/AppContext";
import { theme } from "../theme";
import { RootStackParamList } from "../navigation/types";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { StorageService } from "../services/storage";

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
  const { t } = useTranslation();

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

  // Toggle language
  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "pt" ? "en" : "pt";
    await i18n.changeLanguage(newLang);
    await StorageService.saveLanguage(newLang);
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
        <Text style={styles.emptyText}>{t("favorites.noFavorites")}</Text>
        <Text style={styles.emptySubtext}>{t("favorites.addSome")}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>{t("home.title")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingIndicator message={t("common.loading")} />;
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
        <Text style={styles.headerTitle}>{t("favorites.title")}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={toggleLanguage}
        >
          <MaterialIcons name="language" size={24} color={theme.colors.info} />
          <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <RNFlatList
        data={favorites}
        keyExtractor={(item, index) => `${item}_${index}`}
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
  languageButton: {
    padding: theme.spacing.xs,
    alignItems: "center",
  },
  langText: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.info,
    fontWeight: "bold",
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
  },
  buttonText: {
    color: "white",
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
  },
});
