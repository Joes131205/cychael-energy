import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../utils/firebase";
import { LinearGradient } from "expo-linear-gradient";

const DashboardPage = () => {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState(auth.currentUser);
    const [energyData, setEnergyData] = useState({
        dailyUsage: 5.7,
        monthlyUsage: 172.3,
        savingTips: [
            "Replace incandescent bulbs with LED lighting",
            "Unplug devices when not in use",
            "Set your thermostat to optimal temperatures",
            "Seal air leaks around windows and doors",
        ],
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate("Login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <ScrollView className="flex-1 bg-[#F5F9F8]">
            <LinearGradient
                colors={["#283F3B", "#1A2E2A"]}
                className="px-5 pt-[50px] pb-[30px] rounded-b-[30px]"
            >
                <View className="mb-5">
                    <Text className="text-base text-[#99DDC8]">
                        Welcome back,
                    </Text>
                    <Text className="text-2xl font-bold text-white">
                        {user?.displayName || "User"}
                    </Text>
                </View>

                <View className="bg-white/10 rounded-[15px] p-5">
                    <Text className="text-white text-base font-bold mb-[15px]">
                        Your Energy Summary
                    </Text>
                    <View className="flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-[#D2D229] text-2xl font-bold">
                                {energyData.dailyUsage} kWh
                            </Text>
                            <Text className="text-[#99DDC8] text-sm mt-[5px]">
                                Today
                            </Text>
                        </View>
                        <View className="w-[1px] bg-white/20" />
                        <View className="items-center">
                            <Text className="text-[#D2D229] text-2xl font-bold">
                                {energyData.monthlyUsage} kWh
                            </Text>
                            <Text className="text-[#99DDC8] text-sm mt-[5px]">
                                This Month
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View className="p-5">
                <TouchableOpacity
                    className="flex-row items-center bg-white p-4 rounded-xl mb-[15px] shadow"
                    onPress={() => navigation.navigate("EnergyInputPage")}
                >
                    <View className="w-10 h-10 rounded-full bg-[rgba(210,210,41,0.15)] justify-center items-center mr-[15px]">
                        <Ionicons
                            name="calculator-outline"
                            size={24}
                            color="#D2D229"
                        />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-[#283F3B]">
                        Calculate Usage
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#5A7A74"
                    />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row items-center bg-white p-4 rounded-xl mb-[15px] shadow">
                    <View className="w-10 h-10 rounded-full bg-[rgba(153,221,200,0.15)] justify-center items-center mr-[15px]">
                        <Ionicons
                            name="analytics-outline"
                            size={24}
                            color="#99DDC8"
                        />
                    </View>
                    <Text className="flex-1 text-base font-semibold text-[#283F3B]">
                        View Reports
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={18}
                        color="#5A7A74"
                    />
                </TouchableOpacity>
            </View>

            <View className="p-5">
                <Text className="text-lg font-bold text-[#283F3B] mb-[15px]">
                    Energy Saving Tips
                </Text>

                {energyData.savingTips.map((tip, index) => (
                    <View
                        key={index}
                        className="flex-row items-center bg-white p-[15px] rounded-xl mb-[10px] shadow"
                    >
                        <View className="w-9 h-9 rounded-full bg-[rgba(210,210,41,0.15)] justify-center items-center mr-[15px]">
                            <Ionicons
                                name="bulb-outline"
                                size={20}
                                color="#D2D229"
                            />
                        </View>
                        <Text className="flex-1 text-[#283F3B] text-sm">
                            {tip}
                        </Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                className="flex-row items-center justify-center bg-[#FFE8E8] p-4 rounded-xl mx-5 my-[30px]"
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
