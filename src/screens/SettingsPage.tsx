import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import Button from "../components/common/Button";
import { auth } from "../utils/firebase";
import { signOut } from "@firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

const SettingsPage = () => {
    const navigation = useNavigation();
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await signOut(auth);
        navigation.navigate("LandingPage" as never);
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Settings
                </Text>
                <Text
                    style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                    Customize your preferences
                </Text>
            </View>

            <View
                style={[styles.section, { borderBottomColor: colors.border }]}
            >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Account
                </Text>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Profile Information
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Security
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <View
                style={[styles.section, { borderBottomColor: colors.border }]}
            >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Appearance
                </Text>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                    onPress={toggleTheme}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name={isDarkMode ? "sunny-outline" : "moon-outline"}
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </Text>
                    <View
                        style={[
                            styles.themeToggle,
                            {
                                backgroundColor: isDarkMode
                                    ? colors.iconSecondary
                                    : colors.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.toggleCircle,
                                {
                                    backgroundColor: colors.card,
                                    transform: [
                                        { translateX: isDarkMode ? 16 : 0 },
                                    ],
                                },
                            ]}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    About
                </Text>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="information-circle-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        About Cychael Energy
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="document-text-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Privacy Policy
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="help-circle-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Help & Support
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            <Button title="Log Out" variant="danger" onPress={handleLogout} />

            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginVertical: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    section: {
        marginBottom: 30,
        paddingBottom: 15,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(153,221,200,0.15)",
        marginRight: 15,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
    },
    themeToggle: {
        width: 44,
        height: 24,
        borderRadius: 12,
        padding: 2,
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
});

export default SettingsPage;
