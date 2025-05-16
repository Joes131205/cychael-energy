import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";
import Button from "./common/Button";

const NavBarComponent = () => {
    const navigation = useNavigation();
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    const handleLogOut = async () => {
        await signOut(auth);

        navigation.navigate("Login" as never);
    };
    return (
        <>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View className="px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
                <View className="flex flex-row justify-between items-center w-full">
                    {user ? (
                        <View className="flex flex-row items-center justify-center w-full gap-10">
                            <TouchableOpacity
                                className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                onPress={() =>
                                    navigation.navigate("Dashboard" as never)
                                }
                            >
                                <Ionicons
                                    name="home-outline"
                                    size={30}
                                    color="#000000"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                onPress={() =>
                                    navigation.navigate("Settings" as never)
                                }
                            >
                                <Ionicons
                                    name="bar-chart-outline"
                                    size={30}
                                    color="#000000"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                onPress={() =>
                                    navigation.navigate(
                                        "EnergyInputPage" as never
                                    )
                                }
                            >
                                <Ionicons
                                    name="calculator-outline"
                                    size={30}
                                    color="#000000"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                onPress={() =>
                                    navigation.navigate("Settings" as never)
                                }
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={30}
                                    color="#000000"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex flex-row space-x-3">
                            <TouchableOpacity
                                className="px-4 py-2 border border-blue-600 rounded-full"
                                onPress={() =>
                                    navigation.navigate("Login" as never)
                                }
                            >
                                <Text className="text-blue-600 font-medium">
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="px-4 py-2 bg-blue-600 rounded-full"
                                onPress={() =>
                                    navigation.navigate("Register" as never)
                                }
                            >
                                <Text className="text-white font-medium">
                                    Register
                                </Text>
                            </TouchableOpacity>

                            {/* For Debugging */}
                            <TouchableOpacity
                                className="px-4 py-2 bg-green-600 rounded-full"
                                onPress={() =>
                                    navigation.navigate(
                                        "EnergyInputPage" as never
                                    )
                                }
                            >
                                <Text className="text-white font-medium">
                                    Debug Input
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

export default NavBarComponent;
