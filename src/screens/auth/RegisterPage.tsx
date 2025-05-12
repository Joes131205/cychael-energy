import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
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

    const handleRegisterWithGoogle = async () => {
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
                <View className="w-full">
                    <Text className="text-2xl font-bold mb-5 text-center">
                        Register
                    </Text>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-base mb-1">Confirm Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-md p-2.5 text-base"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your password"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-blue-600 p-4 rounded-md items-center mt-3"
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text className="text-white text-base font-bold">
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="flex flex-col gap-10">
                    <View className="border border-b w-full"></View>
                    <TouchableOpacity
                        className="flex flex-col gap-10 items-center justify-center"
                        onPress={handleRegisterWithGoogle}
                    >
                        <Text>Register with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Register;
