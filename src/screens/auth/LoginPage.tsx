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
import { auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../navigation/Navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../../hooks/useTheme";
import { useUser } from "../../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";

type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Login"
>;

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { colors, isDarkMode } = useTheme();
    const { user } = useUser();

    const navigation = useNavigation<LoginScreenNavigationProp>();

    useEffect(() => {
        if (user) {
            navigation.replace("Dashboard");
        }
    }, [user, navigation]);

    const handleLogin = async () => {
        setLoading(true);

        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            if (userCredential) {
                Alert.alert("Success", "Login Successful!", [
                    {
                        text: "OK",
                        onPress: () =>
                            navigation.navigate("Dashboard" as never),
                    },
                ]);
            }
        } catch (error) {
            let errorMessage = "Login failed";

            const errorCode = (error as any).code;
            switch (errorCode) {
                case "auth/invalid-email":
                    errorMessage = "Invalid email format.";
                    break;
                case "auth/user-disabled":
                    errorMessage = "This account has been disabled.";
                    break;
                case "auth/user-not-found":
                    errorMessage = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Incorrect password.";
                    break;
                case "auth/too-many-requests":
                    errorMessage =
                        "Too many failed login attempts. Please try again later.";
                    break;
                case "auth/network-request-failed":
                    errorMessage =
                        "Network error. Please check your connection.";
                    break;
                default:
                    if (
                        error &&
                        typeof error === "object" &&
                        "message" in error
                    ) {
                        errorMessage = `Login failed: ${
                            (error as { message: string }).message
                        }`;
                    } else {
                        errorMessage = "Login failed: Unknown error";
                    }
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
                    ? [colors.background, colors.background]
                    : [colors.background, "#DFFFF8"]
            }
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Welcome Back
                    </Text>
                    <Text
                        style={[
                            styles.subtitle,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Login to your Cychael account
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

                    <View>
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
                            placeholder="Password"
                            placeholderTextColor={colors.textSecondary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? "eye" : "eye-off"}
                                size={24}
                                color={
                                    isDarkMode
                                        ? "#6B7280"
                                        : colors.textSecondary
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: loading
                                    ? "#C4C4C4"
                                    : colors.accent,
                            },
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text
                            style={[styles.buttonText, { color: colors.text }]}
                        >
                            {loading ? "Signing In..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Register")}
                        style={styles.switchAuth}
                    >
                        <Text
                            style={[
                                styles.switchAuthText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Don't have an account?{" "}
                            <Text
                                style={[
                                    styles.switchAuthHighlight,
                                    { color: colors.accent },
                                ]}
                            >
                                Register
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
    forgotPasswordContainer: {
        alignSelf: "flex-end",
        marginBottom: 15,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: "500",
    },
    eyeIcon: {
        position: "absolute",
        right: 15,
        top: 13,
        height: 24,
        width: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        position: "relative",
        marginBottom: 0,
    },
});

export default LoginPage;
