import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    BackHandler,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

type ErrorPageProps = {
    error?: { message?: string } | null;
    resetError?: () => void;
};

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetError }) => {
    const { colors, isDarkMode } = useTheme();

    const handleReturnToSafety = () => {
        if (resetError) {
            resetError();
        }

        BackHandler.exitApp();
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.errorBox,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    },
                ]}
            >
                <View
                    style={[
                        styles.iconContainer,
                        { borderColor: colors.danger },
                    ]}
                >
                    <Text
                        style={[styles.negativeIcon, { color: colors.danger }]}
                    >
                        !
                    </Text>
                </View>
                <Text style={[styles.errorTitle, { color: colors.danger }]}>
                    Oops! Something went wrong
                </Text>
                <Text
                    style={[
                        styles.errorMessage,
                        { color: colors.textSecondary },
                    ]}
                >
                    {error?.message || "An unexpected error occurred"}
                </Text>
                <View style={styles.actionsContainer}>
                    {resetError && (
                        <TouchableOpacity
                            style={[
                                styles.buttonContainer,
                                {
                                    backgroundColor: colors.accent,
                                    marginRight: 8,
                                },
                            ]}
                            onPress={resetError}
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.buttonContainer,
                            { backgroundColor: colors.primary },
                        ]}
                        onPress={handleReturnToSafety}
                    >
                        <Text style={styles.buttonText}>Restart App</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorBox: {
        borderRadius: 12,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 1,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    negativeIcon: {
        fontSize: 50,
        fontWeight: "bold",
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    errorMessage: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 22,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    buttonContainer: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        flex: 1,
        maxWidth: "45%",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default ErrorPage;
