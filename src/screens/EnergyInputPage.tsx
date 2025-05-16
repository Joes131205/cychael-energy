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

interface Device {
    name: string;
    watt: number;
    hours: number;
}

const EnergyInputPage = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [result, setResult] = useState<number | null>(null);

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
            updated[index][key] = parseFloat(value);
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Energy Usage Calculator</Text>
                <Text style={styles.subtitle}>
                    Estimate your daily power consumption
                </Text>
            </View>

            {devices.map((device, index) => (
                <View key={index} style={styles.deviceCard}>
                    <Text style={styles.cardTitle}>Device #{index + 1}</Text>
                    <TextInput
                        placeholder="Device Name"
                        placeholderTextColor="#95A3A1"
                        value={device.name}
                        onChangeText={(text) =>
                            handleChange(index, "name", text)
                        }
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Power (Watt)"
                        placeholderTextColor="#95A3A1"
                        value={String(device.watt)}
                        onChangeText={(text) =>
                            handleChange(index, "watt", text)
                        }
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Usage per day (Hours)"
                        placeholderTextColor="#95A3A1"
                        value={String(device.hours)}
                        onChangeText={(text) =>
                            handleChange(index, "hours", text)
                        }
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {devices.length > 1 && (
                        <TouchableOpacity
                            onPress={() => handleRemoveDevice(index)}
                            style={styles.removeButton}
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
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>+ Add Another Device</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={calculate}
                style={styles.calculateButton}
            >
                <Text style={styles.calculateButtonText}>
                    Calculate Consumption
                </Text>
            </TouchableOpacity>

            {result !== null && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>
                        Energy Consumption Results
                    </Text>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Daily:</Text>
                        <Text style={styles.resultValue}>
                            {result.toFixed(2)} kWh
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>
                            Monthly (30 days):
                        </Text>
                        <Text style={styles.resultValue}>
                            {(result * 30).toFixed(2)} kWh
                        </Text>
                    </View>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Yearly:</Text>
                        <Text style={styles.resultValue}>
                            {(result * 365).toFixed(2)} kWh
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F9F8",
        padding: 20,
    },
    header: {
        marginBottom: 25,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#283F3B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#5A7A74",
    },
    deviceCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#283F3B",
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
        color: "#283F3B",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: "#D0E0DD",
        borderRadius: 8,
        padding: 14,
        marginBottom: 15,
        fontSize: 16,
        color: "#283F3B",
        backgroundColor: "#FAFDFC",
    },
    removeButton: {
        backgroundColor: "#FFE8E8",
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
        backgroundColor: "#E8F5F2",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#99DDC8",
        borderStyle: "dashed",
    },
    addButtonText: {
        color: "#283F3B",
        fontWeight: "600",
        fontSize: 16,
    },
    calculateButton: {
        backgroundColor: "#D2D229",
        padding: 18,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 25,
        shadowColor: "#A5A822",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    calculateButtonText: {
        color: "#283F3B",
        fontWeight: "700",
        fontSize: 18,
    },
    resultContainer: {
        backgroundColor: "#E8F5F2",
        borderRadius: 12,
        padding: 20,
        borderLeftWidth: 5,
        borderLeftColor: "#99DDC8",
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#283F3B",
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
        color: "#5A7A74",
        fontWeight: "500",
    },
    resultValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#283F3B",
    },
});

export default EnergyInputPage;
