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
    const { user, userData } = useUser();

    const [energyData, setEnergyData] = useState({
        today: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
    });

    const [deviceCategories, setDeviceCategories] = useState<
        {
            category: string;
            totalEnergy: number;
            percentage: number;
            color: string;
        }[]
    >([]);

    useEffect(() => {
        if (!user) {
            navigation.navigate("LandingPage" as never);
        }
    }, [user]);

    useEffect(() => {
        const totalEnergy =
            parseFloat(
                (
                    userData?.deviceList?.devices
                        ?.map((device: any) => device.watt * device.hours)
                        .reduce((a: number, b: number) => a + b, 0) / 1000
                ).toFixed(2)
            ) || 0;

        setEnergyData({
            today: totalEnergy,
            weekly: totalEnergy * 7,
            monthly: totalEnergy * 30,
            yearly: totalEnergy * 365,
        });

        // Calculate device categories and their energy consumption
        if (
            userData?.deviceList?.devices &&
            userData.deviceList.devices.length > 0
        ) {
            const devicesByCategory: {
                [key: string]: { totalEnergy: number; devices: any[] };
            } = {};
            let totalDevicesEnergy = 0;

            // Group devices by category
            userData.deviceList.devices.forEach((device: any) => {
                const category = device.category || "Other";
                const energyUsage = (device.watt * device.hours) / 1000; // kWh
                totalDevicesEnergy += energyUsage;

                if (!devicesByCategory[category]) {
                    devicesByCategory[category] = {
                        totalEnergy: 0,
                        devices: [],
                    };
                }

                devicesByCategory[category].totalEnergy += energyUsage;
                devicesByCategory[category].devices.push(device);
            });

            const categoryColors = [
                "#4CAF50",
                "#2196F3",
                "#FFC107",
                "#FF5722",
                "#9C27B0",
                "#607D8B",
            ];
            const formattedCategories = Object.entries(devicesByCategory)
                .map(([category, data], index) => ({
                    category,
                    totalEnergy: data.totalEnergy,
                    percentage: (data.totalEnergy / totalDevicesEnergy) * 100,
                    color: categoryColors[index % categoryColors.length],
                }))
                .sort((a, b) => b.totalEnergy - a.totalEnergy); // Sort by highest usage

            setDeviceCategories(formattedCategories);
        } else {
            setDeviceCategories([]);
        }
    }, [user, userData]);

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
        >
            <LinearGradient
                colors={
                    isDarkMode ? ["#1A2E2A", "#121C1A"] : ["#283F3B", "#99DDC8"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="px-5 pt-[60px] pb-[35px] rounded-b-[30px]"
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
                            {user?.displayName || "User"}
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
                <View className="bg-white/10 rounded-[15px] p-5 mb-3">
                    <Text className="text-white text-base font-bold mb-4">
                        Your Energy Summary
                        <Text className="text-white/70 text-xs font-normal">
                            {"\n"}Last updated:
                            {new Date(
                                userData?.deviceList?.updatedAt
                            ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                            at
                            {new Date(
                                userData?.deviceList?.updatedAt
                            ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </Text>
                    <View className="flex-row justify-between">
                        {/* Daily Usage */}
                        <View className="items-center flex-1">
                            <View className="bg-white/5 rounded-full h-16 w-16 items-center justify-center mb-2">
                                <Ionicons
                                    name="flash-outline"
                                    size={24}
                                    color={colors.accent}
                                />
                            </View>
                            <Text
                                className="text-xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {energyData.today.toFixed(1)}
                            </Text>
                            <Text
                                className="text-xs"
                                style={{ color: "white" }}
                            >
                                kWh Today
                            </Text>
                        </View>

                        {/* Monthly Usage */}
                        <View className="items-center flex-1">
                            <View className="bg-white/5 rounded-full h-16 w-16 items-center justify-center mb-2">
                                <Ionicons
                                    name="calendar-outline"
                                    size={22}
                                    color={colors.accent}
                                />
                            </View>
                            <Text
                                className="text-xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {energyData.monthly.toFixed(1)}
                            </Text>
                            <Text
                                className="text-xs"
                                style={{ color: "white" }}
                            >
                                kWh Monthly
                            </Text>
                        </View>

                        {/* Yearly Usage */}
                        <View className="items-center flex-1">
                            <View className="bg-white/5 rounded-full h-16 w-16 items-center justify-center mb-2">
                                <Ionicons
                                    name="trending-up-outline"
                                    size={22}
                                    color={colors.accent}
                                />
                            </View>
                            <Text
                                className="text-xl font-bold"
                                style={{ color: colors.accent }}
                            >
                                {energyData.yearly.toFixed(1)}
                            </Text>
                            <Text
                                className="text-xs"
                                style={{ color: "white" }}
                            >
                                kWh Yearly
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Device Categorization Section */}
                <View
                    className="rounded-xl mb-[15px] p-5 shadow"
                    style={{ backgroundColor: colors.card }}
                >
                    <View className="flex-row items-center mb-4">
                        <View
                            className="w-10 h-10 rounded-full justify-center items-center mr-[15px]"
                            style={{ backgroundColor: `${colors.accent}20` }}
                        >
                            <Ionicons
                                name="pie-chart-outline"
                                size={24}
                                color={colors.accent}
                            />
                        </View>
                        <Text
                            className="text-base font-semibold"
                            style={{ color: colors.text }}
                        >
                            Highest Energy Consumers
                        </Text>
                    </View>

                    {deviceCategories.length === 0 ? (
                        <Text
                            className="text-sm text-center my-3"
                            style={{ color: colors.textSecondary }}
                        >
                            No device data available.
                        </Text>
                    ) : (
                        deviceCategories.slice(0, 3).map((device, index) => (
                            <View
                                key={index}
                                className="flex-row items-center justify-between mb-3"
                            >
                                <View className="flex-row items-center flex-1 pr-2">
                                    <View
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{
                                            backgroundColor: device.color,
                                        }}
                                    />
                                    <View>
                                        <Text
                                            className="font-semibold"
                                            style={{ color: colors.text }}
                                        >
                                            {device.category}
                                        </Text>
                                        <Text
                                            className="text-xs"
                                            style={{
                                                color: colors.textSecondary,
                                            }}
                                        >
                                            {device.totalEnergy.toFixed(1)} kWh
                                            ({device.percentage.toFixed(0)}%)
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    className="w-[120px] h-2.5 rounded-full"
                                    style={{
                                        backgroundColor: `${colors.accent}20`,
                                    }}
                                >
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${Math.min(
                                                device.percentage,
                                                100
                                            )}%`,
                                            backgroundColor: device.color,
                                        }}
                                    />
                                </View>
                            </View>
                        ))
                    )}

                    {deviceCategories.length > 3 && (
                        <TouchableOpacity
                            className="mt-2 items-center py-2"
                            onPress={() =>
                                navigation.navigate("EnergyAnalysisResultPage")
                            }
                        >
                            <Text
                                className="text-xs font-semibold"
                                style={{ color: colors.accent }}
                            >
                                View All Categories
                            </Text>
                        </TouchableOpacity>
                    )}
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
                    onPress={() =>
                        navigation.navigate("EnergyAnalysisResultPage")
                    }
                >
                    <View
                        className="w-10 h-10 rounded-full justify-center items-center mr-[15px]"
                        style={{ backgroundColor: `${colors.secondary}20` }}
                    >
                        <Ionicons
                            name="analytics-outline"
                            size={24}
                            color={colors.accent}
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
        </ScrollView>
    );
};

export default DashboardPage;
