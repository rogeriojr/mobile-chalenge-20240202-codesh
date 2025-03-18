import React from "react";
import {
  StyleSheet,
  Text,
  FlatList as RNFlatList,
  Platform,
} from "react-native";
import { View } from "react-native/Libraries/Components/View/View";
import { TouchableOpacity } from "react-native/Libraries/Components/Touchable/TouchableOpacity";
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
          name="history"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyText}>{t("history.noHistory")}</Text>
        <Text style={styles.emptySubtext}>{t("history.searchSome")}</Text>
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
        <Text style={styles.headerTitle}>{t("history.title")}</Text>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
          >
            <MaterialIcons
              name="language"
              size={24}
              color={theme.colors.info}
            />
            <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
          </TouchableOpacity>
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
              <MaterialIcons
                name="delete"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <RNFlatList
        data={history}
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
  headerRightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
    alignItems: "center",
  },
  langText: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.info,
    fontWeight: "bold",
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
