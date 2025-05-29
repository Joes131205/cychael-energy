import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { doc, updateDoc } from "firebase/firestore";
interface Device {
    name: string;
    watt: number;
    hours: number;
    category?: string;
    addedAt?: string;
    lastUpdated?: string;
}

const DashboardPage = () => {
    const navigation = useNavigation<any>();
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const { user, userData } = useUser();

    const [devices, setDevices] = useState<Device[]>([]);
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
        if (!userData?.deviceList?.devices) return;

        const currentDate = new Date();
        const updatedDevices = JSON.parse(
            JSON.stringify(userData.deviceList.devices)
        );
        let devicesNeedUpdate = false;

        updatedDevices.forEach((device: Device, index: number) => {
            if (device.lastUpdated) {
                const lastUpdatedDate = new Date(device.lastUpdated);
                const daysDifference = Math.floor(
                    (currentDate.getTime() - lastUpdatedDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                );

                if (daysDifference > 2) {
                    console.log(
                        `Device ${device.name} hasn't been updated for ${daysDifference} days. Resetting hours to 0.`
                    );
                    updatedDevices[index].hours = 0;
                    devicesNeedUpdate = true;
                }
            }
        });

        if (devicesNeedUpdate && userData.id) {
            const timestamp = currentDate.toISOString();
            const userDocRef = doc(db, "users", userData.id);
            updateDoc(userDocRef, {
                "deviceList.devices": updatedDevices,
                "deviceList.updatedAt": timestamp,
            })
                .then(() => {
                    console.log("Devices hours reset due to inactivity");
                })
                .catch((error) => {
                    console.error("Error resetting device hours:", error);
                });
        }

        const currentDevices = devicesNeedUpdate
            ? updatedDevices
            : userData.deviceList.devices;
        setDevices(currentDevices);

        const totalEnergy =
            parseFloat(
                (
                    currentDevices
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

        if (currentDevices.length > 0) {
            const devicesByCategory: {
                [key: string]: { totalEnergy: number; devices: any[] };
            } = {};
            let totalDevicesEnergy = 0;

            currentDevices.forEach((device: any) => {
                const category = device.category || "Other";
                const energyUsage = (device.watt * device.hours || 0) / 1000;
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
                .sort((a, b) => b.totalEnergy - a.totalEnergy);

            setDeviceCategories(formattedCategories);
        } else {
            setDeviceCategories([]);
        }
    }, [userData, devices]);

    const getCategoryIcon = (category: string): string => {
        switch (category.toLowerCase()) {
            case "lighting":
                return "bulb-outline";
            case "kitchen":
                return "restaurant-outline";
            case "entertainment":
                return "tv-outline";
            case "cooling":
                return "snow-outline";
            case "office":
                return "desktop-outline";
            case "bathroom":
                return "water-outline";
            case "laundry":
                return "shirt-outline";
            default:
                return "hardware-chip-outline";
        }
    };

    const saveDeviceUsageHours = async (index: number, hours: number) => {
        try {
            if (!userData?.deviceList?.devices) return;

            const updatedDevices = JSON.parse(JSON.stringify(devices));
            const currentDate = new Date();
            const timestamp = currentDate.toISOString();
            const dateKey = timestamp.split("T")[0];

            const currentDevice = updatedDevices[index];
            const previousHours = currentDevice.hours;

            updatedDevices[index] = {
                ...currentDevice,
                hours,
                lastUpdated: timestamp,
            };

            const userDocRef = doc(db, "users", userData.id);
            const existingEntries = userData.deviceHistory?.entries || [];

            const todaysEntryIndex = existingEntries.findIndex(
                (entry: any) =>
                    entry.deviceId === index && entry.dateKey === dateKey
            );

            const deviceEntries = existingEntries.filter(
                (entry: any) => entry.deviceId === index
            );

            const lastEntryForDevice =
                deviceEntries.length > 0
                    ? deviceEntries.sort(
                          (a: any, b: any) =>
                              new Date(b.timestamp).getTime() -
                              new Date(a.timestamp).getTime()
                      )[0]
                    : null;

            const isNewDay =
                !lastEntryForDevice || lastEntryForDevice.dateKey !== dateKey;
            const historyEntry = {
                deviceId: index,
                deviceName: currentDevice.name,
                category: currentDevice.category || "other",
                watt: currentDevice.watt,
                previousHours: previousHours,
                newHours: hours,
                timestamp: timestamp,
                dateKey: dateKey,
                dailyConsumptionKwh: (currentDevice.watt * hours) / 1000,
            };

            let updatedEntries;

            if (todaysEntryIndex >= 0) {
                updatedEntries = [...existingEntries];
                updatedEntries[todaysEntryIndex] = {
                    ...updatedEntries[todaysEntryIndex],
                    previousHours: updatedEntries[todaysEntryIndex].newHours,
                    newHours: hours,
                    timestamp: timestamp,
                    dailyConsumptionKwh: (currentDevice.watt * hours) / 1000,
                };
            } else if (isNewDay) {
                updatedEntries = [...existingEntries, historyEntry];
            } else {
                updatedEntries = existingEntries;
            }

            const dailyDeviceUsage = userData.dailyDeviceUsage || {};

            if (!dailyDeviceUsage[dateKey]) {
                dailyDeviceUsage[dateKey] = {
                    date: dateKey,
                    timestamp: timestamp,
                    devices: {},
                };
            }
            dailyDeviceUsage[dateKey].devices[index] = {
                deviceId: index,
                deviceName: currentDevice.name,
                category: currentDevice.category || "other",
                watt: currentDevice.watt,
                hours: hours,
                consumptionKwh: (currentDevice.watt * hours) / 1000,
                timestamp: timestamp,
            };
            await updateDoc(userDocRef, {
                "deviceList.devices": updatedDevices,
                "deviceList.updatedAt": timestamp,
                "deviceHistory.entries": updatedEntries,
                "deviceHistory.updatedAt": timestamp,
                dailyDeviceUsage: dailyDeviceUsage,
            });
        } catch (error) {
            console.error("Error saving device hours:", error);
            Alert.alert(
                "Error",
                "Failed to update device hours. Please try again.",
                [{ text: "OK" }]
            );
        }
    };
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
                    {" "}
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
                </View>{" "}
                <View className="bg-white/10 rounded-[15px] p-5 mb-3">
                    <Text className="text-white text-base font-bold mb-4">
                        Your Energy Summary
                        <Text className="text-white/70 text-xs font-normal">
                            {"\n"}Last updated:{" "}
                            {new Date(
                                userData?.deviceList?.updatedAt
                            ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}{" "}
                            at{" "}
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
                    <ScrollView style={{ maxHeight: 90 }}>
                        {deviceCategories.length === 0 ? (
                            <Text
                                className="text-sm text-center my-3"
                                style={{ color: colors.textSecondary }}
                            >
                                No device data available.
                            </Text>
                        ) : (
                            deviceCategories
                                .slice(0, 10)
                                .map((device, index) => (
                                    <View
                                        key={index}
                                        className="flex-row items-center justify-between mb-3"
                                    >
                                        <View className="flex-row items-center flex-1 pr-2">
                                            <View
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{
                                                    backgroundColor:
                                                        device.color,
                                                }}
                                            />
                                            <View>
                                                <Text
                                                    className="font-semibold"
                                                    style={{
                                                        color: colors.text,
                                                    }}
                                                >
                                                    {device.category}
                                                </Text>
                                                <Text
                                                    className="text-xs"
                                                    style={{
                                                        color: colors.textSecondary,
                                                    }}
                                                >
                                                    {device.totalEnergy.toFixed(
                                                        1
                                                    )}{" "}
                                                    kWh (
                                                    {typeof device.percentage ===
                                                        "number" &&
                                                    !isNaN(device.percentage)
                                                        ? device.percentage.toFixed(
                                                              0
                                                          )
                                                        : "0"}
                                                    %)
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
                                                    backgroundColor:
                                                        device.color,
                                                }}
                                            />
                                        </View>
                                    </View>
                                ))
                        )}
                    </ScrollView>
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
                {/* Device Hour Controller */}
                <View className="mb-4 flex-row items-center">
                    <View
                        className="w-10 h-10 rounded-full justify-center items-center mr-[15px]"
                        style={{ backgroundColor: `${colors.accent}20` }}
                    >
                        <Ionicons
                            name="time-outline"
                            size={24}
                            color={colors.accent}
                        />
                    </View>
                    <Text
                        className="text-lg font-semibold"
                        style={{ color: colors.text }}
                    >
                        Device Hour Controller (
                        {new Date(
                            userData?.deviceList?.updatedAt
                        ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                        )
                    </Text>
                </View>

                {userData?.deviceList?.devices &&
                userData.deviceList.devices.length > 0 ? (
                    <ScrollView>
                        {userData.deviceList.devices.map(
                            (device: Device, index: number) => (
                                <View
                                    key={index}
                                    className="mb-3 p-4 rounded-xl flex-row justify-between items-center"
                                    style={{
                                        backgroundColor: colors.card,
                                        shadowColor: colors.text,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="flex-1">
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name={
                                                    getCategoryIcon(
                                                        device.category ||
                                                            "other"
                                                    ) as any
                                                }
                                                size={18}
                                                color={colors.accent}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text
                                                className="font-medium"
                                                style={{ color: colors.text }}
                                            >
                                                {device.name}
                                            </Text>
                                        </View>

                                        <Text
                                            className="text-xs mt-1"
                                            style={{
                                                color: colors.textSecondary,
                                            }}
                                        >
                                            {device.watt} watts •{" "}
                                            {device.category
                                                ? device.category[0].toUpperCase() +
                                                  device.category.slice(1)
                                                : "Other"}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <Text
                                            style={{
                                                color: colors.textSecondary,
                                                marginRight: 8,
                                                fontSize: 14,
                                            }}
                                        >
                                            Hours/day:
                                        </Text>

                                        <View
                                            className="flex-row items-center bg-opacity-20 rounded px-2 py-1"
                                            style={{
                                                backgroundColor: `${colors.accent}20`,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    saveDeviceUsageHours(
                                                        index,
                                                        Math.max(
                                                            0,
                                                            (device.hours ||
                                                                0) - 1
                                                        )
                                                    )
                                                }
                                            >
                                                <Ionicons
                                                    name="remove-outline"
                                                    size={18}
                                                    color={colors.accent}
                                                />
                                            </TouchableOpacity>

                                            <Text
                                                className="mx-2 font-bold"
                                                style={{
                                                    color: colors.text,
                                                    minWidth: 24,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {device.hours || 0}
                                            </Text>

                                            <TouchableOpacity
                                                onPress={() =>
                                                    saveDeviceUsageHours(
                                                        index,
                                                        Math.min(
                                                            24,
                                                            (device.hours ||
                                                                0) + 1
                                                        )
                                                    )
                                                }
                                            >
                                                <Ionicons
                                                    name="add-outline"
                                                    size={18}
                                                    color={colors.accent}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        )}
                    </ScrollView>
                ) : (
                    <View
                        className="py-8 px-4 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.card }}
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            className="text-center mt-3 mb-1 text-lg font-semibold"
                            style={{ color: colors.text }}
                        >
                            No Devices Added Yet
                        </Text>
                        <Text
                            className="text-center mb-5 px-5"
                            style={{ color: colors.textSecondary }}
                        >
                            Add your devices to start tracking energy usage
                        </Text>
                        <TouchableOpacity
                            className="py-3 px-6 rounded-xl flex-row items-center"
                            style={{ backgroundColor: colors.accent }}
                            onPress={() => navigation.navigate("DevicesPage")}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={20}
                                color={colors.primary}
                                style={{ marginRight: 8 }}
                            />
                            <Text
                                style={{
                                    color: colors.primary,
                                    fontWeight: "600",
                                }}
                            >
                                Add Devices
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default DashboardPage;
