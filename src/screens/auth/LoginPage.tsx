import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const user = auth.currentUser;

        if (user) {
            navigation.navigate("Dashboard" as never);
        }
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (userCredential) {
            Alert.alert("Success", "Login Successful!", [
                {
                    text: "OK",
                    onPress: () => navigation.navigate("Dashboard" as never),
                },
            ]);
        }

        setLoading(true);
    };
    const handleLoginWithGoogle = async () => {
        setLoading(true);

        try {
            const userCredential = await signInWithPopup(auth, provider);

            if (userCredential) {
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
        <View className="flex-1 p-5 justify-center">
            <View className="w-full flex flex-col gap-10">
                <View>
                    <Text className="text-2xl font-bold mb-5 text-center">
                        Login
                    </Text>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-blue-600 p-4 rounded-md items-center mt-3"
                    >
                        <Text className="text-white text-base font-bold">
                            Login
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="flex flex-col gap-10">
                    <View className="border border-b w-full"></View>
                    <TouchableOpacity
                        className="flex flex-col gap-10 items-center justify-center"
                        onPress={handleLoginWithGoogle}
                    >
                        <Text>Login with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginPage;
