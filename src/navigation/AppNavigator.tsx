import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../screens/auth/LoginPage";
import RegisterPage from "../screens/auth/RegisterPage";
import DashboardPage from "../screens/DashboardPage";
import LandingPage from "../screens/LandingPage";
import DevicesPage from "../screens/DevicesPage";
import SettingsPage from "../screens/SettingsPage";
import EnergyAnalysisResultPage from "../screens/EnergyAnalysisResultPage";
import EditProfilePage from "../screens/EditProfilePage";
import PrivacyPolicyPage from "../screens/PrivacyPolicyPage";
import TermsOfServicesPage from "../screens/TermsOfServicesPage";
import ForgotPasswordPage from "../screens/ForgotPasswordPage";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Dashboard">
            <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterPage}
                options={{ title: "Register", headerShown: false }}
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
                options={{ title: "Energy Data", headerShown: false }}
            />
            <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{ title: "Cychael Energy", headerShown: false }}
            />
            <Stack.Screen
                name="DevicesPage"
                component={DevicesPage}
                options={{ title: "Your Devices", headerShown: false }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfilePage}
                options={{ title: "Edit Profile", headerShown: true }}
            />
            <Stack.Screen
                name="PrivacyPolicyPage"
                component={PrivacyPolicyPage}
                options={{ title: "Privacy Policy", headerShown: false }}
            />
            <Stack.Screen
                name="TermsOfServicesPage"
                component={TermsOfServicesPage}
                options={{ title: "Terms of Services", headerShown: false }}
            />
            <Stack.Screen
                name="ForgotPasswordPage"
                component={ForgotPasswordPage}
                options={{ title: "Forgot Password", headerShown: true }}
            />
        </Stack.Navigator>
    );
}
