import { createContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const getInitialTheme = (): Theme => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") as Theme | null;
            if (savedTheme) {
                return savedTheme;
            }

            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;
            return prefersDark ? "dark" : "light";
        }

        return "light";
    };
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");
        root.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
