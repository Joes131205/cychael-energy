import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { updateProfile, updateEmail } from "firebase/auth";

const EditProfilePage = () => {
    const user = auth.currentUser;
    const [initialName, setInitialName] = useState(user?.displayName || "");
    const [initialEmail, setInitialEmail] = useState(user?.email || "");
    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const navigation = useNavigation();

    const handleDiscard = () => {
        setName(initialName);
        setEmail(initialEmail);
        Alert.alert("Discarded", "Changes have been reverted.");
        navigation.goBack();
    };


    const handleSave = async () => {
        if (!user) return;
            try {
            // Update display name
            if (name !== user.displayName) {
                await updateProfile(user, { displayName: name });
            }

            // Update email
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            Alert.alert("Success", "Profile updated successfully.");
            navigation.goBack();
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
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.discardButton]}
                onPress={handleDiscard}
            >
                <Text style={[styles.buttonText, { color: "#D32F2F" }]}>Discard Changes</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F9F8",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
        color: "#283F3B",
    },
    input: {
        borderWidth: 1,
        borderColor: "#D0E0DD",
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#D2D229",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#283F3B",
        fontSize: 16,
        fontWeight: "600",
    },
    discardButton: {
        backgroundColor: "#FFECEC",
        marginTop: 10,
    },

});

export default EditProfilePage;
