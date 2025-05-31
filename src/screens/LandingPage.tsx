import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    ImageSourcePropType,
    ScrollView,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../hooks/useTheme";
import { useUser } from "../hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/common/Button";
import { RootStackParamList } from "../navigation/Navigation";

type LandingPageNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Login"
>;

interface LandingPageProps {
    navigation: LandingPageNavigationProp;
}

interface FeatureItemProps {
    icon: string;
    text: string;
    colors: any;
}

const FeatureItem = ({ icon, text, colors }: FeatureItemProps) => {
    const { isDarkMode } = useTheme();
    return (
        <View style={styles.featureItem}>
            <View
                style={[
                    styles.featureIcon,
                    { 
                        backgroundColor: isDarkMode ? colors.secondary + "20" : colors.accent + "15",
                    },
                ]}
            >
                <Ionicons name={icon as any} size={22} color={isDarkMode ? colors.accent : colors.primary} />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>{text}</Text>
        </View>
    );
};

const { width } = Dimensions.get("window");

const LandingPage: React.FC<LandingPageProps> = ({ navigation }) => {
    const { colors, isDarkMode } = useTheme();
    const energyIllustration: ImageSourcePropType = require("../../assets/logo.jpg");
    const { user } = useUser();

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;
    const featuresOpacity = useRef(new Animated.Value(0)).current;
    const featuresTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        if (user) {
            navigation.navigate("Dashboard" as never);
        }

        // Start animations
        Animated.parallel([
            // Fade in main content
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            // Move up main content
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            // Fade in features with delay
            Animated.timing(featuresOpacity, {
                toValue: 1,
                duration: 800,
                delay: 400,
                useNativeDriver: true,
            }),
            // Move up features with delay
            Animated.timing(featuresTranslateY, {
                toValue: 0,
                duration: 800,
                delay: 400,
                useNativeDriver: true,
            }),
        ]).start();    }, [user, fadeAnim, translateY, featuresOpacity, featuresTranslateY]); 
    
    // Define gradient colors that will work with LinearGradient
    const gradientColors = isDarkMode
        ? ["#0A1A17", "#081310"]
        : ["#F8FBFA", "#E8F5F0"];

    return (
        <LinearGradient colors={gradientColors as any} style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
            >
                {/* Logo/App Name */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        { opacity: fadeAnim, transform: [{ translateY }] },
                    ]}
                >
                    <Text style={[styles.logoFirst, { color: colors.accent }]}>
                        Cychael
                    </Text>
                    <Text
                        style={[styles.logoSecond, { color: colors.secondary }]}
                    >
                        of Energy
                    </Text>
                </Animated.View>

                {/* Hero Image */}
                <Animated.View
                    style={{ opacity: fadeAnim, transform: [{ translateY }] }}
                >
                    <Image
                        source={energyIllustration}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* App Description */}                <Animated.Text
                    style={[
                        styles.description,
                        {
                            color: colors.text,
                            opacity: fadeAnim,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    Smart energy analysis for your home. Track consumption,
                    reduce waste, and save money with personalized
                    recommendations.
                </Animated.Text>

                {/* Features List */}
                <Animated.View
                    style={[
                        styles.featuresContainer,
                        {
                            opacity: featuresOpacity,
                            transform: [{ translateY: featuresTranslateY }],
                        },
                    ]}
                >
                    <FeatureItem
                        icon="flash-outline"
                        text="Real-time energy tracking"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="bulb-outline"
                        text="Smart savings suggestions"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="bar-chart-outline"
                        text="Detailed consumption reports"
                        colors={colors}
                    />
                    <FeatureItem
                        icon="wallet-outline"
                        text="Energy cost calculator"
                        colors={colors}
                    />
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: featuresOpacity,
                            transform: [{ translateY: featuresTranslateY }],
                        },
                    ]}
                >
                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login")}
                        variant="primary"
                    />
                    <Button
                        title="Register"
                        onPress={() => navigation.navigate("Register")}
                        variant="secondary"
                    />
                </Animated.View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
    },
    content: {
        padding: 30,
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: "center",
        minHeight: "100%",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoFirst: {
        fontSize: 42,
        fontWeight: "800",
        fontStyle: "italic",
        textShadowColor: "rgba(0, 0, 0, 0.2)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    logoSecond: {
        fontSize: 24,
        fontWeight: "300",
        marginTop: -8,
    },    heroImage: {
        width: 180,
        height: 180,
        marginBottom: 30,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: "rgba(52, 168, 83, 0.3)", // Using accent color with transparency
    },
    description: {
        fontSize: 17,
        textAlign: "center",
        lineHeight: 26,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    featuresContainer: {
        width: "100%",
        marginBottom: 40,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
        paddingHorizontal: 10,
    },
    featureIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    iconText: {
        fontSize: 22,
    },
    featureText: {
        fontSize: 17,
        flex: 1,
        fontWeight: "500",
    },
    buttonContainer: {
        width: "100%",
        marginTop: 10,
    },
});

export default LandingPage;
