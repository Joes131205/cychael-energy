import { useNavigation } from "@react-navigation/native";
import Button from "./common/Button";
import { View } from "react-native";

const NavBarComponent = () => {
    const navigation = useNavigation();

    return (
        <View>
            <nav className="flex justify-around gap-10 w-full">
                <div>
                    <h1>Cychael Energy</h1>
                </div>
                <div className="flex flex-row">
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
        </View>
    );
};

export default NavBarComponent;
