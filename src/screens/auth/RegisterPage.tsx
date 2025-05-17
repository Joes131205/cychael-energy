import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { app, auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../navigation/Navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useTheme } from "../../hooks/useTheme";

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Register"
>;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { colors, isDarkMode } = useTheme();

    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            navigation.navigate("Dashboard" as never);
        }
    }, []);

    const handleRegister = async () => {
        if (!name) {
            Alert.alert("Error", "Please enter your name");
            return;
        }

        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password should be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (userCredential) {
                await updateProfile(userCredential.user, {
                    displayName: name,
                });

                Alert.alert("Success", "Registration successful!", [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.navigate("Dashboard" as never),
                    },
                ]);
            }
        } catch (error: any) {
            let errorMessage = "Registration failed";

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Email is already in use";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Password is too weak";
            }

            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={
                isDarkMode
                    ? [colors.background, "#101820"] // Darker gradient for dark mode
                    : [colors.background, "#E0F2EF"]
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
                        Create Account
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Join Cychael of Energy
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: isDarkMode
                                    ? colors.border
                                    : "#E0E0E0",
                                backgroundColor: isDarkMode
                                    ? "#1E2429"
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                        placeholder="Full Name"
                        placeholderTextColor={
                            isDarkMode ? "#6B7280" : colors.textSecondary
                        }
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: isDarkMode
                                    ? colors.border
                                    : "#E0E0E0",
                                backgroundColor: isDarkMode
                                    ? "#1E2429"
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                        placeholder="Email Address"
                        placeholderTextColor={
                            isDarkMode ? "#6B7280" : colors.textSecondary
                        }
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: isDarkMode
                                    ? colors.border
                                    : "#E0E0E0",
                                backgroundColor: isDarkMode
                                    ? "#1E2429"
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                        placeholder="Password"
                        placeholderTextColor={
                            isDarkMode ? "#6B7280" : colors.textSecondary
                        }
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: isDarkMode
                                    ? colors.border
                                    : "#E0E0E0",
                                backgroundColor: isDarkMode
                                    ? "#1E2429"
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                        placeholder="Confirm Password"
                        placeholderTextColor={
                            isDarkMode ? "#6B7280" : colors.textSecondary
                        }
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: loading
                                    ? isDarkMode
                                        ? "#4B5563"
                                        : "#C4C4C4"
                                    : isDarkMode
                                    ? "#60A5FA"
                                    : colors.accent,
                            },
                        ]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                {
                                    color: isDarkMode
                                        ? "#FFFFFF"
                                        : colors.primary,
                                },
                            ]}
                        >
                            {loading ? "Creating Account..." : "Register"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={styles.switchAuth}
                    >
                        <Text
                            style={[
                                styles.switchAuthText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Already have an account?{" "}
                            <Text
                                style={[
                                    styles.switchAuthHighlight,
                                    {
                                        color: isDarkMode
                                            ? "#60A5FA"
                                            : colors.secondary,
                                    },
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
        fontSize: 18,
        fontWeight: "600",
    },
    switchAuth: {
        marginTop: 20,
        alignItems: "center",
    },
    switchAuthText: {},
    switchAuthHighlight: {
        fontWeight: "600",
    },
});

export default Register;
