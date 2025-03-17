import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL
const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// Cache key prefix
const CACHE_PREFIX = '@dictionary_app:cache:';

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Interface for word definition response
 */
export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

/**
 * Service for handling API requests
 */
export class ApiService {
  /**
   * Get word definition from API with caching
   * @param word Word to get definition for
   * @returns Promise with word definition
   */
  static async getWordDefinition(word: string): Promise<WordDefinition[]> {
    try {
      // Check cache first
      const cachedData = await this.getFromCache(word);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await fetch(`${API_BASE_URL}${encodeURIComponent(word)}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Save to cache
      await this.saveToCache(word, data);
      
      return data;
    } catch (error) {
      console.error('Error fetching word definition:', error);
      throw error;
    }
  }

  /**
   * Get data from cache
   * @param word Word to get from cache
   * @returns Promise with cached data or null if not found or expired
   */
  private static async getFromCache(word: string): Promise<WordDefinition[] | null> {
    try {
      const cacheKey = `${CACHE_PREFIX}${word}`;
      const cachedItem = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedItem) {
        return null;
      }
      
      const { data, timestamp } = JSON.parse(cachedItem);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRATION) {
        // Remove expired cache
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  /**
   * Save data to cache
   * @param word Word to save to cache
   * @param data Data to save
   */
  private static async saveToCache(word: string, data: WordDefinition[]): Promise<void> {
    try {
      const cacheKey = `${CACHE_PREFIX}${word}`;
      const cacheItem = {
        data,
        timestamp: Date.now(),
      };
      
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
}