import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
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

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

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
                        backgroundColor: isDarkMode
                            ? colors.secondary + "20"
                            : colors.accent + "15",
                    },
                ]}
            >
                <Ionicons
                    name={icon as any}
                    size={22}
                    color={isDarkMode ? colors.accent : colors.primary}
                />
            </View>
            <Text style={[styles.featureText, { color: colors.text }]}>
                {text}
            </Text>
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
            navigation.replace("Dashboard");
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
        ]).start();
    }, [user, fadeAnim, translateY, featuresOpacity, featuresTranslateY]);

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
                <View style={styles.logoContainer}>
                    <Text style={[styles.logoFirst, { color: "#34A853" }]}>
                        Cychael
                    </Text>
                    <Text style={[styles.logoSecond, { color: "#2DCB97" }]}>
                        of Energy
                    </Text>
                </View>
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
                <Animated.Text
                    style={[styles.description, { color: colors.text }]}
                >
                    Smart energy analysis for your home. Track consumption,
                    reduce waste, and save money with personalized
                    recommendations.
                </Animated.Text>
                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: "rgba(30, 111, 92, 0.2)" },
                            ]}
                        >
                            <Text style={styles.iconText}>⚡</Text>
                        </View>
                        <Text
                            style={[styles.featureText, { color: colors.text }]}
                        >
                            Real-time energy tracking
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: "rgba(30, 111, 92, 0.2)" },
                            ]}
                        >
                            <Text style={styles.iconText}>💡</Text>
                        </View>
                        <Text
                            style={[styles.featureText, { color: colors.text }]}
                        >
                            Smart savings suggestions
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: "rgba(30, 111, 92, 0.2)" },
                            ]}
                        >
                            <Text style={styles.iconText}>📊</Text>
                        </View>
                        <Text
                            style={[styles.featureText, { color: colors.text }]}
                        >
                            Detailed consumption reports
                        </Text>
                    </View>
                </View>
                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.primaryButton,
                            { backgroundColor: "#1E6F5C" },
                        ]}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.secondaryButton,
                            { borderColor: "#29BB89" },
                        ]}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                styles.secondaryButtonText,
                                { color: colors.text },
                            ]}
                        >
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>
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
    },
    logoSecond: {
        fontSize: 24,
        fontWeight: "300",
        marginTop: -8,
    },
    heroImage: {
        width: 180,
        height: 180,
        marginBottom: 30,
        borderRadius: 80,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
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
        marginBottom: 20,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    iconText: {
        fontSize: 20,
    },
    featureText: {
        fontSize: 16,
        flex: 1,
    },
    buttonContainer: {
        width: "100%",
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
    },
    primaryButton: {
        backgroundColor: "#D2D229",
    },
    secondaryButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#99DDC8",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
    },
    secondaryButtonText: {
        color: "#99DDC8",
    },
});

export default LandingPage;
