import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
    return (
        <TouchableOpacity 
        style={[styles.button, variant === 'primary' ? styles.primary : styles.secondary]}
        onPress={onPress}
        >
        <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 8,
    },
    primary: {
        backgroundColor: '#4CAF50',
    },
    secondary: {
        backgroundColor: '#2196F3',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
});