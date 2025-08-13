// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './tabs';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import AddressManagementScreen from '../screens/AddressManagementScreen';
import colors from '../constants/colors';



const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Add auth screens here in future */}
     { <Stack.Screen name="login" component={LoginScreen} />}
      <Stack.Screen name="Register" component={RegisterScreen} /> 
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen 
        name="AddressManagement" 
        component={AddressManagementScreen}
        options={{ 
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}
