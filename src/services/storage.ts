import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_PREFIX } from 'react-native-dotenv';

const STORAGE_KEYS = {
  USER: `${STORAGE_PREFIX}user`,
  FAVORITES: `${STORAGE_PREFIX}favorites`,
  HISTORY: `${STORAGE_PREFIX}history`,
  LANGUAGE: `${STORAGE_PREFIX}language`,
};

export const StorageService = {
  // Language methods
  saveLanguage: async (language: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      console.error("Error saving language:", error);
      throw error;
    }
  },

  getLanguage: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.error("Error getting language:", error);
      return null;
    }
  },

  // User methods
  /**
   * Get favorites from storage
   * @param userId Optional user ID for user-specific favorites
   * @returns Promise with array of favorite words
   */
  getFavorites: async (userId?: string): Promise<string[]> => {
    try {
      const key = userId ? `${STORAGE_KEYS.FAVORITES}_${userId}` : STORAGE_KEYS.FAVORITES;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  /**
   * Save favorites to storage
   * @param favorites Array of favorite words
   * @param userId Optional user ID for user-specific favorites
   */
  saveFavorites: async (favorites: string[], userId?: string): Promise<void> => {
    try {
      const key = userId ? `${STORAGE_KEYS.FAVORITES}_${userId}` : STORAGE_KEYS.FAVORITES;
      await AsyncStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  /**
   * Add word to favorites
   * @param word Word to add to favorites
   * @param userId Optional user ID for user-specific favorites
   */
  addFavorite: async (word: string, userId?: string): Promise<void> => {
    try {
      const favorites = await StorageService.getFavorites(userId);
      if (!favorites.includes(word)) {
        favorites.push(word);
        await StorageService.saveFavorites(favorites, userId);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  /**
   * Remove word from favorites
   * @param word Word to remove from favorites
   * @param userId Optional user ID for user-specific favorites
   */
  removeFavorite: async (word: string, userId?: string): Promise<void> => {
    try {
      const favorites = await StorageService.getFavorites(userId);
      const updatedFavorites = favorites.filter(favorite => favorite !== word);
      await StorageService.saveFavorites(updatedFavorites, userId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  /**
   * Check if word is in favorites
   * @param word Word to check
   * @param userId Optional user ID for user-specific favorites
   * @returns Promise with boolean indicating if word is in favorites
   */
  isFavorite: async (word: string, userId?: string): Promise<boolean> => {
    try {
      const favorites = await StorageService.getFavorites(userId);
      return favorites.includes(word);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },

  /**
   * Get history from storage
   * @param userId Optional user ID for user-specific history
   * @returns Promise with array of history words
   */
  getHistory: async (userId?: string): Promise<string[]> => {
    try {
      const key = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  /**
   * Save history to storage
   * @param history Array of history words
   * @param userId Optional user ID for user-specific history
   */
  saveHistory: async (history: string[], userId?: string): Promise<void> => {
    try {
      const key = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
      await AsyncStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  },

  /**
   * Add word to history
   * @param word Word to add to history
   * @param userId Optional user ID for user-specific history
   */
  addToHistory: async (word: string, userId?: string): Promise<void> => {
    try {
      const history = await StorageService.getHistory(userId);
      // Remove word if it already exists to avoid duplicates
      const filteredHistory = history.filter(item => item !== word);
      // Add word to the beginning of the array
      filteredHistory.unshift(word);
      // Limit history to 100 items
      const limitedHistory = filteredHistory.slice(0, 100);
      await StorageService.saveHistory(limitedHistory, userId);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },

  /**
   * Clear history
   * @param userId Optional user ID for user-specific history
   */
  clearHistory: async (userId?: string): Promise<void> => {
    try {
      const key = userId ? `${STORAGE_KEYS.HISTORY}_${userId}` : STORAGE_KEYS.HISTORY;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  /**
   * Save user data to storage
   * @param userId User ID
   * @param email User email
   */
  saveUser: async (userId: string, email: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ id: userId, email }));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  /**
   * Get user data from storage
   * @returns Promise with user data or null if not found
   */
  getUser: async (): Promise<{ id: string; email: string } | null> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Clear user data from storage
   */
  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }
}