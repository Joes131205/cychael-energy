import React from "react";
import Button from "../components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";

const DashboardPage = () => {
    const navigation = useNavigation<any>();
    return (
        <View>
            <Text>Hello World!</Text>
            <Button
                title="Login"
                onPress={() => navigation.navigate("Login")}
            />
        </View>
    );
};

export default DashboardPage;
