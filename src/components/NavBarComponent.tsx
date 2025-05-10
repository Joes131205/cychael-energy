import { useNavigation } from "@react-navigation/native";
import Button from "./common/Button";
<<<<<<< Updated upstream
=======
import { View, Text, TouchableOpacity } from "react-native";
>>>>>>> Stashed changes

const NavBarComponent = () => {
    const navigation = useNavigation();

    return (
<<<<<<< Updated upstream
        <div>
            <nav>
                <div>
                    <h1>Cychael Energy</h1>
                </div>
                <div>
                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login" as never)}
                    />
                    <Button
                        title="Register"
                        onPress={() => navigation.navigate("Register" as never)}
                    />
                </div>
            </nav>
        </div>
=======
        <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
            <View>
                <Text className="text-xl font-bold text-gray-800">
                    Cychael Energy
                </Text>
            </View>
            <View className="flex-row space-x-2">
                <TouchableOpacity
                    className="px-3 py-2 bg-blue-500 rounded-md"
                    onPress={() => navigation.navigate("Login" as never)}
                >
                    <Text className="text-sm text-white font-medium">
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="px-3 py-2 bg-blue-500 rounded-md ml-2"
                    onPress={() => navigation.navigate("Register" as never)}
                >
                    <Text className="text-sm text-white font-medium">
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
>>>>>>> Stashed changes
    );
};

export default NavBarComponent;
