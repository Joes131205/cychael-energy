import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordPage = () => {
    const { colors, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                "Password Reset Email Sent",
                "Check your email for instructions to reset your password",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            let message = "Failed to send password reset email.";
            if (error.code === "auth/user-not-found") {
                message = "No user found with this email address.";
            } else if (error.code === "auth/invalid-email") {
                message = "Please provide a valid email address.";
            }
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={
                isDarkMode
                    ? [colors.background, "#071510"] // Darker gradient for dark mode
                    : [colors.background, "#DFFFF8"]
            }
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.card,
                            shadowColor: isDarkMode
                                ? "rgba(0, 0, 0, 0)"
                                : "rgba(0, 0, 0, 0.2)",
                        },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        Reset Password
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Enter your email to receive password reset instructions
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: colors.border,
                                backgroundColor: isDarkMode
                                    ? colors.background
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                        placeholder="Email Address"
                        placeholderTextColor={colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: loading
                                    ? "#C4C4C4"
                                    : colors.accent,
                            },
                        ]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                            {loading ? "Sending..." : "Reset Password"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.switchAuth}
                    >
                        <Text
                            style={[
                                styles.switchAuthText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Remember your password?{" "}
                            <Text
                                style={[
                                    styles.switchAuthHighlight,
                                    { color: colors.accent },
                                ]}
                            >
                                Login
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    card: {
        borderRadius: 20,
        padding: 30,
        marginHorizontal: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 5,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    switchAuth: {
        marginTop: 20,
        alignItems: "center",
    },
    switchAuthText: {
        fontSize: 14,
    },
    switchAuthHighlight: {
        fontWeight: "600",
    },
});

export default ForgotPasswordPage;
