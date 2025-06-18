import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    BackHandler,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/Navigation";

type NotFoundPageProps = {
    message?: string;
    goBack?: () => void;
};

const NotFoundPage: React.FC<NotFoundPageProps> = ({
    message = "The page you're looking for doesn't exist or has been moved",
    goBack,
}) => {
    const { colors, isDarkMode } = useTheme();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleGoHome = () => {
        try {
            // Try to navigate to home
            navigation.reset({
                index: 0,
                routes: [{ name: "LandingPage" }],
            });
        } catch (error) {
            // Fallback to exiting the app if navigation fails
            BackHandler.exitApp();
        }
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
                        { borderColor: colors.warning },
                    ]}
                >
                    <Text
                        style={[styles.notFoundIcon, { color: colors.warning }]}
                    >
                        404
                    </Text>
                </View>
                <Text style={[styles.errorTitle, { color: colors.warning }]}>
                    Page Not Found
                </Text>
                <Text
                    style={[
                        styles.errorMessage,
                        { color: colors.textSecondary },
                    ]}
                >
                    {message}
                </Text>
                <View style={styles.actionsContainer}>
                    {goBack && (
                        <TouchableOpacity
                            style={[
                                styles.buttonContainer,
                                {
                                    backgroundColor: colors.accent,
                                    marginRight: 8,
                                },
                            ]}
                            onPress={goBack}
                        >
                            <Text style={styles.buttonText}>Go Back</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[
                            styles.buttonContainer,
                            { backgroundColor: colors.primary },
                        ]}
                        onPress={handleGoHome}
                    >
                        <Text style={styles.buttonText}>Go to Home</Text>
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
    notFoundIcon: {
        fontSize: 22,
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

export default NotFoundPage;
