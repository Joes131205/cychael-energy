import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import NavBarComponent from "./components/NavBarComponent";
import { ThemeProvider } from "./context/themeContext";
import { useTheme } from "./hooks/useTheme";
import { useUser } from "./hooks/useUser";
import "../global.css";
import { UserProvider } from "./context/userContext";
import ErrorBoundary from "./components/ErrorBoundary";

const ThemedApp = () => {
    const { theme, colors, isDarkMode } = useTheme();
    const { user, loading } = useUser();

    const navigationTheme = {
        ...(isDarkMode ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
            notification: colors.accent,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <AppNavigator />
                {!loading && user && <NavBarComponent />}
            </View>
        </NavigationContainer>
    );
};

export default function App() {
    // useEffect(() => {
    //     NavigationBar.setVisibilityAsync("hidden");
    //     NavigationBar.setBehaviorAsync("inset-swipe");
    // }, []);

    return (
        <UserProvider>
            <ThemeProvider>
                <ErrorBoundary>
                    <ThemedApp />
                </ErrorBoundary>
            </ThemeProvider>
        </UserProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
