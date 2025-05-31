import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
    disabled?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = "primary",
    disabled = false,
}: ButtonProps) {
    const { colors, isDarkMode } = useTheme();    const getButtonStyle = () => {
        switch (variant) {
            case "primary":
                // Slightly darker accent color for light mode for better text contrast
                return { 
                    backgroundColor: isDarkMode ? colors.accent : "#2A8A46"
                };
            case "secondary":
                return {
                    backgroundColor: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                    borderWidth: 1,
                    borderColor: isDarkMode ? colors.text : colors.secondary,
                };
            case "danger":
                return { backgroundColor: colors.danger };
            default:
                return { backgroundColor: isDarkMode ? colors.accent : "#2A8A46" };
        }
    };const getTextStyle = () => {
        if (variant === "secondary") {
            return { color: isDarkMode ? colors.text : colors.primary };
        }

        if (variant === "danger") {
            return { color: "#FFFFFF" };
        }
        
        // For primary buttons - white text on both light and dark modes
        return { color: "#FFFFFF" };
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getButtonStyle(),
                disabled && { opacity: 0.5 },
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    text: {
        fontWeight: "600",
        fontSize: 16,
    },
});
