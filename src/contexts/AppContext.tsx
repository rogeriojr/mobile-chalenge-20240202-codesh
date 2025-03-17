import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StorageService } from "../services/storage";
import { ApiService, WordDefinition } from "../services/api";

interface AppContextData {
  // User state
  user: { id: string; email: string } | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Words state
  currentWord: string | null;
  wordDefinition: WordDefinition[] | null;
  isLoading: boolean;
  error: string | null;

  // Favorites state
  favorites: string[];
  addFavorite: (word: string) => Promise<void>;
  removeFavorite: (word: string) => Promise<void>;
  isFavorite: (word: string) => boolean;

  // History state
  history: string[];
  clearHistory: () => Promise<void>;

  // Word actions
  searchWord: (word: string) => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const useApp = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User state
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Words state
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordDefinition, setWordDefinition] = useState<WordDefinition[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  // History state
  const [history, setHistory] = useState<string[]>([]);

  // Load user data on mount
  useEffect(() => {
    const loadUser = async () => {
      const userData = await StorageService.getUser();
      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      }
    };

    loadUser();
  }, []);

  // Load favorites and history when user changes
  useEffect(() => {
    const loadUserData = async () => {
      const userFavorites = await StorageService.getFavorites(user?.id);
      const userHistory = await StorageService.getHistory(user?.id);

      setFavorites(userFavorites);
      setHistory(userHistory);
    };

    loadUserData();
  }, [user]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would validate credentials with a backend
      // For this demo, we'll just create a user with a random ID
      const userId = Math.random().toString(36).substring(2, 15);

      await StorageService.saveUser(userId, email);

      setUser({ id: userId, email });
      setIsLoggedIn(true);

      // Load user-specific data
      const userFavorites = await StorageService.getFavorites(userId);
      const userHistory = await StorageService.getHistory(userId);

      setFavorites(userFavorites);
      setHistory(userHistory);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await StorageService.clearUser();

      setUser(null);
      setIsLoggedIn(false);

      // Load non-user-specific data
      const generalFavorites = await StorageService.getFavorites();
      const generalHistory = await StorageService.getHistory();

      setFavorites(generalFavorites);
      setHistory(generalHistory);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  // Add word to favorites
  const addFavorite = async (word: string) => {
    try {
      await StorageService.addFavorite(word, user?.id);
      setFavorites((prev) => [...prev, word]);
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  // Remove word from favorites
  const removeFavorite = async (word: string) => {
    try {
      await StorageService.removeFavorite(word, user?.id);
      setFavorites((prev) => prev.filter((favorite) => favorite !== word));
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  };

  // Check if word is in favorites
  const isFavorite = (word: string) => {
    return favorites.includes(word);
  };

  // Clear history
  const clearHistory = async () => {
    try {
      await StorageService.clearHistory(user?.id);
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
      throw error;
    }
  };

  // Search for a word definition
  const searchWord = async (word: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentWord(word);

      const definition = await ApiService.getWordDefinition(word);
      setWordDefinition(definition);

      // Add to history
      await StorageService.addToHistory(word, user?.id);
      setHistory((prev) => [word, ...prev.filter((item) => item !== word)]);
    } catch (error: any) {
      console.error("Error searching word:", error);
      setError(error.message || "Failed to fetch word definition");
      setWordDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        // User state
        user,
        isLoggedIn,
        login,
        logout,

        // Words state
        currentWord,
        wordDefinition,
        isLoading,
        error,

        // Favorites state
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,

        // History state
        history,
        clearHistory,

        // Word actions
        searchWord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
