import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageSourcePropType,
    ScrollView,
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

const { width } = Dimensions.get("window");

const LandingPage: React.FC<LandingPageProps> = ({ navigation }) => {
    const { colors, isDarkMode } = useTheme();
    const energyIllustration: ImageSourcePropType = require("../../assets/logo.jpg");
    const { user, userData } = useUser();

    useEffect(() => {
        if (user) {
            navigation.navigate("Dashboard" as never);
        }
    }, [user]);

    return (
        <LinearGradient
            colors={
                isDarkMode ? ["#121C1A", "#0A1211"] : ["#283F3B", "#1A2E2A"]
            }
            style={styles.container}
        >
            {" "}
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
            >
                {/* Logo/App Name */}
                <View style={styles.logoContainer}>
                    <Text style={[styles.logoFirst, { color: colors.accent }]}>
                        Cychael
                    </Text>
                    <Text
                        style={[styles.logoSecond, { color: colors.secondary }]}
                    >
                        of Energy
                    </Text>
                </View>

                {/* Hero Image */}
                <Image
                    source={energyIllustration}
                    style={styles.heroImage}
                    resizeMode="contain"
                />

                {/* App Description */}
                <Text
                    style={[
                        styles.description,
                        { color: isDarkMode ? "#E0F2EF" : "#E0F2EF" },
                    ]}
                >
                    Smart energy analysis for your home. Track consumption,
                    reduce waste, and save money with personalized
                    recommendations.
                </Text>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: `${colors.accent}20` },
                            ]}
                        >
                            <Text style={styles.iconText}>⚡</Text>
                        </View>
                        <Text
                            style={[
                                styles.featureText,
                                { color: isDarkMode ? "#FFFFFF" : "#FFFFFF" },
                            ]}
                        >
                            Real-time energy tracking
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: `${colors.accent}20` },
                            ]}
                        >
                            <Text style={styles.iconText}>💡</Text>
                        </View>
                        <Text
                            style={[
                                styles.featureText,
                                { color: isDarkMode ? "#FFFFFF" : "#FFFFFF" },
                            ]}
                        >
                            Smart savings suggestions
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View
                            style={[
                                styles.featureIcon,
                                { backgroundColor: `${colors.accent}20` },
                            ]}
                        >
                            <Text style={styles.iconText}>📊</Text>
                        </View>
                        <Text
                            style={[
                                styles.featureText,
                                { color: isDarkMode ? "#FFFFFF" : "#FFFFFF" },
                            ]}
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
                            { backgroundColor: colors.accent },
                        ]}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                { color: colors.primary },
                            ]}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.secondaryButton,
                            { borderColor: colors.secondary },
                        ]}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                styles.secondaryButtonText,
                                { color: colors.secondary },
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
        width: 160,
        height: 160,
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
