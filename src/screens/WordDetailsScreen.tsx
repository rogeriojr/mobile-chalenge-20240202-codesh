import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useApp } from '../contexts/AppContext';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

type WordDetailsScreenRouteProp = RouteProp<RootStackParamList, 'WordDetails'>;
type WordDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WordDetails'>;

/**
 * Word details screen component
 */
export const WordDetailsScreen: React.FC = () => {
  const route = useRoute<WordDetailsScreenRouteProp>();
  const navigation = useNavigation<WordDetailsScreenNavigationProp>();
  const { word } = route.params;
  
  const { 
    currentWord, 
    wordDefinition, 
    isLoading, 
    error, 
    isFavorite, 
    addFavorite, 
    removeFavorite,
    searchWord,
  } = useApp();

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Load word definition if not already loaded
  useEffect(() => {
    if (!currentWord || currentWord !== word) {
      searchWord(word);
    }
  }, [word, currentWord, searchWord]);

  // Find audio URL from phonetics
  useEffect(() => {
    if (wordDefinition && wordDefinition.length > 0) {
      const phonetics = wordDefinition[0].phonetics || [];
      const audioPhonetic = phonetics.find(p => p.audio && p.audio.trim() !== '');
      
      if (audioPhonetic && audioPhonetic.audio) {
        setAudioUrl(audioPhonetic.audio);
      } else {
        setAudioUrl(null);
      }
    }
  }, [wordDefinition]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Play pronunciation audio
  const playPronunciation = async () => {
    if (!audioUrl) return;

    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);
      
      // Listen for playback status
      newSound.setOnPlaybackStatusUpdate((status: Audio.AVPlaybackStatus) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = () => {
    if (isFavorite(word)) {
      removeFavorite(word);
    } else {
      addFavorite(word);
    }
  };

  // Open source URL
  const openSourceUrl = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  if (isLoading) {
    return <LoadingIndicator message="Loading word details..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!wordDefinition || wordDefinition.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="help-outline" size={64} color={theme.colors.warning} />
        <Text style={styles.errorText}>No definition found for "{word}"</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const definition = wordDefinition[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{word}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleToggleFavorite}
        >
          <MaterialIcons 
            name={isFavorite(word) ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorite(word) ? theme.colors.favorite : theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.wordSection}>
          <Text style={styles.wordTitle}>{definition.word}</Text>
          {definition.phonetic && (
            <View style={styles.phoneticContainer}>
              <Text style={styles.phonetic}>{definition.phonetic}</Text>
              {audioUrl && (
                <TouchableOpacity 
                  style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]} 
                  onPress={playPronunciation}
                  disabled={isPlaying}
                >
                  <MaterialIcons 
                    name={isPlaying ? "volume-up" : "volume-up"} 
                    size={20} 
                    color={isPlaying ? theme.colors.primary : theme.colors.text} 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {definition.meanings.map((meaning, index) => (
          <View key={`${meaning.partOfSpeech}-${index}`} style={styles.meaningSection}>
            <Text style={styles.partOfSpeech}>{meaning.partOfSpeech}</Text>
            
            <Text style={styles.sectionTitle}>Definitions:</Text>
            {meaning.definitions.map((def, defIndex) => (
              <View key={`def-${defIndex}`} style={styles.definitionItem}>
                <Text style={styles.definitionNumber}>{defIndex + 1}.</Text>
                <View style={styles.definitionContent}>
                  <Text style={styles.definition}>{def.definition}</Text>
                  
                  {def.example && (
                    <Text style={styles.example}>
                      <Text style={styles.exampleLabel}>Example: </Text>
                      {def.example}
                    </Text>
                  )}
                  
                  {def.synonyms.length > 0 && (
                    <Text style={styles.synonyms}>
                      <Text style={styles.synonymsLabel}>Synonyms: </Text>
                      {def.synonyms.join(', ')}
                    </Text>
                  )}
                  
                  {def.antonyms.length > 0 && (
                    <Text style={styles.antonyms}>
                      <Text style={styles.antonymsLabel}>Antonyms: </Text>
                      {def.antonyms.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            
            {meaning.synonyms.length > 0 && (
              <View style={styles.synonymsSection}>
                <Text style={styles.sectionTitle}>Synonyms:</Text>
                <Text style={styles.synonymsList}>{meaning.synonyms.join(', ')}</Text>
              </View>
            )}
            
            {meaning.antonyms.length > 0 && (
              <View style={styles.antonymsSection}>
                <Text style={styles.sectionTitle}>Antonyms:</Text>
                <Text style={styles.antonymsList}>{meaning.antonyms.join(', ')}</Text>
              </View>
            )}
          </View>
        ))}

        {definition.sourceUrls && definition.sourceUrls.length > 0 && (
          <View style={styles.sourceSection}>
            <Text style={styles.sectionTitle}>Source:</Text>
            {definition.sourceUrls.map((url, index) => (
              <TouchableOpacity 
                key={`source-${index}`} 
                onPress={() => openSourceUrl(url)}
                style={styles.sourceLink}
              >
                <Text style={styles.sourceLinkText} numberOfLines={1}>{url}</Text>
                <MaterialIcons name="open-in-new" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.lg,
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
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  wordSection: {
    marginBottom: theme.spacing.lg,
  },
  wordTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  phonetic: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  audioButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  audioButtonPlaying: {
    backgroundColor: theme.colors.secondary + '20',
  },
  meaningSection: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  partOfSpeech: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  definitionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  definitionNumber: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
    width: 20,
  },
  definitionContent: {
    flex: 1,
  },
  definition: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  example: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  exampleLabel: {
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  synonyms: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  synonymsLabel: {
    fontWeight: 'bold',
  },
  antonyms: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  antonymsLabel: {
    fontWeight: 'bold',
  },
  synonymsSection: {
    marginTop: theme.spacing.md,
  },
  synonymsList: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  antonymsSection: {
    marginTop: theme.spacing.md,
  },
  antonymsList: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  sourceSection: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  sourceLinkText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small,
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  }