import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark";

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    iconSecondary: string;
    border: string;
    success: string;
    danger: string;
    warning: string;
    accent: string;
}

export interface ThemeContextType {
    theme: ThemeType;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (newTheme: ThemeType) => void;
    isDarkMode: boolean;
}

export const lightColors: ThemeColors = {
    primary: "#1E6F5C",
    secondary: "#29BB89",
    background: "#F8FBFA",
    card: "#FFFFFF",
    iconSecondary: "#1A1A1A",
    text: "#1E3A34",
    textSecondary: "#4D7268",
    border: "#DFEEEA",
    success: "#2ECC71",
    danger: "#E74C3C",
    warning: "#F39C12",
    accent: "#34A853",
};

export const darkColors: ThemeColors = {
    primary: "#29BB89",
    secondary: "#1A3C34",
    iconSecondary: "#FFFFFF",
    background: "#0A1A17",
    card: "#142824",
    text: "#E0F5F2",
    textSecondary: "#A8D3C9",
    border: "#244039",
    success: "#2ECC71",
    danger: "#E74C3C",
    warning: "#F39C12",
    accent: "#34A853",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setThemeState] = useState<ThemeType>("light");
    const isDarkMode = theme === "dark";
    const colors = isDarkMode ? darkColors : lightColors;

    useEffect(() => {
        const getTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem("theme");
                if (
                    savedTheme &&
                    (savedTheme === "light" || savedTheme === "dark")
                ) {
                    setThemeState(savedTheme);
                }
            } catch (error) {
                console.log("Error loading theme:", error);
            }
        };
        getTheme();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setThemeState(newTheme);
        AsyncStorage.setItem("theme", newTheme);
    };

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        AsyncStorage.setItem("theme", newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{ theme, colors, toggleTheme, setTheme, isDarkMode }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
