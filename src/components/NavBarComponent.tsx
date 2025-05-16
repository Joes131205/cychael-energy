import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";

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

    return (
        <>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View className="px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
                <View className="flex flex-row justify-between items-center w-full">
                    <View className="flex-row items-center">
                        {user && (
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("Dashboard" as never)
                                }
                                className="mr-4"
                            >
                                <Ionicons
                                    name="home-outline"
                                    size={24}
                                    color="#4B5563"
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {user ? (
                        <View className="flex flex-row items-center">
                            <TouchableOpacity
                                className="px-3 py-2 mr-3 rounded-full"
                                onPress={() =>
                                    navigation.navigate(
                                        "DeviceAnalysis" as never
                                    )
                                }
                            >
                                <Ionicons
                                    name="hardware-chip-outline"
                                    size={22}
                                    color="#4B5563"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="px-3 py-2 mr-3 rounded-full"
                                onPress={() =>
                                    navigation.navigate("EnergyTips" as never)
                                }
                            >
                                <Ionicons
                                    name="bulb-outline"
                                    size={22}
                                    color="#4B5563"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="px-3 py-2 mr-3 rounded-full"
                                onPress={() =>
                                    navigation.navigate(
                                        "SolarSimulator" as never
                                    )
                                }
                            >
                                <Ionicons
                                    name="sunny-outline"
                                    size={22}
                                    color="#4B5563"
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
                                onPress={() => navigation.navigate("EnergyInputPage" as never)}
                            >
                                <Text className="text-white font-medium">Debug Input</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
};

export default NavBarComponent;
