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
import { useUser } from "../hooks/useUser";
import { View, ActivityIndicator, Text } from "react-native";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#29BB89" />
                <Text style={{ marginTop: 20, color: "#333" }}>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack.Navigator initialRouteName={user ? "Dashboard" : "LandingPage"}>
            <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{
                    title: "Login",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterPage}
                options={{
                    title: "Register",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="Dashboard"
                component={DashboardPage}
                options={{
                    title: "Dashboard",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsPage}
                options={{
                    title: "Settings",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="EnergyAnalysisResultPage"
                component={EnergyAnalysisResultPage}
                options={{
                    title: "Energy Data",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="LandingPage"
                component={LandingPage}
                options={{
                    title: "Cychael Energy",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="DevicesPage"
                component={DevicesPage}
                options={{
                    title: "Your Devices",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfilePage}
                options={{
                    title: "Edit Profile",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="PrivacyPolicyPage"
                component={PrivacyPolicyPage}
                options={{
                    title: "Privacy Policy",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="TermsOfServicesPage"
                component={TermsOfServicesPage}
                options={{
                    title: "Terms of Services",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
            <Stack.Screen
                name="ForgotPasswordPage"
                component={ForgotPasswordPage}
                options={{
                    title: "Forgot Password",
                    headerShown: false,
                    navigationBarHidden: true,
                }}
            />
        </Stack.Navigator>
    );
}
