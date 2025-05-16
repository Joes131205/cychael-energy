import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ImageSourcePropType , ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type LandingPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LandingPageProps {
    navigation: LandingPageNavigationProp;
}

const { width } = Dimensions.get('window');

const LandingPage: React.FC<LandingPageProps> = ({ navigation }) => {
    const energyIllustration: ImageSourcePropType = require('../../assets/logo.jpg');

    return (
        <LinearGradient
            colors={['#283F3B', '#1A2E2A']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Logo/App Name */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Cychael</Text>
                    <Text style={styles.logoSubtext}>of Energy</Text>
                </View>

                {/* Hero Image */}
                <Image
                    source={energyIllustration}
                    style={styles.heroImage}
                    resizeMode="contain"
                />

                {/* App Description */}
                <Text style={styles.description}>
                    Smart energy analysis for your home. Track consumption, reduce waste, and save money with personalized recommendations.
                </Text>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.iconText}>⚡</Text>
                        </View>
                        <Text style={styles.featureText}>Real-time energy tracking</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.iconText}>💡</Text>
                        </View>
                        <Text style={styles.featureText}>Smart savings suggestions</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.iconText}>📊</Text>
                        </View>
                        <Text style={styles.featureText}>Detailed consumption reports</Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 30,
        paddingTop: 60,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 42,
        fontWeight: '800',
        color: '#D2D229',
        fontStyle: 'italic',
    },

    logoSubtext: {
        fontSize: 24,
        fontWeight: '300',
        color: '#99DDC8',
        marginTop: -8,
    },

    heroImage: {
        width: 160,
        height: 160,
        marginBottom: 30,
        borderRadius: 80,
    },
    description: {
        color: '#E0F2EF',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 40,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIcon: {
        backgroundColor: 'rgba(210, 210, 41, 0.2)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconText: {
        fontSize: 20,
    },
    featureText: {
        color: '#FFFFFF',
        fontSize: 16,
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    primaryButton: {
        backgroundColor: '#D2D229',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#99DDC8',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#283F3B',
    },
    secondaryButtonText: {
        color: '#99DDC8',
    },
});

export default LandingPage;
