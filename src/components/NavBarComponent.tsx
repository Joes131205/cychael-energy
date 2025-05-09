import { useNavigation } from "@react-navigation/native";
import Button from "./common/Button";

const NavBarComponent = () => {
    const navigation = useNavigation();

    return (
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
    );
};

export default NavBarComponent;
