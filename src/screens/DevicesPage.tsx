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
    const { colors, isDarkMode } = useTheme();
    const { user, userData } = useUser();

    const scrollViewRef = useRef<ScrollView>(null);

    const [devices, setDevices] = useState<Device[]>([
        { name: "", watt: 0, hours: 0, category: "other" },
    ]);
    const [result, setResult] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);

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
        key: "name" | "watt" | "hours" | "category",
        value: string
    ) => {
        const updated = [...devices];
        if (key === "watt" || key === "hours") {
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
            setLoading(true);
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
        } finally {
            setLoading(false);
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
                    My Devices
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Manage your energy-consuming devices
                </Text>
            </View>

            {devices.map((device, index) => (
                <View
                    key={index}
                    style={[
                        styles.deviceCard,
                        {
                            backgroundColor: colors.card,
                            shadowColor: isDarkMode
                                ? colors.accent + "40"
                                : colors.text,
                        },
                    ]}
                >
                    <View style={styles.deviceHeaderRow}>
                        <Text
                            style={[styles.cardTitle, { color: colors.text }]}
                        >
                            Device #{index + 1}
                        </Text>
                        {devices.length > 1 && (
                            <TouchableOpacity
                                onPress={() => handleRemoveDevice(index)}
                                style={styles.removeButtonSmall}
                            >
                                <Text
                                    style={[
                                        styles.removeButtonTextSmall,
                                        { color: colors.danger },
                                    ]}
                                >
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
                                styles.inputLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Device Type
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryScrollView}
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
                                                            ? "#FFFFFF"
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
                    <View>
                        <Text
                            style={[
                                styles.inputLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Energy Usage (eg. 100 Watts)
                        </Text>
                        <TextInput
                            placeholder="Watts"
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
                    </View>
                </View>
            ))}

            <Button
                title="+ Add Another Device"
                variant="secondary"
                onPress={handleAddDevice}
            />

            <View style={styles.buttonContainer}>
                <Button
                    title={loading ? "Saving..." : "Save Devices"}
                    onPress={saveDevices}
                    disabled={loading}
                />
            </View>
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
        borderRadius: 16,
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
    deviceHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        marginBottom: 15,
        fontSize: 16,
    },
    removeButtonSmall: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    removeButtonTextSmall: {
        fontWeight: "500",
        fontSize: 13,
    },
    removeButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 5,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    categorySection: {
        marginBottom: 15,
    },
    categoryScrollView: {
        marginVertical: 8,
    },
    categoryButtonsContainer: {
        flexDirection: "row",
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
    usageNote: {
        fontSize: 12,
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 5,
        marginBottom: 5,
    },
});

export default DevicesPage;
