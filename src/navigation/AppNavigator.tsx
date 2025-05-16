import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screens/auth/LoginPage";
import RegisterPage from "../screens/auth/RegisterPage";
import DashboardPage from "../screens/DashboardPage";
import LandingPage from "../screens/LandingPage";
import EnergyInputPage from "../screens/EnergyInputPage";
import SettingsPage from "../screens/SettingsPage";
import EnergyAnalysisResultPage from "../screens/EnergyAnalysisResultPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="LandingPage">
            <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterPage}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dashboard"
                component={DashboardPage}
                options={{ title: "Dashboard", headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsPage}
                options={{ title: "Settings", headerShown: false }}
            />
            <Stack.Screen
                name="EnergyAnalysisResultPage"
                component={EnergyAnalysisResultPage}
                options={{
                    title: "EnergyAnalysisResultPage",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{ title: "Cychael Energy", headerShown: false }}
            />
            <Stack.Screen
                name="EnergyInputPage"
                component={EnergyInputPage}
                options={{ title: "Energy Input", headerShown: false }}
            />
        </Stack.Navigator>
    );
}
