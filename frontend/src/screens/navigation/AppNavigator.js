import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '@/app/signin';
import SignUpScreen from '../../../app/SignUpScreen';
import HomeScreen from '../../../app/HomeScreen';
import JournalScreen from '../../../app/JournalScreen';
import PerformanceScreen from '../../../app/PerformanceScreen';
import ReferencesScreen from '../../../app/ReferencesScreen';
import RemindersScreen from '../../../app/RemindersScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            setIsAuthenticated(!!userToken);
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return null; // Prevent flashing by waiting for the check to complete
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isAuthenticated ? 'HomeScreen' : 'WelcomeScreen'}>
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Stack.Screen name="SignInScreen" component={SignInScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                <Stack.Screen name="JournalScreen" component={JournalScreen} />
                <Stack.Screen name="JournalEntryScreen" component={JournalEntryScreen} />
                <Stack.Screen name="ReferenceScreen" component={ReferencesScreen} />
                <Stack.Screen name="PerformanceScreen" component={PerformanceScreen} />
                <Stack.Screen name="RemindersScreen" component={RemindersScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
