import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Animated,
    BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

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
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useUser } from "../hooks/useUser";
import Markdown from "react-native-markdown-display";
import EnergySavingTipsComponent from "../components/EnergySavingTipsComponent";

const screenWidth = Dimensions.get("window").width;

const EnergyAnalysisResultPage = () => {
    const { colors, isDarkMode } = useTheme();
    const { userData, loading } = useUser();
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [groupedData, setGroupedData] = useState<Record<string, any[]>>({});
    const [isLoadingAdvise, setIsLoadingAdvise] = useState(false);
    const [adviseText, setAdviseText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // LineChart - MXA
    // NEW: State for line chart tooltip
    const [lineTooltipVisible, setLineTooltipVisible] = useState(false);
    const [lineTooltipData, setLineTooltipData] = useState<{
        x: number;
        y: number;
        label: string;
        value: number;
        date: string;
    } | null>(null);
    const lineFadeAnim = useRef(new Animated.Value(0)).current;

    // State for Tooltip - MXA
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipData, setTooltipData] = useState<{
        x: number;
        y: number;
        label: string;
        value: number | string;
        type: string;
    } | null>(null);

    useEffect(() => {
        if (!loading) {
            setIsLoading(false);
        }
    }, [userData, loading]);

    useEffect(() => {
        const fetchGroupedData = async () => {
            const data = await getLastWeekDevices();
            setGroupedData(data);
        };
        fetchGroupedData();
    }, []);

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

            // Masukkan data hari ini dari deviceList
            grouped[todayKey] = deviceList.map((device: any) => ({
                ...device,
                dateKey: todayKey,
            }));

            // Masukkan data historis dari deviceHistory
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
    }, []);

    const weeklyGroupData = useMemo(() => {
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result: number[] = Array(7).fill(0); // Untuk 7 hari

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

        // Calculate overall statistics
        const totalWeeklyUsage = result
            .reduce((sum, day) => sum + day.totalkWh, 0)
            .toFixed(2);
        const avgDailyUsage = (Number(totalWeeklyUsage) / 7).toFixed(2);
        // Find highest consumption device
        let highestConsumptionDevice = { name: "", totalUsage: 0 };
        const deviceTotals: Record<string, number> = {};

        result.forEach((day) => {
            day.data.forEach((device) => {
                if (!deviceTotals[device.name]) {
                    deviceTotals[device.name] = 0;
                }
                deviceTotals[device.name] += device.usage;

                if (
                    deviceTotals[device.name] >
                    highestConsumptionDevice.totalUsage
                ) {
                    highestConsumptionDevice = {
                        name: device.name,
                        totalUsage: deviceTotals[device.name],
                    };
                }
            });
        });

        setIsLoading(true);
        setAdviseText("");

        const prompt = `
# Energy Consumption Data (Last 7 Days)

${textSummary}

## Summary Statistics:
- Total Weekly Usage: ${totalWeeklyUsage} kWh
- Average Daily Usage: ${avgDailyUsage} kWh
- Highest Energy Consumer: ${
            highestConsumptionDevice.name
        } (${highestConsumptionDevice.totalUsage.toFixed(2)} kWh)

## Instructions:
As an energy efficiency expert, please analyze this household's energy consumption data and provide:

1. A concise assessment of the overall energy usage pattern
2. Identification of the most energy-intensive devices and consumption anomalies
3. Personalized recommendations to reduce energy consumption
4. Estimated potential savings (percentage) if recommendations are followed
5. Long-term benefits of implementing your suggestions

Format your response as a professional consultation with clear sections, but keep it under 350 words total. Use natural, conversational language that's easy for non-experts to understand. Focus on actionable insights rather than just describing the data.
`;

        const ai = model.generateContent(prompt);
        ai.then((res): void => {
            let x = res.response.text;
            setAdviseText(x);
            setIsLoading(false);

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 300);
        }).catch((error) => {
            console.error("AI analysis error:", error);
            setAdviseText(
                "Sorry, we couldn't generate an analysis at this time. Please try again later."
            );
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

    // Handle Chart - MXA
    const handleChartPress = (data: any, chartType: string) => {
        if (data && data.length > 0) {
            const point = data[0];
            let label, value;

            if (chartType === "weekly") {
                label = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                    point.index
                ];
                value = weeklyGroupData.data[point.index];
            } else if (chartType === "monthly") {
                label = ["W1", "W2", "W3", "W4"][point.index];
                value = monthlyData.datasets[0].data[point.index];
            } else if (chartType === "pie") {
                const item = applianceUsageData[point.index];
                label = item.name;
                value = item.usage + "%";
            }

            setTooltipData({
                x: point.x ?? 0,
                y: point.y ?? 0,
                label,
                value: value ?? "",
                type: chartType,
            });

            // Animate tooltip appearance
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            setTooltipVisible(true);
        }
    };

    const hideTooltip = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setTooltipVisible(false);
        });
    };

    // NEW: Handle scroll to hide tooltip
    const handleScroll = () => {
        if (tooltipVisible) {
            hideTooltip();
        }
    };

    // Add to your existing BarChart component:
    const renderBar = (props: any) => {
        const { index, x, y, width, height } = props;
        return (
            <TouchableOpacity
                key={`bar-${index}`}
                onPress={() => handleChartPress([{ index, x, y }], "monthly")}
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width,
                    height,
                    backgroundColor:
                        tooltipVisible &&
                        tooltipData?.type === "monthly" &&
                        tooltipData?.label === monthlyData.labels[index]
                            ? colors.accent
                            : `rgba(${hexToRgb(colors.accent)}, 0.7)`,
                }}
            />
        );
    };

    // NEW: Handle line chart press
    const handleLinePress = (data: any) => {
        if (data && data.length > 0) {
            const point = data[0];
            const dayIndex = point.index;
            const dayLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                dayIndex
            ];

            // Get the actual date from groupedData if available
            const dates = Object.keys(groupedData);
            const dateKey = dates[dayIndex] || "";
            const formattedDate = dateKey
                ? new Date(dateKey).toLocaleDateString()
                : "";

            setLineTooltipData({
                x: point.x ?? 0,
                y: point.y ?? 0,
                label: dayLabel,
                value: weeklyGroupData.data[dayIndex],
                date: formattedDate,
            });

            // Animate tooltip appearance
            Animated.timing(lineFadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            setLineTooltipVisible(true);
        }
    };

    // NEW: Hide line tooltip
    // What this do bruh
    const hideLineTooltip = () => {
        Animated.timing(lineFadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setLineTooltipVisible(false);
        });
    };

    // NEW: Custom decorator for line chart points
    const renderDots = (props: any) => {
        const { x, y, index } = props;
        return (
            <TouchableOpacity
                key={`dot-${index}`}
                onPress={() => handleLinePress([{ ...props }])}
                style={{
                    position: "absolute",
                    left: x - 15,
                    top: y - 15,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.accent,
                    }}
                />
            </TouchableOpacity>
        );
    };

    // Ini Return
    return (
        <ScrollView
            ref={scrollViewRef}
            style={[styles.container, { backgroundColor: colors.background }]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <LinearGradient
                colors={
                    isDarkMode
                        ? [colors.card, colors.secondary]
                        : ["#F8FBFA", "#DFFFF8"]
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
            {/* Tooltip component */}
            {tooltipVisible && tooltipData && (
                <Animated.View
                    style={[
                        styles.tooltip,
                        {
                            left: tooltipData.x - 50,
                            top: tooltipData.y - 60,
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            opacity: fadeAnim,
                            transform: [
                                {
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                    pointerEvents="none"
                >
                    <Text style={[styles.tooltipLabel, { color: colors.text }]}>
                        {tooltipData.label}
                    </Text>
                    <Text
                        style={[styles.tooltipValue, { color: colors.accent }]}
                    >
                        {tooltipData.value}{" "}
                        {tooltipData.type === "pie" ? "" : "kWh"}
                    </Text>
                </Animated.View>
            )}
            {/* Weekly Energy Chart with interactive dots */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Weekly Energy Consumption
                </Text>

                <LineChart
                    data={{
                        labels: [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                        ],
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
                    decorator={renderDots} // Tambahkan untuk tooltip support
                    onDataPointClick={({
                        value,
                        dataset,
                        getColor,
                        index,
                        x,
                        y,
                    }) => {
                        const dayLabel = [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                        ][index];
                        const dateKey = Object.keys(groupedData)[index] || "";
                        const formattedDate = dateKey
                            ? new Date(dateKey).toLocaleDateString()
                            : "";

                        setLineTooltipData({
                            x: x + 15,
                            y: y + 90,
                            label: dayLabel,
                            value,
                            date: formattedDate,
                        });

                        Animated.timing(lineFadeAnim, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }).start();

                        setLineTooltipVisible(true);
                    }}
                />

                {/* Tooltip component */}
                {lineTooltipVisible && lineTooltipData && (
                    <Animated.View
                        style={[
                            styles.tooltip,
                            {
                                left: lineTooltipData.x - 60,
                                top: lineTooltipData.y - 80,
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                opacity: lineFadeAnim,
                                transform: [
                                    {
                                        translateY: lineFadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [10, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                        pointerEvents="none"
                    >
                        <Text
                            style={[
                                styles.tooltipLabel,
                                { color: colors.text },
                            ]}
                        >
                            {lineTooltipData.label}
                        </Text>
                        <Text
                            style={[
                                styles.tooltipDate,
                                { color: colors.textSecondary },
                            ]}
                        >
                            {lineTooltipData.date && lineTooltipData.date}
                        </Text>

                        <Text
                            style={[
                                styles.tooltipValue,
                                { color: colors.accent },
                            ]}
                        >
                            {lineTooltipData.value.toFixed(2)} kWh
                        </Text>
                    </Animated.View>
                )}

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
                        >
                            {weeklyGroupData.data
                                .reduce((a, b) => a + b, 0)
                                .toFixed(1)}{" "}
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
                        >
                            {(
                                weeklyGroupData.data.reduce(
                                    (a, b) => a + b,
                                    0
                                ) / 7
                            ).toFixed(2)}{" "}
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
                        <View style={{ position: "relative" }}>
                            <PieChart
                                data={applianceUsageData}
                                width={screenWidth - 60}
                                height={200}
                                chartConfig={chartConfig}
                                accessor="usage"
                                backgroundColor="transparent"
                                paddingLeft="25"
                                absolute
                                hasLegend={false}
                                style={styles.chart}
                            />
                            {applianceUsageData.map((_, index) => (
                                <TouchableOpacity
                                    key={`touchable-${index}`}
                                    style={{
                                        position: "absolute",
                                        width: (screenWidth - 60) / 2,
                                        height: 200,
                                        left: (screenWidth - 60) / 4,
                                        top: 0,
                                        transform: [
                                            {
                                                rotate: `${
                                                    (index /
                                                        applianceUsageData.length) *
                                                    360
                                                }deg`,
                                            },
                                        ],
                                        opacity: 0.3, // Tetap tak terlihat, tapi bisa disentuh
                                    }}
                                    onPress={() =>
                                        handleChartPress([{ index }], "pie")
                                    }
                                />
                            ))}
                        </View>

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
                <Markdown
                    style={{
                        body: {
                            ...styles.applianceName,
                            color: colors.textSecondary,
                        },
                    }}
                >
                    {adviseText}
                </Markdown>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            marginRight: 8,
                            alignItems: "center",
                            paddingVertical: 12,
                            backgroundColor: colors.accent,
                            borderRadius: 8,
                            flexDirection: "row",
                            justifyContent: "center",
                            opacity: isLoadingAdvise ? 0.7 : 1,
                        }}
                        activeOpacity={0.85}
                        disabled={isLoadingAdvise}
                        onPress={() => {
                            setIsLoadingAdvise(true);
                            handleAdvise();
                            setTimeout(() => setIsLoadingAdvise(false), 2000);
                        }}
                    >
                        {isLoadingAdvise ? (
                            <ActivityIndicator
                                size="small"
                                color={colors.background}
                                style={{ marginRight: 8 }}
                            />
                        ) : (
                            <View
                                style={{
                                    width: 22,
                                    height: 22,
                                    borderRadius: 11,
                                    backgroundColor: colors.background,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.accent,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    💡
                                </Text>
                            </View>
                        )}
                        <Text
                            style={{
                                color: colors.background,
                                fontWeight: "700",
                                fontSize: 15,
                                letterSpacing: 0.2,
                            }}
                        >
                            {isLoadingAdvise
                                ? "Generating advice..."
                                : "Get AI Advice"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            alignItems: "center",
                            paddingVertical: 12,
                            backgroundColor: `${colors.accent}20`,
                            borderRadius: 8,
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                        activeOpacity={0.85}
                        onPress={() => {
                            // Scroll to the Energy Saving Tips section
                            setTimeout(() => {
                                scrollViewRef.current?.scrollToEnd({
                                    animated: true,
                                });
                            }, 100);
                        }}
                    >
                        <Ionicons
                            name="bulb-outline"
                            size={20}
                            color={colors.accent}
                            style={{ marginRight: 8 }}
                        />
                        <Text
                            style={{
                                color: colors.accent,
                                fontWeight: "700",
                                fontSize: 15,
                                letterSpacing: 0.2,
                            }}
                        >
                            Energy Tips
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Energy Saving Tips Section */}
            <View
                style={[
                    { marginHorizontal: 20, marginTop: 16, marginBottom: 30 },
                ]}
            >
                <EnergySavingTipsComponent
                    devices={userData?.deviceList?.devices || []}
                    energyData={{
                        today: calculateDailyEnergy || 0,
                        weekly: (calculateDailyEnergy || 0) * 7,
                        monthly: (calculateDailyEnergy || 0) * 30,
                        yearly: (calculateDailyEnergy || 0) * 365,
                    }}
                />
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

    tooltip: {
        position: "absolute",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
        minWidth: 100,
        alignItems: "center",
    },
    tooltipLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    tooltipValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    tooltipDate: {
        fontSize: 12,
        marginBottom: 4,
    },
});

export default EnergyAnalysisResultPage;
