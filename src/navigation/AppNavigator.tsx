import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screens/auth/LoginPage";
import RegisterPage from "../screens/auth/RegisterPage";
import DashboardPage from "../screens/DashboardPage";
import LandingPage from "../screens/LandingPage";
import DevicesPage from "../screens/DevicesPage";
import SettingsPage from "../screens/SettingsPage";
import EnergyAnalysisResultPage from "../screens/EnergyAnalysisResultPage";
import EditProfilePage from "../screens/EditProfilePage";
import ChangePasswordPage from "../screens/ChangePasswordPage";
import DeviceHistoryPage from "../screens/DeviceHistoryPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Dashboard">
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
                name="DevicesPage"
                component={DevicesPage}
                options={{ title: "Energy Input", headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfilePage}
                options={{ title: "Edit Profile", headerShown: true }}
            />
            <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordPage}
                options={{ title: "Change Password", headerShown: false }}
            />
            <Stack.Screen
                name="DeviceHistory"
                component={DeviceHistoryPage}
                options={{ title: "Device History", headerShown: false }}
            />
        </Stack.Navigator>
    );
}
