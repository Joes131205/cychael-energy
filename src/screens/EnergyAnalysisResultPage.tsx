import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";
import { useUser } from "../hooks/useUser";

const screenWidth = Dimensions.get("window").width;

const EnergyAnalysisResultPage = () => {
    const { colors, isDarkMode } = useTheme();
    const user = useUser();

    console.log(user);

    const [data, setData] = useState(user.userData.energyData);
    // Dynamic chart config based on theme
    const chartConfig = {
        backgroundGradientFrom: isDarkMode ? colors.card : colors.background,
        backgroundGradientTo: isDarkMode ? colors.card : colors.background,
        color: (opacity = 1) => `rgba(${hexToRgb(colors.accent)}, ${opacity})`,
        labelColor: (opacity = 1) =>
            `rgba(${hexToRgb(colors.textSecondary)}, ${opacity})`,
        strokeWidth: 3,
        barPercentage: 0.7,
        decimalPlaces: 0,
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: colors.accent,
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: colors.border,
            strokeWidth: 0.5,
        },
    };

    // Enhanced dummy data
    const energyData = {
        weekly: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    data:
                        Array.isArray(data) && data.length > 0
                            ? data
                                  .slice(0, 7)
                                  .map((item) => item.energyUsage?.daily || 0)
                            : [0, 0, 0, 0, 0, 0, 0],
                    color: (opacity = 1) =>
                        `rgba(${hexToRgb(colors.accent)}, ${opacity})`,
                    strokeWidth: 3,
                },
            ],
            legend: ["Weekly Energy Output (kWh)"],
        },
        monthly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
                {
                    data: [320, 350, 310, 380],
                    colors: [
                        (opacity = 1) =>
                            `rgba(${hexToRgb(colors.accent)}, ${opacity})`,
                        (opacity = 1) =>
                            `rgba(${hexToRgb(colors.secondary)}, ${opacity})`,
                        (opacity = 1) =>
                            `rgba(${hexToRgb(colors.primary)}, ${opacity})`,
                        (opacity = 1) =>
                            `rgba(${hexToRgb(colors.accent)}, ${opacity})`,
                    ],
                },
            ],
            legend: ["Monthly Energy Output (kWh)"],
        },
        applianceUsage: [
            {
                name: "AC",
                usage: 35,
                color: colors.accent,
                legendFontColor: colors.textSecondary,
            },
            {
                name: "Lights",
                usage: 20,
                color: colors.secondary,
                legendFontColor: colors.textSecondary,
            },
            {
                name: "Fridge",
                usage: 25,
                color: "#8AC6B0",
                legendFontColor: colors.textSecondary,
            },
            {
                name: "TV",
                usage: 10,
                color: colors.primary,
                legendFontColor: colors.textSecondary,
            },
            {
                name: "Others",
                usage: 10,
                color: "#C4DFDA",
                legendFontColor: colors.textSecondary,
            },
        ],
        comparison: {
            currentMonth: 1360,
            previousMonth: 1420,
            savingsPercentage: 4.2,
            peakHour: "7-8 PM",
            lowestHour: "3-4 AM",
        },
    };

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
                </Text>
                <LineChart
                    data={energyData.weekly}
                    width={screenWidth - 40}
                    height={240}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withShadow={true}
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
                        >
                            {Array.isArray(data) && data.length > 0
                                ? data
                                      .slice(0, 7)
                                      .map(
                                          (item) => item.energyUsage?.daily || 0
                                      )
                                      .reduce((a, b) => a + b, 0)
                                : 0}{" "}
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
                            {Array.isArray(data) && data.length > 0
                                ? (
                                      data
                                          .slice(0, 7)
                                          .map(
                                              (item) =>
                                                  item.energyUsage?.daily || 0
                                          )
                                          .reduce((a, b) => a + b, 0) / 7
                                  ).toFixed(2)
                                : 0}{" "}
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
                    data={energyData.monthly}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    yAxisSuffix=" kWh"
                    showBarTops={false}
                    fromZero={true}
                    yAxisLabel={""}
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
                            1,360 kWh
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
                                { color: colors.success },
                            ]}
                        >
                            ↓ {energyData.comparison.savingsPercentage}%
                        </Text>
                    </View>
                </View>
            </View>

            {/* Appliance Breakdown */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Appliance Energy Usage
                </Text>
                <PieChart
                    data={energyData.applianceUsage}
                    width={screenWidth - 40}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="usage"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={styles.chart}
                />
                <View style={styles.applianceList}>
                    {energyData.applianceUsage.map((item, index) => (
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
            </View>

            {/* Insights Section */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Energy Insights
                </Text>
                <View
                    style={[
                        styles.insightItem,
                        {
                            backgroundColor: isDarkMode
                                ? colors.secondary
                                : colors.background,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.insightText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Your peak usage hour is{" "}
                        <Text
                            style={[styles.highlight, { color: colors.text }]}
                        >
                            {energyData.comparison.peakHour}
                        </Text>
                    </Text>
                </View>
                <View
                    style={[
                        styles.insightItem,
                        {
                            backgroundColor: isDarkMode
                                ? colors.secondary
                                : colors.background,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.insightText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        You've saved{" "}
                        <Text
                            style={[styles.highlight, { color: colors.text }]}
                        >
                            {energyData.comparison.savingsPercentage}%
                        </Text>{" "}
                        compared to last month
                    </Text>
                </View>
                <View
                    style={[
                        styles.insightItem,
                        {
                            backgroundColor: isDarkMode
                                ? colors.secondary
                                : colors.background,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.insightText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Best time for energy-saving activities:{" "}
                        <Text
                            style={[styles.highlight, { color: colors.text }]}
                        >
                            {energyData.comparison.lowestHour}
                        </Text>
                    </Text>
                </View>
            </View>

            {/* Recommendations */}
            <View
                style={[
                    styles.card,
                    styles.recommendationCard,
                    {
                        backgroundColor: colors.card,
                        borderLeftColor: colors.accent,
                    },
                ]}
            >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Recommendations
                </Text>
                <View style={styles.recommendationItem}>
                    <Text
                        style={[
                            styles.recommendationBullet,
                            { color: colors.accent },
                        ]}
                    >
                        •
                    </Text>
                    <Text
                        style={[
                            styles.recommendationText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Consider upgrading your AC unit to an energy-efficient
                        model
                    </Text>
                </View>
                <View style={styles.recommendationItem}>
                    <Text
                        style={[
                            styles.recommendationBullet,
                            { color: colors.accent },
                        ]}
                    >
                        •
                    </Text>
                    <Text
                        style={[
                            styles.recommendationText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Install smart plugs to reduce standby power consumption
                    </Text>
                </View>
                <View style={styles.recommendationItem}>
                    <Text
                        style={[
                            styles.recommendationBullet,
                            { color: colors.accent },
                        ]}
                    >
                        •
                    </Text>
                    <Text
                        style={[
                            styles.recommendationText,
                            { color: colors.textSecondary },
                        ]}
                    >
                        Shift laundry to off-peak hours (after 9 PM)
                    </Text>
                </View>
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
