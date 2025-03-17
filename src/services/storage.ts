import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_PREFIX = '@dictionary_app:';
const FAVORITES_KEY = `${STORAGE_PREFIX}favorites`;
const HISTORY_KEY = `${STORAGE_PREFIX}history`;
const USER_KEY = `${STORAGE_PREFIX}user`;

/**
 * Service for handling local storage operations
 */
export class StorageService {
  /**
   * Get favorites from storage
   * @param userId Optional user ID for user-specific favorites
   * @returns Promise with array of favorite words
   */
  static async getFavorites(userId?: string): Promise<string[]> {
    try {
      const key = userId ? `${FAVORITES_KEY}_${userId}` : FAVORITES_KEY;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Save favorites to storage
   * @param favorites Array of favorite words
   * @param userId Optional user ID for user-specific favorites
   */
  static async saveFavorites(favorites: string[], userId?: string): Promise<void> {
    try {
      const key = userId ? `${FAVORITES_KEY}_${userId}` : FAVORITES_KEY;
      await AsyncStorage.setItem(key, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Add word to favorites
   * @param word Word to add to favorites
   * @param userId Optional user ID for user-specific favorites
   */
  static async addFavorite(word: string, userId?: string): Promise<void> {
    try {
      const favorites = await this.getFavorites(userId);
      if (!favorites.includes(word)) {
        favorites.push(word);
        await this.saveFavorites(favorites, userId);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  }

  /**
   * Remove word from favorites
   * @param word Word to remove from favorites
   * @param userId Optional user ID for user-specific favorites
   */
  static async removeFavorite(word: string, userId?: string): Promise<void> {
    try {
      const favorites = await this.getFavorites(userId);
      const updatedFavorites = favorites.filter(favorite => favorite !== word);
      await this.saveFavorites(updatedFavorites, userId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }

  /**
   * Check if word is in favorites
   * @param word Word to check
   * @param userId Optional user ID for user-specific favorites
   * @returns Promise with boolean indicating if word is in favorites
   */
  static async isFavorite(word: string, userId?: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(userId);
      return favorites.includes(word);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  /**
   * Get history from storage
   * @param userId Optional user ID for user-specific history
   * @returns Promise with array of history words
   */
  static async getHistory(userId?: string): Promise<string[]> {
    try {
      const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Save history to storage
   * @param history Array of history words
   * @param userId Optional user ID for user-specific history
   */
  static async saveHistory(history: string[], userId?: string): Promise<void> {
    try {
      const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
      await AsyncStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  /**
   * Add word to history
   * @param word Word to add to history
   * @param userId Optional user ID for user-specific history
   */
  static async addToHistory(word: string, userId?: string): Promise<void> {
    try {
      const history = await this.getHistory(userId);
      // Remove word if it already exists to avoid duplicates
      const filteredHistory = history.filter(item => item !== word);
      // Add word to the beginning of the array
      filteredHistory.unshift(word);
      // Limit history to 100 items
      const limitedHistory = filteredHistory.slice(0, 100);
      await this.saveHistory(limitedHistory, userId);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  }

  /**
   * Clear history
   * @param userId Optional user ID for user-specific history
   */
  static async clearHistory(userId?: string): Promise<void> {
    try {
      const key = userId ? `${HISTORY_KEY}_${userId}` : HISTORY_KEY;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * Save user data to storage
   * @param userId User ID
   * @param email User email
   */
  static async saveUser(userId: string, email: string): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify({ id: userId, email }));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  /**
   * Get user data from storage
   * @returns Promise with user data or null if not found
   */
  static async getUser(): Promise<{ id: string; email: string } | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Clear user data from storage
   */
  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  }
}