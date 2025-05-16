import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from "../../navigation/Navigation";
import { StackNavigationProp } from '@react-navigation/stack';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // const navigation = useNavigation();
    const navigation = useNavigation<LoginScreenNavigationProp>();

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            navigation.navigate("Dashboard" as never);
        }
    }, []);

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
                    if (error && typeof error === "object" && "message" in error) {
                        errorMessage = `Login failed: ${(error as { message: string }).message}`;
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
        <LinearGradient colors={['#F5F9F8', '#E0F2EF']} style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Login to your Cychael account</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#95A3A1"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#95A3A1"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Signing In..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Register')}
                        style={styles.switchAuth}
                    >
                        <Text style={styles.switchAuthText}>
                            Don't have an account? <Text style={styles.switchAuthHighlight}>Register</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );

    // return (
    //     <View className="flex-1 p-5 justify-center">
    //         <View className="w-full flex flex-col gap-10">
    //             <View>
    //                 <Text className="text-2xl font-bold mb-5 text-center">
    //                     Login
    //                 </Text>

    //                 <View className="mb-4">
    //                     <Text className="text-base mb-1">Email</Text>
    //                     <TextInput
    //                         className="border border-gray-300 rounded-md p-2.5 text-base"
    //                         placeholder="Enter your email"
    //                         value={email}
    //                         onChangeText={setEmail}
    //                         keyboardType="email-address"
    //                         autoCapitalize="none"
    //                     />
    //                 </View>

    //                 <View className="mb-4">
    //                     <Text className="text-base mb-1">Password</Text>
    //                     <TextInput
    //                         className="border border-gray-300 rounded-md p-2.5 text-base"
    //                         placeholder="Enter your password"
    //                         value={password}
    //                         onChangeText={setPassword}
    //                         secureTextEntry
    //                     />
    //                 </View>

    //                 <TouchableOpacity
    //                     onPress={handleLogin}
    //                     disabled={loading}
    //                     className="bg-blue-600 disabled:bg-gray-500 p-4 rounded-md items-center mt-3"
    //                 >
    //                     <Text className="text-white text-base font-bold">
    //                         {loading ? "Waiting..." : "Login"}
    //                     </Text>
    //                 </TouchableOpacity>
    //             </View>
    //             {/* <View className="flex flex-col gap-10">
    //                 <View className="border border-b w-full"></View>
    //                 <TouchableOpacity
    //                     className="flex flex-col gap-10 items-center justify-center"
    //                     onPress={handleLoginWithGoogle}
    //                 >
    //                     <Text>Login with Google</Text>
    //                 </TouchableOpacity>
    //             </View> */}
    //         </View>
    //     </View>
    // );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        marginHorizontal: 20,
        shadowColor: '#283F3B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#283F3B',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#5A7A74',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#D0E0DD',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#FAFDFC',
        color: '#283F3B',
    },
    button: {
        backgroundColor: '#D2D229',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#C4C4C4',
    },
    buttonText: {
        color: '#283F3B',
        fontSize: 18,
        fontWeight: '600',
    },
    switchAuth: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchAuthText: {
        color: '#5A7A74',
    },
    switchAuthHighlight: {
        color: '#99DDC8',
        fontWeight: '600',
    },
});

export default LoginPage;
