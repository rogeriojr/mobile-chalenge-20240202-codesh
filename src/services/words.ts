import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for words dictionary
const WORDS_KEY = '@dictionary_app:words';

// URL to fetch words dictionary
const WORDS_DICTIONARY_URL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';

/**
 * Service for handling words dictionary
 */
export class WordsService {
  // In-memory cache of words
  private static words: string[] | null = null;

  /**
   * Load words dictionary
   * @returns Promise with array of words
   */
  static async loadWords(): Promise<string[]> {
    try {
      // Return from memory if available
      if (this.words) {
        return this.words;
      }

      // Try to get from storage
      const storedWords = await this.getWordsFromStorage();
      if (storedWords) {
        this.words = storedWords;
        return storedWords;
      }

      // Fetch from GitHub if not in storage
      const fetchedWords = await this.fetchWordsFromGithub();
      this.words = fetchedWords;

      // Save to storage for future use
      await this.saveWordsToStorage(fetchedWords);

      return fetchedWords;
    } catch (error) {
      console.error('Error loading words:', error);
      return [];
    }
  }

  /**
   * Get a paginated list of words
   * @param page Page number (0-based)
   * @param pageSize Number of words per page
   * @returns Promise with array of words for the requested page
   */
  static async getWordsPaginated(page: number, pageSize: number): Promise<string[]> {
    try {
      const allWords = await this.loadWords();
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;

      return allWords.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error getting paginated words:', error);
      return [];
    }
  }

  /**
   * Search words by prefix
   * @param prefix Prefix to search for
   * @param limit Maximum number of results
   * @returns Promise with array of matching words
   */
  static async searchWords(prefix: string, limit: number = 20): Promise<string[]> {
    try {
      const allWords = await this.loadWords();
      const lowerPrefix = prefix.toLowerCase();

      return allWords
        .filter(word => word.toLowerCase().startsWith(lowerPrefix))
        .slice(0, limit);
    } catch (error) {
      console.error('Error searching words:', error);
      return [];
    }
  }

  /**
   * Get words from storage
   * @returns Promise with array of words or null if not found
   */
  private static async getWordsFromStorage(): Promise<string[] | null> {
    try {
      const data = await AsyncStorage.getItem(WORDS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting words from storage:', error);
      return null;
    }
  }

  /**
   * Save words to storage
   * @param words Array of words to save
   */
  private static async saveWordsToStorage(words: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(WORDS_KEY, JSON.stringify(words));
    } catch (error) {
      console.error('Error saving words to storage:', error);
    }
  }

  /**
   * Fetch words dictionary from GitHub
   * @returns Promise with array of words
   */
  private static async fetchWordsFromGithub(): Promise<string[]> {
    try {
      const response = await fetch(WORDS_DICTIONARY_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch words dictionary: ${response.status}`);
      }

      const data = await response.json();

      // Convert object keys to array of words
      return Object.keys(data);
    } catch (error) {
      console.error('Error fetching words from GitHub:', error);
      throw error;
    }
  }
}