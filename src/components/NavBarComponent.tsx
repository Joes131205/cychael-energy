import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";
import Button from "./common/Button";
import { useTheme } from "../hooks/useTheme";

const NavBarComponent = () => {
    const navigation = useNavigation();
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);
    const { colors, isDarkMode } = useTheme();

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
            <StatusBar
                backgroundColor={colors.background}
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    shadowColor: colors.primary,
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 5,
                }}
            >
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
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                onPress={() =>
                                    navigation.navigate(
                                        "EnergyAnalysisResultPage" as never
                                    )
                                }
                            >
                                <Ionicons
                                    name="bar-chart-outline"
                                    size={30}
                                    color={colors.text}
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
                                    color={colors.text}
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
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex flex-row space-x-3">
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderWidth: 1,
                                    borderColor: colors.secondary,
                                    borderRadius: 20,
                                }}
                                onPress={() =>
                                    navigation.navigate("Login" as never)
                                }
                            >
                                <Text
                                    style={{
                                        color: colors.secondary,
                                        fontWeight: "500",
                                    }}
                                >
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    backgroundColor: colors.accent,
                                    borderRadius: 20,
                                }}
                                onPress={() =>
                                    navigation.navigate("Register" as never)
                                }
                            >
                                <Text
                                    style={{
                                        color: colors.primary,
                                        fontWeight: "500",
                                    }}
                                >
                                    Register
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    backgroundColor: colors.secondary,
                                    borderRadius: 20,
                                }}
                                onPress={() =>
                                    navigation.navigate(
                                        "EnergyInputPage" as never
                                    )
                                }
                            >
                                <Text
                                    style={{
                                        color: colors.background,
                                        fontWeight: "500",
                                    }}
                                >
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
