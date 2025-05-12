import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavBarComponent = () => {
    const navigation = useNavigation();

    return (
        <>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View className="px-5 py-4 bg-white border-b border-gray-200 shadow-sm">
                <View className="flex flex-row justify-between items-center w-full">
                    <View className="flex-row items-center">
                        <Ionicons name="flash" size={24} color="#2563EB" />
                        <Text className="text-xl font-bold text-blue-600 ml-2">
                            Cychael Energy
                        </Text>
                    </View>

                    <View className="flex flex-row space-x-3">
                        <TouchableOpacity
                            className="px-4 py-2 border border-blue-600 rounded-full"
                            onPress={() =>
                                navigation.navigate("Login" as never)
                            }
                        >
                            <Text className="text-blue-600 font-medium">
                                Login
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="px-4 py-2 bg-blue-600 rounded-full"
                            onPress={() =>
                                navigation.navigate("Register" as never)
                            }
                        >
                            <Text className="text-white font-medium">
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

export default NavBarComponent;
