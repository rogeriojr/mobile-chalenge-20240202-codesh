import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider } from "./src/contexts/AppContext";
import { HomeScreen } from "./src/screens/HomeScreen";
import { WordDetailsScreen } from "./src/screens/WordDetailsScreen";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RootStackParamList } from "./src/navigation/types";
import { theme } from "./src/theme";
import { initI18n } from "./src/i18n";
import { LoadingIndicator } from "./src/components/LoadingIndicator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initI18n();
      setIsI18nInitialized(true);
    };
    initialize();
  }, []);

  if (!isI18nInitialized) {
    return <LoadingIndicator message="Loading..." />;
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="WordDetails" component={WordDetailsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
