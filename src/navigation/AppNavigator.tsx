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
import {
    View,
    ActivityIndicator,
    Text,
    BackHandler,
    Alert,
} from "react-native";
import { useEffect } from "react";
import { CommonActions, useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const navigation = useNavigation();

    const { user, loading } = useUser();

    useEffect(() => {
        const backAction = () => {
            const currentRoute =
                navigation?.getState()?.routes?.[
                    navigation?.getState()?.index ?? 0
                ];

            if (!user) {
                if (currentRoute?.name === "LandingPage") {
                    Alert.alert(
                        "Confirm Exit",
                        "Are you sure you want to close Cychael Energy?",
                        [
                            {
                                text: "Exit",
                                onPress: () => {
                                    BackHandler.exitApp();
                                    return true;
                                },
                            },

                            {
                                text: "Cancel",
                                onPress: () => {
                                    return false;
                                },
                                style: "cancel",
                            },
                        ]
                    );
                    return true;
                } else {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "LandingPage" }],
                        })
                    );
                    return true;
                }
            }

            if (currentRoute?.name === "Dashboard") {
                Alert.alert(
                    "Confirm Exit",
                    "Are you sure you want to close Cychael Energy?",
                    [
                        {
                            text: "Exit",
                            onPress: () => {
                                BackHandler.exitApp();
                                return true;
                            },
                        },

                        {
                            text: "Cancel",
                            onPress: () => {
                                return false;
                            },
                            style: "cancel",
                        },
                    ]
                );
                return true;
            } else {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "Dashboard" }],
                    })
                );
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation, user]);

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
