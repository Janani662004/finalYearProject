import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Button,
    Alert,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    JournalScreen: undefined;
    RemindersScreen: undefined;
    PerformanceScreen: undefined;
    ReferencesScreen: undefined;
};

type MenuItem = {
    label: string;
    screen: keyof RootStackParamList;
    icon: keyof typeof Ionicons.glyphMap;
};

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const foxAnim = useRef(new Animated.Value(1)).current;
    const [sleepTime, setSleepTime] = useState<Date | null>(null);
    const [wakeTime, setWakeTime] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [isSleepPicker, setIsSleepPicker] = useState(true);

    const handleFoxTap = () => {
        Animated.sequence([
            Animated.timing(foxAnim, {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(foxAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleTimeChange = (
        event: any,
        selectedTime?: Date
    ) => {
        setShowPicker(false);
        if (selectedTime) {
            if (isSleepPicker) {
                setSleepTime(selectedTime);
            } else {
                setWakeTime(selectedTime);
            }
        }
    };

    const calculateSleepDuration = async () => {
        if (!sleepTime || !wakeTime) {
            Alert.alert("Please select both sleep and wake-up times.");
            return;
        }

        let duration = (wakeTime.getTime() - sleepTime.getTime()) / (1000 * 60 * 60);
        if (duration < 0) duration += 24;

        await AsyncStorage.setItem("sleepDuration", JSON.stringify(duration));
        Alert.alert(`You slept for ${duration.toFixed(1)} hours.`);
    };

    const menuItems: MenuItem[] = [
        { icon: 'book-outline', label: 'Journal', screen: 'JournalScreen' },
        { icon: 'notifications-outline', label: 'Reminders', screen: 'RemindersScreen' },
        { icon: 'analytics-outline', label: 'Performance', screen: 'PerformanceScreen' },
        { icon: 'people-outline', label: 'References', screen: 'ReferencesScreen' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to FoxTale</Text>

            <Animated.Image
                source={require('../assets/images/fox.jpg')}
                style={[styles.fox, { transform: [{ scale: foxAnim }] }]}
            />

            <TouchableOpacity onPress={handleFoxTap} style={styles.foxTouchArea}>
                <Text style={styles.foxText}>Tap me!</Text>
            </TouchableOpacity>

            <View style={styles.sleepContainer}>
                <Text style={styles.sleepTitle}>Track Your Sleep</Text>
                <Button
                    title="Set Sleep Time"
                    onPress={() => {
                        setIsSleepPicker(true);
                        setShowPicker(true);
                    }}
                />
                <Button
                    title="Set Wake-up Time"
                    onPress={() => {
                        setIsSleepPicker(false);
                        setShowPicker(true);
                    }}
                />
                {showPicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
                <Button title="Save Sleep Data" onPress={calculateSleepDuration} />
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => navigation.navigate(item.screen)}
                        style={styles.menuItem}
                    >
                        <Ionicons name={item.icon} size={28} color="#3498db" />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fox: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    foxTouchArea: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        elevation: 3,
    },
    foxText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sleepContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    sleepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 20,
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 5,
    },
    menuItem: {
        alignItems: 'center',
        padding: 10,
    },
    menuLabel: {
        fontSize: 14,
        marginTop: 5,
    },
});
