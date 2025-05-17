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
    const { colors, isDarkMode } = useTheme();

    const getButtonStyle = () => {
        switch (variant) {
            case "primary":
                return { backgroundColor: colors.accent };
            case "secondary":
                return {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.secondary,
                };
            case "danger":
                return { backgroundColor: colors.danger };
            default:
                return { backgroundColor: colors.accent };
        }
    };

    const getTextStyle = () => {
        if (variant === "secondary") {
            return { color: colors.secondary };
        }
        return { color: variant === "danger" ? "#FFFFFF" : colors.primary };
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

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 8,
    },
    text: {
        fontWeight: "600",
        fontSize: 16,
    },
});
