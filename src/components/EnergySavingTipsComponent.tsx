import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import {
    EnergySavingTip,
    getPersonalizedTips,
} from "../utils/energySavingTips";
import { LinearGradient } from "expo-linear-gradient";

const screenWidth = Dimensions.get("window").width;

interface EnergySavingTipsComponentProps {
    devices: any[];
    energyData: {
        today: number;
        weekly: number;
        monthly: number;
        yearly: number;
    };
}

const EnergySavingTipsComponent: React.FC<EnergySavingTipsComponentProps> = ({
    devices,
    energyData,
}) => {
    const { colors, isDarkMode } = useTheme();
    const [tips, setTips] = useState<EnergySavingTip[]>([]);
    const [expandedTip, setExpandedTip] = useState<string | null>(null);
    const [animatedValues] = useState<{ [key: string]: Animated.Value }>({});

    // Reference for scrolling to this component
    // This will be used to allow other components to reference and scroll to this one
    React.useEffect(() => {
        // This component can be referenced by ID for scrolling
    }, []);

    useEffect(() => {
        // Generate personalized tips based on devices and usage data
        const personalizedTips = getPersonalizedTips(devices, energyData);
        setTips(personalizedTips);

        // Initialize animation values
        personalizedTips.forEach((tip) => {
            animatedValues[tip.id] = new Animated.Value(0);
        });
    }, [devices, energyData]);

    const toggleExpand = (tipId: string) => {
        if (expandedTip === tipId) {
            // Collapse
            Animated.timing(animatedValues[tipId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setExpandedTip(null);
            });
        } else {
            // Expand new tip, collapse previous if exists
            if (expandedTip) {
                Animated.timing(animatedValues[expandedTip], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            }

            setExpandedTip(tipId);
            Animated.timing(animatedValues[tipId], {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case "high":
                return "#4CAF50"; // Green
            case "medium":
                return "#FFC107"; // Yellow
            case "low":
                return "#2196F3"; // Blue
            default:
                return colors.accent;
        }
    };

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
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
                    Energy Saving Tips
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Personalized recommendations to reduce energy consumption
                </Text>
            </LinearGradient>

            <ScrollView
                style={styles.tipsList}
                showsVerticalScrollIndicator={false}
            >
                {tips.length > 0 ? (
                    tips.map((tip) => (
                        <View
                            key={tip.id}
                            style={[
                                styles.tipCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor:
                                        expandedTip === tip.id
                                            ? colors.accent
                                            : colors.border,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.tipHeader}
                                onPress={() => toggleExpand(tip.id)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.tipTitleContainer}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            {
                                                backgroundColor: `${getImpactColor(
                                                    tip.impact
                                                )}20`,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={tip.iconName as any}
                                            size={24}
                                            color={getImpactColor(tip.impact)}
                                        />
                                    </View>
                                    <View>
                                        <Text
                                            style={[
                                                styles.tipTitle,
                                                { color: colors.text },
                                            ]}
                                        >
                                            {tip.title}
                                        </Text>
                                        <View style={styles.impactContainer}>
                                            <Text
                                                style={[
                                                    styles.impactText,
                                                    {
                                                        color: getImpactColor(
                                                            tip.impact
                                                        ),
                                                    },
                                                ]}
                                            >
                                                {tip.impact
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    tip.impact.slice(1)}{" "}
                                                Impact
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Ionicons
                                    name={
                                        expandedTip === tip.id
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>

                            {expandedTip === tip.id && (
                                <Animated.View
                                    style={[
                                        styles.tipContent,
                                        {
                                            maxHeight: animatedValues[
                                                tip.id
                                            ].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 500],
                                            }),
                                            opacity: animatedValues[tip.id],
                                            borderTopColor: colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tipDescription,
                                            { color: colors.text },
                                        ]}
                                    >
                                        {tip.description}
                                    </Text>
                                </Animated.View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons
                            name="bulb-outline"
                            size={48}
                            color={colors.textSecondary}
                        />
                        <Text
                            style={[
                                styles.emptyStateText,
                                { color: colors.text },
                            ]}
                        >
                            Add devices to get personalized energy saving tips
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    header: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
    },
    tipsList: {
        paddingHorizontal: 2,
    },
    tipCard: {
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        overflow: "hidden",
    },
    tipHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    tipTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    impactContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    impactText: {
        fontSize: 12,
        fontWeight: "500",
    },
    tipContent: {
        borderTopWidth: 1,
        padding: 16,
        paddingTop: 12,
    },
    tipDescription: {
        fontSize: 14,
        lineHeight: 22,
    },
    emptyState: {
        padding: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: "center",
    },
});

export default EnergySavingTipsComponent;
