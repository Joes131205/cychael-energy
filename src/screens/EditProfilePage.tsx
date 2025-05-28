import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { useTheme } from "../hooks/useTheme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/Navigation"; // Adjust the path

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, "Settings">;
type SettingsScreenRouteProp = RouteProp<RootStackParamList, "Settings">;

const EditProfilePage = () => {
    const user = auth.currentUser;
    const { colors } = useTheme();
    const [initialName, setInitialName] = useState(user?.displayName || "");
    const [initialEmail, setInitialEmail] = useState(user?.email || "");
    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");

    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const route = useRoute<SettingsScreenRouteProp>();
    
    const handleDiscard = () => {
        setName(initialName);
        setEmail(initialEmail);
        Alert.alert("Discarded", "Changes have been reverted.");
        navigation.goBack();
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name });
            }
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            Alert.alert("Success", "Profile updated successfully.");
           
            navigation.navigate("Settings", { refresh: true });

        } catch (error: any) {
            console.error(error);
            let message = "Failed to update profile.";
            if (error.code === "auth/requires-recent-login") {
                message = "Please log in again before changing email.";
            } else if (error.code === "auth/invalid-email") {
                message = "Invalid email address.";
            }
            Alert.alert("Error", message);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border,
                    },
                ]}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.card,
                        color: colors.text,
                        borderColor: colors.border,
                    },
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.accent }]}
                onPress={handleSave}
            >
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                    Save Changes
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.discardButton]}
                onPress={handleDiscard}
            >
                <Text style={[styles.buttonText, { color: colors.danger }]}>
                    Discard Changes
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
        marginBottom: 20,
        textAlign: "center",
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
    discardButton: {
        marginTop: 10,
    },
});

export default EditProfilePage;
