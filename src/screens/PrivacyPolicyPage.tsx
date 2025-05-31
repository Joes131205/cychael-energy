import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const PrivacyPolicy = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Privacy Policy
                </Text>
            </View>

            <ScrollView style={styles.contentContainer}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        1. Information We Collect
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • <Text style={styles.bold}>Account Information</Text>:
                        Email address, name
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • <Text style={styles.bold}>Device Information</Text>:
                        Type of devices, wattage, usage hours
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • <Text style={styles.bold}>Energy Usage Data</Text>:
                        Consumption patterns based on your inputs
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • <Text style={styles.bold}>Profile Picture</Text>: If
                        you choose to upload one
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        2. How We Use Information
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • To provide personalized energy analysis and
                        recommendations
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • To improve our energy calculation algorithms
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • To authenticate your identity and maintain your
                        account
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        3. Data Storage
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Your data is stored securely in Firebase
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Personal information is protected using
                        industry-standard security measures
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        4. Data Sharing
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We do not sell your personal information to third
                        parties
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Aggregated, anonymized data may be used for improving
                        our services
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        5. Your Choices
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You can view and edit your device data at any time
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You can update your profile information
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You can delete your account by contacting support
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        6. Security
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We implement reasonable security measures to protect
                        your information
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • No method of transmission over the internet is 100%
                        secure
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        7. Changes to Privacy Policy
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We may update this privacy policy periodically
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We will notify you of significant changes via email or
                        within the app
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        8. Contact Us
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • If you have questions about this privacy policy,
                        please contact us at support@cychaelenergy.com
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.text }]}>
                        Last updated: May 31, 2025
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 16,
    },
    contentContainer: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    bold: {
        fontWeight: "bold",
    },
    footer: {
        marginTop: 16,
        marginBottom: 40,
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
    },
});

export default PrivacyPolicy;
