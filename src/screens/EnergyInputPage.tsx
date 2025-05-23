import React from "react";
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
}

const EnergyInputPage = () => {
    const [devices, setDevices] = useState<Device[]>([
        { name: "", watt: 0, hours: 0 },
    ]);
    const [result, setResult] = useState<number | null>(null);
    const { colors, isDarkMode } = useTheme();
    const { user, userData } = useUser();

    const handleAddDevice = () => {
        setDevices([...devices, { name: "", watt: 0, hours: 0 }]);
    };

    const handleChange = (
        index: number,
        key: "name" | "watt" | "hours",
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

    const calculate = () => {
        for (const device of devices) {
            if (!device.name || !device.watt || !device.hours) {
                Alert.alert(
                    "Incomplete Input",
                    "Please fill in all fields for each device."
                );
                return;
            }
        }

        let totalKWhPerDay = 0;

        devices.forEach((device) => {
            if (!isNaN(device.watt) && !isNaN(device.hours)) {
                totalKWhPerDay += (device.watt * device.hours) / 1000;
            }
        });

        setResult(totalKWhPerDay);
    };

    const saveEnergyData = async () => {
        try {
            const docRef = doc(db, "users", userData.id);
            await updateDoc(docRef, {
                energyData: userData.energyData
                    ? [
                          ...userData.energyData,
                          {
                              date: new Date().toISOString(),
                              deviceList: devices.map((device) => ({
                                  name: device.name,
                                  watt: device.watt,
                                  hours: device.hours,
                              })),
                              energyUsage: {
                                  daily: result,
                                  monthly: result! * 30,
                                  yearly: result! * 365,
                              },
                          },
                      ]
                    : [],
            });
            Alert.alert(
                "Success",
                "Your energy consumption data has been saved successfully!"
            );
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to save energy consumption data. Please try again."
            );
        }
    };

    return (
        <ScrollView
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
                    <TextInput
                        placeholder="Usage per day (Hours)"
                        placeholderTextColor={colors.textSecondary}
                        value={device.hours === 0 ? "" : String(device.hours)}
                        onChangeText={(text) =>
                            handleChange(index, "hours", text)
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
                onPress={calculate}
                style={[
                    styles.calculateButton,
                    {
                        backgroundColor: isDarkMode ? "#198754" : colors.accent,
                        shadowColor: isDarkMode ? "#FFFFF" : "#A5A822",
                    },
                ]}
            >
                <Text
                    style={[
                        styles.calculateButtonText,
                        { color: colors.primary },
                    ]}
                >
                    Consumptions
                </Text>
            </TouchableOpacity>

            {result !== null && (
                <View
                    style={[
                        styles.resultContainer,
                        {
                            backgroundColor: isDarkMode
                                ? `${colors.secondary}30`
                                : "#E8F5F2",
                            borderLeftColor: colors.secondary,
                        },
                    ]}
                >
                    <Text style={[styles.resultTitle, { color: colors.text }]}>
                        Energy Consumption Results
                    </Text>
                    <View style={styles.resultRow}>
                        <Text
                            style={[
                                styles.resultLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Daily:
                        </Text>
                        <Text
                            style={[styles.resultValue, { color: colors.text }]}
                        >
                            {result.toFixed(2)} kWh
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text
                            style={[
                                styles.resultLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Monthly (30 days):
                        </Text>
                        <Text
                            style={[styles.resultValue, { color: colors.text }]}
                        >
                            {(result * 30).toFixed(2)} kWh
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text
                            style={[
                                styles.resultLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Yearly:
                        </Text>
                        <Text
                            style={[styles.resultValue, { color: colors.text }]}
                        >
                            {(result * 365).toFixed(2)} kWh
                        </Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={saveEnergyData}
                            style={[
                                styles.calculateButton,
                                {
                                    backgroundColor: colors.accent,
                                    shadowColor: isDarkMode
                                        ? colors.accent
                                        : "#A5A822",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.calculateButtonText,
                                    { color: colors.primary },
                                ]}
                            >
                                Save Energy Consumption
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
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
});

export default EnergyInputPage;
