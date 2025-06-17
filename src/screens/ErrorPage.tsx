import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

interface ErrorPageProps {
    route?: {
        params?: {
            errorMessage?: string;
        };
    };
}

const ErrorPage: React.FC<ErrorPageProps> = ({ route }) => {
    const navigation = useNavigation();
    const errorMessage = route?.params?.errorMessage || "Something went wrong";

    const handleGoHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Dashboard" }],
            })
        );
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.message}>{errorMessage}</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleGoHome}
                >
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>
                        Go to Dashboard
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        padding: 20,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: "#666666",
        textAlign: "center",
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 300,
        marginTop: 20,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: "#F5F5F5",
        minWidth: 120,
        alignItems: "center",
    },
    primaryButton: {
        backgroundColor: "#29BB89",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333333",
    },
    primaryButtonText: {
        color: "white",
    },
});

export default ErrorPage;
