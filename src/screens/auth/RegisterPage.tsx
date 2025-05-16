import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import { app, auth } from "../../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from "../../navigation/Navigation";
import { StackNavigationProp } from '@react-navigation/stack';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

import {
    createUserWithEmailAndPassword,
    // signInWithPopup,
    // signInWithRedirect,
    updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // const navigation = useNavigation();
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
        <LinearGradient colors={['#F5F9F8', '#E0F2EF']} style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Cychael of Energy</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#95A3A1"
                        value={name}
                        onChangeText={setName}
                    />

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

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#95A3A1"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Creating Account..." : "Register"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Login')}
                        style={styles.switchAuth}
                    >
                        <Text style={styles.switchAuthText}>
                            Already have an account? <Text style={styles.switchAuthHighlight}>Login</Text>
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

export default Register;

                        
                            // return (
                            //     <View className="flex-1 p-5 justify-center">
                            //         <View className="w-full flex flex-col gap-10">
                            //             <View className="w-full">
                            //                 <Text className="text-2xl font-bold mb-5 text-center">
                            //                     Register
                            //                 </Text>
                        
                            //                 <View className="mb-4">
                            //                     <Text className="text-base mb-1">Name</Text>
                            //                     <TextInput
                            //                         className="border border-gray-300 rounded-md p-2.5 text-base"
                            //                         value={name}
                            //                         onChangeText={setName}
                            //                         placeholder="Enter your name"
                            //                     />
                            //                 </View>
                        
                            //                 <View className="mb-4">
                            //                     <Text className="text-base mb-1">Email</Text>
                            //                     <TextInput
                            //                         className="border border-gray-300 rounded-md p-2.5 text-base"
                            //                         value={email}
                            //                         onChangeText={setEmail}
                            //                         placeholder="Enter your email"
                            //                         keyboardType="email-address"
                            //                         autoCapitalize="none"
                            //                     />
                            //                 </View>
                        
                            //                 <View className="mb-4">
                            //                     <Text className="text-base mb-1">Password</Text>
                            //                     <TextInput
                            //                         className="border border-gray-300 rounded-md p-2.5 text-base"
                            //                         value={password}
                            //                         onChangeText={setPassword}
                            //                         placeholder="Enter your password"
                            //                         secureTextEntry
                            //                     />
                            //                 </View>
                        
                            //                 <View className="mb-4">
                            //                     <Text className="text-base mb-1">Confirm Password</Text>
                            //                     <TextInput
                            //                         className="border border-gray-300 rounded-md p-2.5 text-base"
                            //                         value={confirmPassword}
                            //                         onChangeText={setConfirmPassword}
                            //                         placeholder="Confirm your password"
                            //                         secureTextEntry
                            //                     />
                            //                 </View>
                        
                            //                 <TouchableOpacity
                            //                     onPress={handleRegister}
                            //                     disabled={loading}
                            //                     className="bg-blue-600 disabled:bg-gray-500 p-4 rounded-md items-center mt-3"
                            //                 >
                            //                     <Text className="text-white text-base font-bold">
                            //                         {loading ? "Waiting..." : "Register"}
                            //                     </Text>
                            //                 </TouchableOpacity>
                            //             </View>
                            //             {/* <View className="flex flex-col gap-10">
                            //                 <View className="border border-b w-full"></View>
                            //                 <TouchableOpacity
                            //                     className="flex flex-col gap-10 items-center justify-center"
                            //                     onPress={handleRegisterWithGoogle}
                            //                 >
                            //                     <Text>Register with Google</Text>
                            //                 </TouchableOpacity>
                            //             </View> */}
                            //         </View>
                            //     </View>
                            // );