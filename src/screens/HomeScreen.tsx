import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList as RNFlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SearchBar } from "../components/SearchBar";
import { WordCard } from "../components/WordCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { useApp } from "../contexts/AppContext";
import { WordsService } from "../services/words";
import { theme } from "../theme";
import { RootStackParamList } from "../navigation/types";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { StorageService } from "../services/storage";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

/**
 * Home screen component with word list
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { searchWord, isFavorite, addFavorite, removeFavorite, isLoggedIn } =
    useApp();
  const { t } = useTranslation();

  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreWords, setHasMoreWords] = useState(true);

  const PAGE_SIZE = 20;

  // Load initial words
  useEffect(() => {
    loadWords();
  }, []);

  // Filter words when search query changes
  useEffect(() => {
    if (searchQuery) {
      filterWords();
    } else {
      setFilteredWords(words);
    }
  }, [searchQuery, words]);

  // Load words from the dictionary
  const loadWords = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setPage(0);
      } else if (!refresh && !hasMoreWords) {
        return;
      } else if (!refresh && page > 0) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const currentPage = refresh ? 0 : page;
      const newWords = await WordsService.getWordsPaginated(
        currentPage,
        PAGE_SIZE
      );

      if (newWords.length < PAGE_SIZE) {
        setHasMoreWords(false);
      }

      if (refresh || page === 0) {
        setWords(newWords);
      } else {
        setWords((prevWords) => [...prevWords, ...newWords]);
      }

      if (page === 0 || refresh) {
        setPage(1);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error loading words:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  };

  // Filter words based on search query
  const filterWords = useCallback(async () => {
    if (!searchQuery) return;

    try {
      setIsLoading(true);
      const results = await WordsService.searchWords(searchQuery);
      setFilteredWords(results);
    } catch (error) {
      console.error("Error filtering words:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

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

  // Handle refresh
  const handleRefresh = () => {
    loadWords(true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreWords && !searchQuery) {
      loadWords();
    }
  };

  // Navigate to favorites screen
  const navigateToFavorites = () => {
    navigation.navigate("Favorites");
  };

  // Navigate to history screen
  const navigateToHistory = () => {
    navigation.navigate("History");
  };

  // Navigate to login screen
  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  // Toggle language
  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "pt" ? "en" : "pt";
    await i18n.changeLanguage(newLang);
    await StorageService.saveLanguage(newLang);
  };

  // Render footer for FlatList
  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.footerText}>{t("home.loadingMore")}</Text>
      </View>
    );
  };

  // Render empty component for FlatList
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="search-off"
          size={64}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.emptyText}>
          {searchQuery ? t("home.noWordsFound") : t("home.noWordsAvailable")}
        </Text>
      </View>
    );
  };

  if (isLoading && !isLoadingMore && !isRefreshing) {
    return <LoadingIndicator message={t("home.loadingDictionary")} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("home.title")}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleLanguage}>
            <MaterialIcons
              name="language"
              size={24}
              color={theme.colors.info}
            />
            <Text style={styles.langText}>{i18n.language.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={navigateToHistory}
          >
            <MaterialIcons name="history" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={navigateToFavorites}
          >
            <MaterialIcons
              name="favorite"
              size={24}
              color={theme.colors.favorite}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={navigateToLogin}>
            <MaterialIcons
              name={isLoggedIn ? "account-circle" : "login"}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        onSearch={setSearchQuery}
        initialValue={searchQuery}
        placeholder={t("common.search")}
      />

      <RNFlatList
        data={filteredWords}
        keyExtractor={(item, index) => `word_${index}`}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            onPress={handleWordPress}
            isFavorite={isFavorite(item)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerButtons: {
    flexDirection: "row",
  },
  langText: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.info,
    fontWeight: "bold",
  },
  iconButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  footerText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
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
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
