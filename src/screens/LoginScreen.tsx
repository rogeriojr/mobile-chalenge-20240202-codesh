import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppContext";
import { theme } from "../theme";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { StorageService } from "../services/storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

/**
 * Login screen component
 */
export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Test user credentials
  const TEST_USER = {
    email: "teste@email.com",
    password: "123456",
  };

  useEffect(() => {
    // Check if there's a user in storage and redirect if found
    const checkUser = async () => {
      const userData = await StorageService.getUser();
      if (userData) {
        // If user exists, login automatically
        console.log("usuário  encontrado!");
        try {
          await login(userData.email, "123456"); // Using default password for auto-login
        } catch (error) {
          console.error("Auto-login error:", error);
        }
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert(t("common.error"), t("login.email"));
      return;
    }

    if (!password.trim()) {
      Alert.alert(t("common.error"), t("login.password"));
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert(t("common.error"), t("login.loginError"));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fill test user credentials and login automatically
  const useTestUser = async () => {
    setEmail(TEST_USER.email);
    setPassword(TEST_USER.password);

    // Execute login directly instead of using setTimeout
    try {
      setIsLoading(true);
      await login(TEST_USER.email, TEST_USER.password);
      // Redirect to Home screen after successful login
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(t("common.error"), t("login.loginError"));
      console.error("Test user login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle language
  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "pt" ? "en" : "pt";
    await i18n.changeLanguage(newLang);
    await StorageService.saveLanguage(newLang);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <MaterialIcons name="book" size={64} color={theme.colors.primary} />
          <Text style={styles.title}>{t("home.title")}</Text>
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
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={24}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={24}
              color={theme.colors.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "..." : t("login.title")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.testUserButton} onPress={useTestUser}>
            <MaterialIcons
              name="person"
              size={20}
              color={theme.colors.info}
              style={styles.testUserIcon}
            />
            <Text style={styles.testUserButtonText}>
              {t("login.useTestUser")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    padding: theme.spacing.xl,
    paddingTop: Platform.OS === "ios" ? 100 : 60,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
    ...theme.shadows.medium,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    color: "white",
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
  },
  languageButton: {
    padding: theme.spacing.xs,
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: theme.spacing.sm,
  },
  langText: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.info,
    fontWeight: "bold",
  },
  testUserButton: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  testUserButtonText: {
    color: theme.colors.info,
    fontSize: theme.typography.fontSize.md,
    textDecorationLine: "underline",
    marginLeft: theme.spacing.xs,
  },
  testUserIcon: {
    marginRight: theme.spacing.xs,
  },
});
