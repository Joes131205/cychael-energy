import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import {
    collection,
    query,
    where,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db, model } from "../utils/firebase";

import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "../hooks/useUser";

const screenWidth = Dimensions.get("window").width;
const EnergyAnalysisResultPage = () => {
    const { colors, isDarkMode } = useTheme();
    const [groupedData, setGroupedData] = useState<Record<string, any[]>>({});
    const [isLoadingAdvise, setIsLoadingAdvise] = useState(false);
    const [adviseText, setAdviseText] = useState("");
    const { userData, loading } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
    }, [userData, loading]);
    const getLastWeekDevices = async () => {
        try {
            const deviceHistory = userData.deviceHistory?.entries || [];
            const deviceList = userData.deviceList?.devices || [];

            const now = new Date();
            const lastWeekStart = new Date();
            lastWeekStart.setDate(now.getDate() - 7);
            lastWeekStart.setHours(0, 0, 0, 0);

            // Grouping result object
            const grouped: Record<string, any[]> = {};

            const todayKey = now.toISOString().split("T")[0];
            grouped[todayKey] = deviceList.map((device: any) => ({
                ...device,
                dateKey: todayKey,
            }));

            deviceHistory.forEach((entry: any) => {
                const entryDate = new Date(entry.timestamp);

                if (entryDate >= lastWeekStart && entryDate <= now) {
                    const dateKey =
                        entry.dateKey || entryDate.toISOString().split("T")[0];

                    if (!grouped[dateKey]) {
                        grouped[dateKey] = [];
                    }

                    const entryExists = grouped[dateKey].some(
                        (item: any) =>
                            item.deviceId === entry.deviceId &&
                            item.timestamp === entry.timestamp
                    );

                    if (!entryExists) {
                        grouped[dateKey].push({
                            name: entry.deviceName,
                            watt: entry.watt,
                            hours: entry.newHours,
                            category: entry.category || "other",
                            timestamp: entry.timestamp,
                            deviceId: entry.deviceId,
                            previousHours: entry.previousHours,
                            dateKey: dateKey,
                        });
                    }
                }
            });

            console.log("Grouped devices by date:", grouped);
            return grouped;
        } catch (error) {
            console.error("Error grouping devices:", error);
            return {};
        }
    };
    useEffect(() => {
        const fetchGroupedData = async () => {
            const data = await getLastWeekDevices();
            setGroupedData(data);
        };
        fetchGroupedData();
    }, []);    const weeklyGroupData = useMemo(() => {
        // Initialize with ordered days for display (starting with Sunday)
        const labels: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result: number[] = Array(7).fill(0); // One slot for each day
      
        const today = new Date();
        
        // Process the last 7 days data
        for (let i = 6; i >= 0; i--) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
      
          const dateKey = day.toISOString().split("T")[0];
          const dayIndex = day.getDay(); // Get day index (0=Sunday, 6=Saturday)
          
          // Get devices for this date
          const devices = groupedData[dateKey] || [];
      
          // Calculate total kWh for the day
          const totalKwh = devices.reduce((sum, device) => {
            const hours = device.hours || 0;
            const watt = device.watt || 0;
            return sum + (watt * hours) / 1000;
          }, 0);
      
          // Add to the corresponding day slot
          result[dayIndex] += Number(totalKwh.toFixed(2));
        }
      
        console.log("Weekly energy by day:", labels);
        console.log("Energy values (kWh):", result);
      
        return { labels, data: result };
      }, [groupedData]);
      
    const calculateDailyEnergy = useMemo(() => {
        if (
            !userData?.deviceList?.devices ||
            userData.deviceList.devices.length === 0
        ) {
            return 0;
        }

        return userData.deviceList.devices.reduce(
            (total: any, device: any) =>
                total + (device.watt * device.hours || 0) / 1000,
            0
        );
    }, [userData]);

    //   const weeklyData = useMemo(() => {
    //     getLastWeekDevices().then((groupedDevices) => {});
    //     // Generate slight variations based on daily energy
    //     const baseValue = calculateDailyEnergy;

    //     return Array(7)
    //       .fill(0)
    //       .map(() => {
    //         const variation = Math.random() * 0.3 - 0.15; // -15% to +15% variation
    //         return Number((baseValue * (1 + variation)).toFixed(2));
    //       });
    //   }, [calculateDailyEnergy]);

    // Generate monthly data (4 weeks)
    const monthlyData = useMemo(() => {
        if (!calculateDailyEnergy) {
            return {
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [{ data: [0, 0, 0, 0] }],
            };
        }

        // Calculate weekly totals with some variation
        const baseWeekly = calculateDailyEnergy * 7;
        const weeklyTotals = Array(4)
            .fill(0)
            .map((_, i) => {
                const variation = Math.random() * 0.2 - 0.05; // -5% to +15% variation
                return Number(
                    (baseWeekly * (1 + variation * (i + 1))).toFixed(2)
                );
            });

        return {
            labels: ["W1", "W2", "W3", "W4"],
            datasets: [{ data: weeklyTotals }],
        };
    }, [calculateDailyEnergy]);
    const handleAdvise = () => {
        const today = new Date();
        const result: {
            date: string;
            data: { name: string; watt: number; usage: number }[];
            totalkWh: number;
        }[] = [];

        for (let i = 6; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            const dateKey = day.toISOString().split("T")[0];
            const devices = groupedData[dateKey] || [];
            let dayTotal = 0;
            const deviceData = devices.map((device: any) => {
                const hours = device.hours || 0;
                const watt = device.watt || 0;
                const usage = (watt * hours) / 1000;
                dayTotal += usage;

                return {
                    name: device.name || "Unknown",
                    watt,
                    usage: Number(usage.toFixed(2)),
                };
            });
            result.push({
                date: dateKey,
                data: deviceData,
                totalkWh: Number(dayTotal.toFixed(2)),
            });
        }
        const textSummary = result
            .map((entry) => {
                const deviceDetails = entry.data
                    .map(
                        (d) => `- ${d.name}: ${d.watt}W, Usage: ${d.usage} kWh`
                    )
                    .join("\n");

                return `📅 ${entry.date}\n${deviceDetails}\n🔋 Total: ${entry.totalkWh} kWh\n`;
            })
            .join("\n");
        setIsLoading(true);
        setAdviseText("");
        const prompt = `${textSummary}\nbased on that data, what your advise and analysis? short, only under 350 words without asterisk (*) in result`;
        const ai = model.generateContent(prompt);

        ai.then((res): void => {
            let x = res.response.text;
            setAdviseText(x);
            setIsLoading(false);
        });
    };
    // Device usage breakdown
    const applianceUsageData = useMemo(() => {
        if (
            !userData?.deviceList?.devices ||
            userData.deviceList.devices.length === 0
        ) {
            return [];
        }

        const totalWattage = userData.deviceList.devices.reduce(
            (total: any, device: any) =>
                total + (device.watt * device.hours || 0),
            0
        );

        if (totalWattage === 0) return [];

        const deviceMap = new Map();
        userData.deviceList.devices.forEach((device: any) => {
            const deviceUsage =
                ((device.watt * device.hours) / totalWattage) * 100;
            deviceMap.set(
                device.name,
                (deviceMap.get(device.name) || 0) + deviceUsage
            );
        });

        const colorPalette = [
            colors.accent,
            colors.secondary,
            "#8AC6B0",
            colors.primary,
            "#C4DFDA",
            "#FFA69E",
            "#AED9E0",
        ];

        return Array.from(deviceMap.entries())
            .map(([name, usage], index) => ({
                name,
                usage: parseFloat(usage.toFixed(1)),
                color: colorPalette[index % colorPalette.length],
                legendFontColor: colors.textSecondary,
            }))
            .sort((a, b) => b.usage - a.usage)
            .slice(0, 5);
    }, [userData, colors]);

    // Comparison data (simulated based on current usage)
    const comparisonData = useMemo(() => {
        if (!calculateDailyEnergy) {
            return {
                currentWeek: 0,
                previousWeek: 0,
                savingsPercentage: 0,
                peakHour: "N/A",
                lowestHour: "N/A",
            };
        }

        const currentWeekTotal = calculateDailyEnergy * 7;
        const previousWeekTotal = currentWeekTotal * (1 + Math.random() * 0.2);

        const savingsPercentage =
            previousWeekTotal === 0
                ? 0
                : ((previousWeekTotal - currentWeekTotal) / previousWeekTotal) *
                  100;

        return {
            currentWeek: currentWeekTotal,
            previousWeek: previousWeekTotal,
            savingsPercentage: parseFloat(savingsPercentage.toFixed(1)),
            peakHour: "7-8 PM",
            lowestHour: "3-4 AM",
        };
    }, [calculateDailyEnergy]);

    const chartConfig = {
        backgroundGradientFrom: isDarkMode ? colors.card : colors.background,
        backgroundGradientTo: isDarkMode ? colors.card : colors.background,
        color: (opacity = 1) => `rgba(${hexToRgb(colors.accent)}, ${opacity})`,
        labelColor: (opacity = 1) =>
            `rgba(${hexToRgb(colors.textSecondary)}, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.65,
        decimalPlaces: 0,
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: colors.accent,
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: colors.border,
            strokeWidth: 0.5,
        },
        formatXLabel: (label: string) => label.substring(0, 3), // Shorten labels if needed
        horizontalLabelRotation: 0,
        useShadowColorFromDataset: false,
    };

    if (isLoading || loading) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                        justifyContent: "center",
                        alignItems: "center",
                    },
                ]}
            >
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ marginTop: 20, color: colors.text }}>
                    Loading energy data...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <LinearGradient
                colors={
                    isDarkMode
                        ? [colors.card, colors.secondary]
                        : [colors.background, colors.background]
                }
                style={[styles.header, { backgroundColor: colors.card }]}
            >
                <Text style={[styles.title, { color: colors.text }]}>
                    Energy Analytics Dashboard
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Your comprehensive energy usage analysis
                </Text>
            </LinearGradient>
            {/* Weekly Energy Chart */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Weekly Energy Consumption
                </Text>                    <LineChart
                    data={{
                        labels: weeklyGroupData.labels,
                        datasets: [
                            {
                                data: weeklyGroupData.data,
                                color: (opacity = 1) =>
                                    `rgba(${hexToRgb(
                                        colors.accent
                                    )}, ${opacity})`,
                                strokeWidth: 3,
                            },
                        ],
                        legend: ["Weekly Energy Output (kWh)"],
                    }}
                    width={screenWidth - 60}
                    height={240}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withShadow={true}
                    withInnerLines={false}
                />
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Total Weekly Usage
                        </Text>
                        <Text
                            style={[styles.statValue, { color: colors.text }]}
                        >                            {weeklyGroupData.data
                                .reduce((a, b) => a + b, 0)
                                .toFixed(1)}
                            kWh
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Daily Average
                        </Text>
                        <Text
                            style={[styles.statValue, { color: colors.text }]}
                        >                            {(
                                weeklyGroupData.data.reduce((a, b) => a + b, 0) / 7
                            ).toFixed(2)}
                            kWh
                        </Text>
                    </View>
                </View>
            </View>
            {/* Monthly Energy Chart */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Monthly Energy Trend
                </Text>
                <BarChart
                    data={monthlyData}
                    width={screenWidth - 60}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    yAxisSuffix=" kWh"
                    showBarTops={false}
                    fromZero={true}
                    yAxisLabel={""}
                    withInnerLines={false}
                />
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Current Month
                        </Text>
                        <Text
                            style={[styles.statValue, { color: colors.text }]}
                        >
                            {monthlyData.datasets[0].data
                                .reduce((a, b) => a + b, 0)
                                .toFixed(1)}
                            kWh
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text
                            style={[
                                styles.statLabel,
                                { color: colors.textSecondary },
                            ]}
                        >
                            Savings
                        </Text>
                        <Text
                            style={[
                                styles.statValue,
                                styles.savingsText,
                                {
                                    color:
                                        comparisonData.savingsPercentage >= 0
                                            ? colors.success
                                            : "#FF5252",
                                },
                            ]}
                        >
                            {comparisonData.savingsPercentage >= 0 ? "↓" : "↑"}
                            {Math.abs(comparisonData.savingsPercentage).toFixed(
                                1
                            )}
                            %
                        </Text>
                    </View>
                </View>
            </View>
            {/* Appliance Breakdown */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Appliance Energy Usage
                </Text>
                {applianceUsageData.length > 0 ? (
                    <>
                        <PieChart
                            data={applianceUsageData}
                            width={screenWidth - 60}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="usage"
                            backgroundColor="transparent"
                            paddingLeft="25"
                            absolute
                            style={styles.chart}
                            hasLegend={false}
                        />
                        <View style={styles.applianceList}>
                            {applianceUsageData.map((item, index) => (
                                <View key={index} style={styles.applianceItem}>
                                    <View
                                        style={[
                                            styles.colorIndicator,
                                            { backgroundColor: item.color },
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.applianceName,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.applianceValue,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {item.usage}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <Text
                        style={{
                            color: colors.textSecondary,
                            textAlign: "center",
                            padding: 20,
                        }}
                    >
                        No appliance data available
                    </Text>
                )}
            </View>
            {/* Saran */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    AI Advisor
                </Text>
                <Text
                    style={[
                        styles.applianceName,
                        { color: colors.textSecondary },
                    ]}
                >
                    {adviseText}
                </Text>

                <TouchableOpacity
                    className="mt-2 items-center py-2"
                    onPress={() => handleAdvise()}
                >
                    <Text
                        className="text-xs font-semibold"
                        style={{ color: colors.accent }}
                    >
                        click here to get helpful advise
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingBottom: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
    },
    card: {
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: "hidden", // Prevent content from overflowing card bounds
    },
    recommendationCard: {
        borderLeftWidth: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
    },
    chart: {
        borderRadius: 12,
        marginBottom: 16,
        marginLeft: -15, // Adjust horizontal positioning to prevent overflow
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
    },
    savingsText: {},
    applianceList: {
        marginTop: 12,
    },
    applianceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    applianceName: {
        flex: 1,
        fontSize: 14,
    },
    applianceValue: {
        fontSize: 14,
        fontWeight: "600",
    },
    insightItem: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    insightText: {
        fontSize: 14,
        lineHeight: 20,
    },
    highlight: {
        fontWeight: "600",
    },
    recommendationItem: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "flex-start",
    },
    recommendationBullet: {
        fontSize: 20,
        marginRight: 8,
        lineHeight: 20,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});

export default EnergyAnalysisResultPage;
