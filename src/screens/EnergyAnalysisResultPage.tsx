import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#F5F9F8",
    backgroundGradientTo: "#E0F2EF",
    color: (opacity = 1) => `rgba(40, 63, 59, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(90, 122, 116, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    decimalPlaces: 0,
    propsForDots: {
        r: "5",
        strokeWidth: "2",
        stroke: "#D2D229"
    },
    propsForBackgroundLines: {
        strokeDasharray: "", // solid background lines
        stroke: "#D0E0DD",
        strokeWidth: 0.5
    }
};

// Enhanced dummy data
const energyData = {
    weekly: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
        data: [75, 90, 65, 80, 70, 95, 85],
        color: (opacity = 1) => `rgba(210, 210, 41, ${opacity})`,
        strokeWidth: 3,
        }],
        legend: ["Weekly Energy Output (kWh)"],
    },
    monthly: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [{
        data: [320, 350, 310, 380],
        colors: [
            (opacity = 1) => `rgba(210, 210, 41, ${opacity})`,
            (opacity = 1) => `rgba(153, 221, 200, ${opacity})`,
            (opacity = 1) => `rgba(40, 63, 59, ${opacity})`,
            (opacity = 1) => `rgba(210, 210, 41, ${opacity})`,
        ]
        }],
        legend: ["Monthly Energy Output (kWh)"],
    },
    applianceUsage: [
        { name: "AC", usage: 35, color: "#D2D229", legendFontColor: "#5A7A74" },
        { name: "Lights", usage: 20, color: "#99DDC8", legendFontColor: "#5A7A74" },
        { name: "Fridge", usage: 25, color: "#8AC6B0", legendFontColor: "#5A7A74" },
        { name: "TV", usage: 10, color: "#283F3B", legendFontColor: "#5A7A74" },
        { name: "Others", usage: 10, color: "#C4DFDA", legendFontColor: "#5A7A74" },
    ],
    comparison: {
        currentMonth: 1360,
        previousMonth: 1420,
        savingsPercentage: 4.2,
        peakHour: "7-8 PM",
        lowestHour: "3-4 AM"
    }
};

const EnergyAnalysisResultPage = () => {
    return (
        <ScrollView style={styles.container}>
        <LinearGradient colors={['#F5F9F8', '#E0F2EF']} style={styles.header}>
            <Text style={styles.title}>Energy Analytics Dashboard</Text>
            <Text style={styles.subtitle}>Your comprehensive energy usage analysis</Text>
        </LinearGradient>

        {/* Weekly Energy Chart */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Energy Consumption</Text>
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
                <Text style={styles.statLabel}>Total Weekly Usage</Text>
                <Text style={styles.statValue}>560 kWh</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Daily Average</Text>
                <Text style={styles.statValue}>80 kWh</Text>
            </View>
            </View>
        </View>

        {/* Monthly Energy Chart */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Energy Trend</Text>
            <BarChart
                    data={energyData.monthly}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    style={styles.chart}
                    yAxisSuffix=" kWh"
                    showBarTops={false}
                    fromZero={true} yAxisLabel={""}            />
            <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Current Month</Text>
                <Text style={styles.statValue}>1,360 kWh</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Savings</Text>
                <Text style={[styles.statValue, styles.savingsText]}>↓ {energyData.comparison.savingsPercentage}%</Text>
            </View>
            </View>
        </View>

        {/* Appliance Breakdown */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Appliance Energy Usage</Text>
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
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                <Text style={styles.applianceName}>{item.name}</Text>
                <Text style={styles.applianceValue}>{item.usage}%</Text>
                </View>
            ))}
            </View>
        </View>

        {/* Insights Section */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Energy Insights</Text>
            <View style={styles.insightItem}>
            <Text style={styles.insightText}>Your peak usage hour is <Text style={styles.highlight}>{energyData.comparison.peakHour}</Text></Text>
            </View>
            <View style={styles.insightItem}>
            <Text style={styles.insightText}>You've saved <Text style={styles.highlight}>{energyData.comparison.savingsPercentage}%</Text> compared to last month</Text>
            </View>
            <View style={styles.insightItem}>
            <Text style={styles.insightText}>Best time for energy-saving activities: <Text style={styles.highlight}>{energyData.comparison.lowestHour}</Text></Text>
            </View>
        </View>

        {/* Recommendations */}
        <View style={[styles.card, styles.recommendationCard]}>
            <Text style={styles.cardTitle}>Recommendations</Text>
            <View style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationText}>Consider upgrading your AC unit to an energy-efficient model</Text>
            </View>
            <View style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationText}>Install smart plugs to reduce standby power consumption</Text>
            </View>
            <View style={styles.recommendationItem}>
            <Text style={styles.recommendationBullet}>•</Text>
            <Text style={styles.recommendationText}>Shift laundry to off-peak hours (after 9 PM)</Text>
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F9F8",
    },
    header: {
        padding: 24,
        paddingBottom: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 16,
        shadowColor: "#283F3B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#283F3B",
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: "#5A7A74",
        textAlign: 'center',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#283F3B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    recommendationCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#D2D229",
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#283F3B",
        marginBottom: 16,
    },
    chart: {
        borderRadius: 12,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: "#5A7A74",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#283F3B",
    },
    savingsText: {
        color: "#4CAF50",
    },
    applianceList: {
        marginTop: 12,
    },
    applianceItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: "#5A7A74",
    },
    applianceValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#283F3B",
    },
    insightItem: {
        backgroundColor: "#F5F9F8",
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
    },
    insightText: {
        fontSize: 14,
        color: "#5A7A74",
        lineHeight: 20,
    },
    highlight: {
        color: "#283F3B",
        fontWeight: "600",
    },
    recommendationItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    recommendationBullet: {
        color: "#D2D229",
        fontSize: 20,
        marginRight: 8,
        lineHeight: 20,
    },
    recommendationText: {
        flex: 1,
        fontSize: 14,
        color: "#5A7A74",
        lineHeight: 20,
    },
});

export default EnergyAnalysisResultPage;