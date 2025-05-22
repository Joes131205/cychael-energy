import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";

const DashboardPage = () => {
    const navigation = useNavigation<any>();
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const user = useUser();

    console.log(user);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            <LinearGradient
                colors={
                    isDarkMode
                        ? [colors.secondary, colors.primary]
                        : [colors.primary, colors.secondary]
                }
                className="px-5 pt-[50px] pb-[30px] rounded-b-[30px]"
            >
                <View className="flex-row justify-between items-center mb-5">
                    <View>
                        <Text
                            className="text-base"
                            style={{
                                color: isDarkMode ? colors.text : "#99DDC8",
                            }}
                        >
                            Welcome back,
                        </Text>
                        <Text className="text-2xl font-bold text-white">
                            {user?.user?.displayName || "User"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={toggleTheme}
                        className="p-2 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    >
                        <Ionicons
                            name={isDarkMode ? "sunny" : "moon"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                <View className="bg-white/10 rounded-[15px] p-5">
                    <Text className="text-white text-base font-bold mb-[15px]">
                        Your Energy Summary
                    </Text>
                    <View className="flex-row justify-around">
                        <View className="items-center">
                            <Text
                                className="text-2xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {user?.userData?.energyData?.length > 0
                                    ? user.userData.energyData[
                                          user.userData.energyData.length - 1
                                      ].energyUsage.daily.toFixed(2)
                                    : "0"}{" "}
                                kWh{" "}
                            </Text>
                            <Text
                                className="text-sm mt-[5px]"
                                style={{
                                    color: "white",
                                }}
                            >
                                Today
                            </Text>
                        </View>
                        <View className="w-[1px] bg-white/20" />
                        <View className="items-center">
                            <Text
                                className="text-2xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {user?.userData?.energyData?.length > 0
                                    ? user.userData.energyData[
                                          user.userData.energyData.length - 1
                                      ].energyUsage.monthly.toFixed(2)
                                    : "0"}{" "}
                                kWh{" "}
                            </Text>
                            <Text
                                className="text-sm mt-[5px]"
                                style={{
                                    color: "white",
                                }}
                            >
                                This Month
                            </Text>
                        </View>
                        <View className="w-[1px] bg-white/20" />
                        <View className="items-center">
                            <Text
                                className="text-2xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {user?.userData?.energyData?.length > 0
                                    ? user.userData.energyData[
                                          user.userData.energyData.length - 1
                                      ].energyUsage.yearly.toFixed(2)
                                    : "0"}{" "}
                                kWh{" "}
                            </Text>
                            <Text
                                className="text-sm mt-[5px]"
                                style={{
                                    color: "white",
                                }}
                            >
                                This Year
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View className="p-5">
                <TouchableOpacity
                    className="flex-row items-center p-4 rounded-xl mb-[15px] shadow"
                    style={{ backgroundColor: colors.card }}
                    onPress={() => navigation.navigate("EnergyInputPage")}
                >
                    <View
                        className="w-10 h-10 rounded-full justify-center items-center mr-[15px]"
                        style={{ backgroundColor: `${colors.accent}20` }}
                    >
                        <Ionicons
                            name="calculator-outline"
                            size={24}
                            color={colors.accent}
                        />
                    </View>
                    <Text
                        className="flex-1 text-base font-semibold"
                        style={{ color: colors.text }}
                    >
                        Calculate Usage
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center p-4 rounded-xl mb-[15px] shadow"
                    style={{ backgroundColor: colors.card }}
                >
                    <View
                        className="w-10 h-10 rounded-full justify-center items-center mr-[15px]"
                        style={{ backgroundColor: `${colors.secondary}20` }}
                    >
                        <Ionicons
                            name="analytics-outline"
                            size={24}
                            color={colors.secondary}
                        />
                    </View>
                    <Text
                        className="flex-1 text-base font-semibold"
                        style={{ color: colors.text }}
                    >
                        View Reports
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <View className="p-5">
                <Text
                    className="text-lg font-bold mb-[15px]"
                    style={{ color: colors.text }}
                >
                    Energy Saving Tips
                </Text>
            </View>

            <TouchableOpacity
                className="flex-row items-center justify-center p-4 rounded-xl mx-5 my-[30px]"
                style={{ backgroundColor: isDarkMode ? "#3A1C1C" : "#FFE8E8" }}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-[#EF4444] font-semibold text-base ml-2">
                    Log Out
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default DashboardPage;
