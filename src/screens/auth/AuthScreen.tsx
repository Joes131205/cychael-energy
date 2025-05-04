import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
    // const navigation = useNavigation();
    const navigation = useNavigation<any>();


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to Cychael of Energy</Text>
        <Button 
            title="Login" 
            onPress={() => navigation.navigate('Dashboard')}
        />
        </View>
    );
}