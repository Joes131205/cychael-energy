import React, { useCallback, useState, useEffect } from "react";
import {
    View,
    BackHandler,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import Button from "../components/common/Button";
import { auth } from "../utils/firebase";
import { signOut } from "@firebase/auth";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

const SettingsPage = () => {
    const navigation = useNavigation();
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const [user, setUser] = useState(auth.currentUser);
    console.log(user);
    const photo =
        user?.photoURL != null ? (
            <View style={styles.container}>
                <Image
                    source={{
                        uri: user?.photoURL || "",
                    }}
                />
            </View>
        ) : (
            <Text style={styles.avatarText}>
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </Text>
        );
    const handleLogout = async () => {
        await signOut(auth);
        navigation.navigate("LandingPage" as never);
    };
    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                await auth.currentUser?.reload();
                setUser(auth.currentUser);
            };
            refresh();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const refresh = async () => {
                await auth.currentUser?.reload();
                const refreshedUser = auth.currentUser;
                setUser(refreshedUser);
            };
            refresh();
        }, [])
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            {/* Profile Header */}
            <View style={[styles.header, { marginBottom: 30 }]}>
                <View style={styles.avatarContainer}>
                    <View
                        style={[
                            styles.avatarPlaceholder,
                            { backgroundColor: colors.accent },
                        ]}
                    >
                        {photo}
                    </View>
                </View>
                <Text style={[styles.userName, { color: colors.text }]}>
                    {user?.displayName || "User"}
                </Text>
                <Text
                    style={[styles.userEmail, { color: colors.textSecondary }]}
                >
                    {user?.email || "user@example.com"}
                </Text>
            </View>

            {/* Account Section */}
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
                    onPress={() => navigation.navigate("EditProfile" as never)}
                >
                    <View style={styles.settingIcon}>
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color={colors.iconSecondary}
                        />
                    </View>
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Edit Profile
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Preferences Section */}
            <View
                style={[styles.section, { borderBottomColor: colors.border }]}
            >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Preferencess
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

            {/* About Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    About
                </Text>

                <TouchableOpacity
                    style={[
                        styles.settingItem,
                        { backgroundColor: colors.card },
                    ]}
                    onPress={() =>
                        navigation.navigate("TermsOfServicesPage" as never)
                    }
                >
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Terms of Service
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
                    onPress={() =>
                        navigation.navigate("PrivacyPolicyPage" as never)
                    }
                >
                    <Text style={[styles.settingText, { color: colors.text }]}>
                        Privacy Policy
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* App Version */}
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
                Cychael of Energy v1.0.0
            </Text>

            {/* Logout Button */}
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

    avatarContainer: {
        marginBottom: 16,
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#fff",
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 4,
        textAlign: "center",
    },
    userEmail: {
        fontSize: 16,
        textAlign: "center",
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
    versionText: {
        textAlign: "center",
        fontSize: 14,
        // marginTop: 10,
        marginBottom: 30,
    },
});

export default SettingsPage;
