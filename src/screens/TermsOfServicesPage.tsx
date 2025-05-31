import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

const TermsOfServices = () => {
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
                    Terms of Service
                </Text>
            </View>

            <ScrollView style={styles.contentContainer}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        1. Introduction
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        Welcome to Cychael Energy. By using our application, you
                        agree to these Terms of Service.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        2. Account Terms
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You must provide accurate information when registering
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You are responsible for maintaining the security of
                        your account
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You are responsible for all activities that occur
                        under your account
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        3. Using Our Services
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You may use our services only as permitted by these
                        terms and applicable laws
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • You may not misuse our services, including attempting
                        to access them using methods other than the interface we
                        provide
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We may suspend or terminate your access if you violate
                        these terms
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        4. Energy Data
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • The app provides estimates of energy consumption based
                        on information you provide
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • The accuracy of recommendations depends on the
                        accuracy of your input
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Actual energy savings may vary from predictions
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        5. Changes to Terms
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We may modify these terms at any time
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Continued use of our services after changes
                        constitutes acceptance of modified terms
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        6. Disclaimer of Warranties
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Our services are provided "as is" without warranties
                        of any kind
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We do not guarantee that our services will be
                        error-free or uninterrupted
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        7. Limitation of Liability
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • We shall not be liable for any indirect, incidental,
                        or consequential damages
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Our maximum liability is limited to the amount you
                        paid us to use the service, or $100, whichever is less
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        8. Governing Law
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • These terms shall be governed by the laws applicable
                        in your country of residence
                    </Text>
                    <Text style={[styles.paragraph, { color: colors.text }]}>
                        • Any disputes shall be resolved in the courts of your
                        country of residence
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

export default TermsOfServices;
