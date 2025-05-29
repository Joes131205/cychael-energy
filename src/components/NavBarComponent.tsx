import {
    useNavigation,
    useNavigationState,
    useRoute,
} from "@react-navigation/native";
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

    const routeName = useNavigationState(
        (state) => state?.routes[state.index]?.name || "Dashboard"
    );

    const isRouteActive = (route: string) => {
        return routeName === route;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    return (
        <>
            {user ? (
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
                            <View className="flex flex-row items-center justify-center w-full gap-10">
                                <TouchableOpacity
                                    className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                    onPress={() =>
                                        navigation.navigate(
                                            "Dashboard" as never
                                        )
                                    }
                                >
                                    <Ionicons
                                        name={
                                            isRouteActive("Dashboard")
                                                ? "home"
                                                : "home-outline"
                                        }
                                        size={30}
                                        color={
                                            isRouteActive("Dashboard")
                                                ? colors.primary
                                                : colors.text
                                        }
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
                                        name={
                                            isRouteActive(
                                                "EnergyAnalysisResultPage"
                                            )
                                                ? "bar-chart"
                                                : "bar-chart-outline"
                                        }
                                        size={30}
                                        color={
                                            isRouteActive(
                                                "EnergyAnalysisResultPage"
                                            )
                                                ? colors.primary
                                                : colors.text
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                    onPress={() =>
                                        navigation.navigate(
                                            "DevicesPage" as never
                                        )
                                    }
                                >
                                    <Ionicons
                                        name={
                                            isRouteActive("DevicesPage")
                                                ? "calculator"
                                                : "calculator-outline"
                                        }
                                        size={30}
                                        color={
                                            isRouteActive("DevicesPage")
                                                ? colors.primary
                                                : colors.text
                                        }
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex flex-col items-center px-4 py-2 rounded-full justify-center"
                                    onPress={() =>
                                        navigation.navigate("Settings" as never)
                                    }
                                >
                                    <Ionicons
                                        name={
                                            isRouteActive("Settings")
                                                ? "person"
                                                : "person-outline"
                                        }
                                        size={30}
                                        color={
                                            isRouteActive("Settings")
                                                ? colors.primary
                                                : colors.text
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default NavBarComponent;
