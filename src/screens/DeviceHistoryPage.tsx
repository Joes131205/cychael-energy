import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface HistoryEntry {
    deviceId: number;
    deviceName: string;
    category: string;
    watt: number;
    previousHours: number;
    newHours: number;
    timestamp: string;
    dateKey: string;
}

const DeviceHistoryPage = () => {
    const { colors, isDarkMode } = useTheme();
    const { userData, loading } = useUser();
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<"week" | "month">("week");

    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
    }, [userData, loading]);

    const deviceHistory = useMemo(() => {
        if (!userData?.deviceHistory?.entries) return [];
        return userData.deviceHistory.entries as HistoryEntry[];
    }, [userData]);

    const currentDevices = useMemo(() => {
        if (!userData?.deviceList?.devices) return [];
        return userData.deviceList.devices;
    }, [userData]);

    const uniqueDevices = useMemo(() => {
        if (deviceHistory.length === 0) return [];

        const devices = new Set<string>();
        deviceHistory.forEach((entry) => {
            devices.add(entry.deviceName);
        });

        return Array.from(devices);
    }, [deviceHistory]);

    const filteredHistory = useMemo(() => {
        if (!selectedDevice) return deviceHistory;

        return deviceHistory.filter(
            (entry) => entry.deviceName === selectedDevice
        );
    }, [deviceHistory, selectedDevice]);

    const chartData = useMemo(() => {
        if (filteredHistory.length === 0)
            return { labels: [], datasets: [{ data: [] }] };

        const now = new Date();
        let startDate: Date;

        if (timeRange === "week") {
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        } else {
            startDate = new Date();
            startDate.setDate(now.getDate() - 30);
        }

        const dates: string[] = [];
        const dailyHours: number[] = [];

        for (
            let d = new Date(startDate);
            d <= now;
            d.setDate(d.getDate() + 1)
        ) {
            const dateKey = d.toISOString().split("T")[0];
            dates.push(dateKey.slice(5));

            const entriesForDate = filteredHistory.filter(
                (entry) => entry.dateKey === dateKey
            );

            if (entriesForDate.length > 0) {
                const totalHours = entriesForDate.reduce(
                    (sum, entry) => sum + entry.newHours,
                    0
                );
                dailyHours.push(
                    Number((totalHours / entriesForDate.length).toFixed(1))
                );
            } else {
                dailyHours.push(0);
            }
        }

        return {
            labels: dates,
            datasets: [{ data: dailyHours }],
        };
    }, [filteredHistory, timeRange]);

    const deviceStats = useMemo(() => {
        if (filteredHistory.length === 0)
            return { avgHours: 0, totalConsumption: 0 };

        const totalHours = filteredHistory.reduce(
            (sum, entry) => sum + entry.newHours,
            0
        );
        const avgHours = Number(
            (totalHours / filteredHistory.length).toFixed(1)
        );

        const latestEntry = filteredHistory[filteredHistory.length - 1];
        const watt = latestEntry ? latestEntry.watt : 0;

        const totalConsumption = Number(
            ((avgHours * watt * 30) / 1000).toFixed(2)
        );

        return { avgHours, totalConsumption };
    }, [filteredHistory]);

    const usageTrend = useMemo(() => {
        if (filteredHistory.length < 2) return "stable";

        // Sort by timestamp
        const sortedEntries = [...filteredHistory].sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
        );

        // Compare first and last entries
        const firstEntry = sortedEntries[0];
        const lastEntry = sortedEntries[sortedEntries.length - 1];

        if (lastEntry.newHours > firstEntry.previousHours) return "increasing";
        if (lastEntry.newHours < firstEntry.previousHours) return "decreasing";
        return "stable";
    }, [filteredHistory]);

    if (isLoading) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: colors.background },
                ]}
            >
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <LinearGradient
                colors={
                    isDarkMode ? ["#1A2E2A", "#121C1A"] : ["#283F3B", "#99DDC8"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Device History</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {deviceHistory.length === 0 ? (
                    <View
                        style={[
                            styles.noDataContainer,
                            { backgroundColor: colors.card },
                        ]}
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            style={[styles.noDataText, { color: colors.text }]}
                        >
                            No device history available
                        </Text>
                        <Text
                            style={[
                                styles.noDataSubtext,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Update your device hours to start tracking history
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Device Selector */}
                        <View style={styles.selectorContainer}>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Select Device
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.deviceSelector}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.deviceChip,
                                        {
                                            backgroundColor: !selectedDevice
                                                ? colors.accent
                                                : `${colors.accent}20`,
                                        },
                                    ]}
                                    onPress={() => setSelectedDevice(null)}
                                >
                                    <Text
                                        style={{
                                            color: !selectedDevice
                                                ? colors.card
                                                : colors.text,
                                            fontWeight: "600",
                                        }}
                                    >
                                        All Devices
                                    </Text>
                                </TouchableOpacity>
                                {uniqueDevices.map((device) => (
                                    <TouchableOpacity
                                        key={device}
                                        style={[
                                            styles.deviceChip,
                                            {
                                                backgroundColor:
                                                    selectedDevice === device
                                                        ? colors.accent
                                                        : `${colors.accent}20`,
                                            },
                                        ]}
                                        onPress={() =>
                                            setSelectedDevice(device)
                                        }
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    selectedDevice === device
                                                        ? colors.card
                                                        : colors.text,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {device}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Time Range Selector */}
                        <View style={styles.timeRangeContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.timeButton,
                                    {
                                        backgroundColor:
                                            timeRange === "week"
                                                ? colors.accent
                                                : `${colors.accent}20`,
                                    },
                                ]}
                                onPress={() => setTimeRange("week")}
                            >
                                <Text
                                    style={{
                                        color:
                                            timeRange === "week"
                                                ? colors.card
                                                : colors.text,
                                    }}
                                >
                                    Last Week
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.timeButton,
                                    {
                                        backgroundColor:
                                            timeRange === "month"
                                                ? colors.accent
                                                : `${colors.accent}20`,
                                    },
                                ]}
                                onPress={() => setTimeRange("month")}
                            >
                                <Text
                                    style={{
                                        color:
                                            timeRange === "month"
                                                ? colors.card
                                                : colors.text,
                                    }}
                                >
                                    Last Month
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Usage Chart */}
                        <View
                            style={[
                                styles.chartContainer,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chartTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Usage Hours Over Time
                            </Text>
                            {chartData.datasets[0].data.length > 0 ? (
                                <LineChart
                                    data={chartData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: colors.card,
                                        backgroundGradientFrom: colors.card,
                                        backgroundGradientTo: colors.card,
                                        decimalPlaces: 1,
                                        color: (opacity = 1) =>
                                            `rgba(76, 175, 80, ${opacity})`,
                                        labelColor: (opacity = 1) =>
                                            `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: "5",
                                            strokeWidth: "2",
                                            stroke: colors.accent,
                                        },
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />
                            ) : (
                                <Text
                                    style={{
                                        color: colors.textSecondary,
                                        textAlign: "center",
                                        marginTop: 20,
                                    }}
                                >
                                    No data available for the selected time
                                    range
                                </Text>
                            )}
                        </View>

                        {/* Usage Stats */}
                        <View
                            style={[
                                styles.statsContainer,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statsTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Usage Statistics
                            </Text>

                            <View style={styles.statRow}>
                                <View style={styles.statItem}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            { color: colors.accent },
                                        ]}
                                    >
                                        {deviceStats.avgHours} hrs
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Avg. Daily Usage
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Text
                                        style={[
                                            styles.statValue,
                                            { color: colors.accent },
                                        ]}
                                    >
                                        {deviceStats.totalConsumption} kWh
                                    </Text>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Monthly Consumption
                                    </Text>
                                </View>

                                <View style={styles.statItem}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.statValue,
                                                { color: colors.accent },
                                            ]}
                                        >
                                            {usageTrend === "increasing"
                                                ? "↑"
                                                : usageTrend === "decreasing"
                                                ? "↓"
                                                : "→"}
                                        </Text>
                                    </View>
                                    <Text
                                        style={[
                                            styles.statLabel,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Usage Trend
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Recent History */}
                        <View
                            style={[
                                styles.historyContainer,
                                { backgroundColor: colors.card },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.historyTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Recent Updates
                            </Text>

                            {filteredHistory.length > 0 ? (
                                filteredHistory
                                    .sort(
                                        (a, b) =>
                                            new Date(b.timestamp).getTime() -
                                            new Date(a.timestamp).getTime()
                                    )
                                    .slice(0, 10)
                                    .map((entry, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.historyItem,
                                                {
                                                    borderBottomColor: `${colors.border}30`,
                                                },
                                            ]}
                                        >
                                            <View style={styles.historyHeader}>
                                                <Text
                                                    style={[
                                                        styles.deviceName,
                                                        { color: colors.text },
                                                    ]}
                                                >
                                                    {entry.deviceName}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.historyDate,
                                                        {
                                                            color: colors.textSecondary,
                                                        },
                                                    ]}
                                                >
                                                    {new Date(
                                                        entry.timestamp
                                                    ).toLocaleDateString()}{" "}
                                                    at{" "}
                                                    {new Date(
                                                        entry.timestamp
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                            </View>

                                            <View style={styles.historyDetails}>
                                                <Text
                                                    style={{
                                                        color: colors.textSecondary,
                                                    }}
                                                >
                                                    Usage changed from{" "}
                                                    <Text
                                                        style={{
                                                            color: colors.text,
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {entry.previousHours}{" "}
                                                        hours
                                                    </Text>{" "}
                                                    to{" "}
                                                    <Text
                                                        style={{
                                                            color: colors.text,
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {entry.newHours} hours
                                                    </Text>
                                                </Text>
                                            </View>

                                            <View style={styles.usageChange}>
                                                {entry.newHours >
                                                entry.previousHours ? (
                                                    <View
                                                        style={
                                                            styles.changeIndicator
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="arrow-up"
                                                            size={14}
                                                            color="#FF5722"
                                                        />
                                                        <Text
                                                            style={{
                                                                color: "#FF5722",
                                                                marginLeft: 4,
                                                            }}
                                                        >
                                                            Increased by{" "}
                                                            {entry.newHours -
                                                                entry.previousHours}{" "}
                                                            hrs
                                                        </Text>
                                                    </View>
                                                ) : entry.newHours <
                                                  entry.previousHours ? (
                                                    <View
                                                        style={
                                                            styles.changeIndicator
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="arrow-down"
                                                            size={14}
                                                            color="#4CAF50"
                                                        />
                                                        <Text
                                                            style={{
                                                                color: "#4CAF50",
                                                                marginLeft: 4,
                                                            }}
                                                        >
                                                            Decreased by{" "}
                                                            {entry.previousHours -
                                                                entry.newHours}{" "}
                                                            hrs
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <Text
                                                        style={{
                                                            color: colors.textSecondary,
                                                        }}
                                                    >
                                                        No change in hours
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    ))
                            ) : (
                                <Text
                                    style={{
                                        color: colors.textSecondary,
                                        textAlign: "center",
                                        padding: 20,
                                    }}
                                >
                                    No history records for the selected device
                                </Text>
                            )}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "white",
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },
    noDataContainer: {
        padding: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    noDataText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
    },
    noDataSubtext: {
        textAlign: "center",
        marginTop: 8,
        marginHorizontal: 20,
    },
    selectorContainer: {
        marginBottom: 16,
    },
    deviceSelector: {
        flexDirection: "row",
    },
    deviceChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
    },
    timeRangeContainer: {
        flexDirection: "row",
        marginBottom: 16,
    },
    timeButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    chartContainer: {
        padding: 15,
        borderRadius: 15,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    statsContainer: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 16,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    statLabel: {
        fontSize: 12,
        marginTop: 5,
    },
    historyContainer: {
        padding: 15,
        borderRadius: 15,
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
    },
    historyItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    deviceName: {
        fontWeight: "600",
    },
    historyDate: {
        fontSize: 12,
    },
    historyDetails: {
        marginBottom: 6,
    },
    usageChange: {
        marginTop: 4,
    },
    changeIndicator: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default DeviceHistoryPage;
