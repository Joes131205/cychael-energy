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
    primary: "#283F3B",
    secondary: "#99DDC8",
    background: "#F5F9F8",
    card: "#FFFFFF",
    iconSecondary: "#000000",
    text: "#283F3B",
    textSecondary: "#5A7A74",
    border: "#D0E0DD",
    success: "#4CAF50",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#D2D229",
};

export const darkColors: ThemeColors = {
    primary: "#99DDC8",
    secondary: "#1A2E2A",
    iconSecondary: "#FFFFFF",
    background: "#121C1A",
    card: "#1E2C29",
    text: "#E0F2EF",
    textSecondary: "#A0BCB7",
    border: "#2E3E3B",
    success: "#4CAF50",
    danger: "#EF4444",
    warning: "#F59E0B",
    accent: "#198754",
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
