import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useState } from "react";
import { Alert } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/common/Button";
import { db } from "../utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "../hooks/useUser";

interface Device {
    name: string;
    watt: number;
    hours: number;
    category?: string;
}

const deviceCategories = [
    { id: "lighting", name: "Lights", examples: "Bulbs, Lamps, LED Strips" },
    {
        id: "kitchen",
        name: "Kitchen",
        examples: "Refrigerator, Microwave, Rice Cooker",
    },
    {
        id: "entertainment",
        name: "Entertainment",
        examples: "TV, Game Console, Speakers",
    },
    { id: "cooling", name: "Cooling", examples: "AC, Fan, Air Cooler" },
    {
        id: "office",
        name: "Computer & Office",
        examples: "Laptop, PC, Printer",
    },
    { id: "bathroom", name: "Bathroom", examples: "Water Heater, Hair Dryer" },
    { id: "laundry", name: "Laundry", examples: "Washing Machine, Iron" },
    { id: "other", name: "Other Devices", examples: "Chargers, Power Tools" },
];

const DevicesPage = () => {
    const [devices, setDevices] = useState<Device[]>([
        { name: "", watt: 0, hours: 0, category: "other" },
    ]);

    const [result, setResult] = useState<number | null>(null);
    const { colors, isDarkMode } = useTheme();
    const { user, userData } = useUser();
    const scrollViewRef = useRef<ScrollView>(null);

    const handleAddDevice = () => {
        setDevices([
            ...devices,
            { name: "", watt: 0, hours: 0, category: "other" },
        ]);

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleChange = (
        index: number,
        key: "name" | "watt" | "category",
        value: string
    ) => {
        const updated = [...devices];
        if (key === "watt") {
            updated[index][key] = value === "" ? 0 : parseFloat(value);
        } else {
            updated[index][key] = value;
        }

        setDevices(updated);
    };

    const handleRemoveDevice = (index: number) => {
        if (devices.length === 1) return;
        const updated = [...devices];
        updated.splice(index, 1);
        setDevices(updated);
    };

    const saveDevices = async () => {
        try {
            const docRef = doc(db, "users", userData.id);
            const now = new Date().toISOString();

            await updateDoc(docRef, {
                "deviceList.updatedAt": now,
                "deviceList.devices": devices.map((device) => ({
                    name: device.name,
                    watt: device.watt,
                    category: device.category || "other",
                    hours: device.hours || 0,
                    addedAt: now,
                })),
            });

            Alert.alert(
                "Success",
                "Your device list has been saved successfully!"
            );
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to save device list. Please try again."
            );
        }
    };

    useEffect(() => {
        if (userData?.deviceList?.devices) {
            const storedDevices = userData.deviceList.devices.map(
                (device: any) => ({
                    name: device.name || "",
                    watt: device.watt || 0,
                    hours: device.hours || 0,
                    category: device.category || "other",
                })
            );

            setDevices(storedDevices);
        }
    }, [userData]);

    return (
        <ScrollView
            ref={scrollViewRef}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Energy Usage Calculator
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Estimate your daily power consumption
                </Text>
            </View>

            {devices.map((device, index) => (
                <View
                    key={index}
                    style={[
                        styles.deviceCard,
                        {
                            backgroundColor: colors.card,
                            shadowColor: colors.text,
                        },
                    ]}
                >
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        Device #{index + 1}
                    </Text>
                    <TextInput
                        placeholder="Device Name"
                        placeholderTextColor={colors.textSecondary}
                        value={device.name}
                        onChangeText={(text) =>
                            handleChange(index, "name", text)
                        }
                        style={[
                            styles.input,
                            {
                                borderColor: colors.border,
                                backgroundColor: isDarkMode
                                    ? colors.background
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                    />
                    <View style={styles.categorySection}>
                        <Text
                            style={[
                                styles.categoryLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Device Type:
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View style={styles.categoryButtonsContainer}>
                                {deviceCategories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={[
                                            styles.categoryButton,
                                            {
                                                backgroundColor:
                                                    device.category === cat.id
                                                        ? colors.accent
                                                        : isDarkMode
                                                        ? colors.background
                                                        : "#F0F0F0",
                                                borderColor:
                                                    device.category === cat.id
                                                        ? colors.accent
                                                        : colors.border,
                                            },
                                        ]}
                                        onPress={() =>
                                            handleChange(
                                                index,
                                                "category",
                                                cat.id
                                            )
                                        }
                                    >
                                        <Text
                                            style={[
                                                styles.categoryButtonText,
                                                {
                                                    color:
                                                        device.category ===
                                                        cat.id
                                                            ? colors.primary
                                                            : colors.text,
                                                },
                                            ]}
                                        >
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text
                            style={[
                                styles.examplesText,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Examples:{" "}
                            {deviceCategories.find(
                                (cat) => cat.id === device.category
                            )?.examples || "Any electronic device"}
                        </Text>
                    </View>
                    <TextInput
                        placeholder="Power (Watt)"
                        placeholderTextColor={colors.textSecondary}
                        value={device.watt === 0 ? "" : String(device.watt)}
                        onChangeText={(text) =>
                            handleChange(index, "watt", text)
                        }
                        keyboardType="numeric"
                        style={[
                            styles.input,
                            {
                                borderColor: colors.border,
                                backgroundColor: isDarkMode
                                    ? colors.background
                                    : "#FAFDFC",
                                color: colors.text,
                            },
                        ]}
                    />

                    {devices.length > 1 && (
                        <TouchableOpacity
                            onPress={() => handleRemoveDevice(index)}
                            style={[
                                styles.removeButton,
                                {
                                    backgroundColor: isDarkMode
                                        ? "#3A1C1C"
                                        : "#FFE8E8",
                                },
                            ]}
                        >
                            <Text style={styles.removeButtonText}>
                                Remove Device
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}

            <TouchableOpacity
                onPress={handleAddDevice}
                style={[
                    styles.addButton,
                    {
                        backgroundColor: isDarkMode
                            ? `${colors.secondary}30`
                            : "#E8F5F2",
                        borderColor: colors.secondary,
                    },
                ]}
            >
                <Text style={[styles.addButtonText, { color: colors.text }]}>
                    + Add Another Device
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.calculateButton,
                    {
                        backgroundColor: isDarkMode ? "#198754" : colors.accent,
                        shadowColor: isDarkMode ? "#FFFFF" : "#A5A822",
                    },
                ]}
                onPress={saveDevices}
            >
                <Text
                    style={[
                        styles.calculateButtonText,
                        { color: colors.primary },
                    ]}
                >
                    Save Devices
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 25,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    deviceCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        marginBottom: 15,
        fontSize: 16,
    },
    removeButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5,
    },
    removeButtonText: {
        color: "#D32F2F",
        fontWeight: "600",
    },
    addButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderStyle: "dashed",
    },
    addButtonText: {
        fontWeight: "600",
        fontSize: 16,
    },
    calculateButton: {
        padding: 18,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 25,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    calculateButtonText: {
        fontWeight: "700",
        fontSize: 18,
    },
    resultContainer: {
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 5,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        textAlign: "center",
    },
    resultRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: "500",
    },
    resultValue: {
        fontSize: 16,
        fontWeight: "600",
    },
    categorySection: {
        marginBottom: 15,
    },
    categoryLabel: {
        fontSize: 14,
        marginBottom: 8,
    },
    categoryButtonsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    examplesText: {
        fontSize: 12,
        fontStyle: "italic",
        marginTop: 4,
    },
});

export default DevicesPage;
