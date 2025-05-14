import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

const DashboardPage = () => {
    const navigation = useNavigation<any>();
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);
    return (
        <View>
            <Text>Hello World!</Text>
            <View>
                <Text className="text-gray-700">
                    Hello, {user?.displayName || "User"}
                </Text>
            </View>
            <Button title="Log Out" onPress={async () => await signOut(auth)} />
        </View>
    );
};

export default DashboardPage;
