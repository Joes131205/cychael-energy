import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import Button from "../components/common/Button";
import { auth } from "../utils/firebase";
import { signOut } from "@firebase/auth";
import { useNavigation } from "@react-navigation/native";

const SettingsPage = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>This is your profile lol</Text>
            <Button
                title="Log Out"
                onPress={async () => {
                    await signOut(auth);
                    navigation.navigate("LandingPage" as never);
                }}
            />
        </View>
    );
};

export default SettingsPage;
