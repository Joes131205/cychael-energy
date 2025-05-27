import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useTheme } from "../hooks/useTheme";

const ChangePasswordPage = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = auth.currentUser;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!user || !user.email) return;

        if (newPassword !== confirmPassword) {
            return Alert.alert("Error", "New passwords do not match.");
        }

        setLoading(true);

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);

            Alert.alert("Success", "Password has been changed.");
            navigation.goBack();
        } catch (error: any) {
            let message = "Failed to update password.";
            if (error.code === "auth/wrong-password") {
                message = "Current password is incorrect.";
            } else if (error.code === "auth/weak-password") {
                message = "New password is too weak.";
            }
            Alert.alert("Error", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Current Password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="New Password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="Confirm New Password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.accent }]}
                onPress={handleChangePassword}
                disabled={loading}
            >
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                    {loading ? "Updating..." : "Update Password"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    // styles.cancelButton,
                    { backgroundColor: "transparent", borderColor: colors.border, borderWidth: 1 },
                ]}
                onPress={() => navigation.goBack()}
            >
                <Text style={[styles.buttonText, { color: colors.danger }]}>
                    Cancel
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ChangePasswordPage;
