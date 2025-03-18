import React from "react";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native/Libraries/Components/View/View";
import { TouchableOpacity } from "react-native/Libraries/Components/Touchable/TouchableOpacity";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../theme";

interface WordCardProps {
  word: string;
  onPress: (word: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (word: string) => void;
}

/**
 * Component for displaying a word card in the list
 */
export const WordCard: React.FC<WordCardProps> = ({
  word,
  onPress,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(word)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.word}>{word}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onToggleFavorite(word)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <MaterialIcons
          name={isFavorite ? "favorite" : "favorite-border"}
          size={24}
          color={
            isFavorite ? theme.colors.favorite : theme.colors.textSecondary
          }
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  content: {
    flex: 1,
  },
  word: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  favoriteButton: {
    padding: theme.spacing.xs,
  },
});
