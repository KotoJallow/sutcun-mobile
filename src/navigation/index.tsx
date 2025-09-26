// src/navigation/index.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './tabs';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import AddressManagementScreen from '../screens/AddressManagementScreen';
import CartScreen from '../screens/CartScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import colors from '../constants/colors';
import AppSettingsScreen from '../screens/AppSettingsScreen';



const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth screens */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} /> 
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen 
        name="AddressManagement" 
        component={AddressManagementScreen}
        options={{ 
          headerShown: false
        }}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen 
        name="AddAddress" 
        component={AddAddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Support" component={ContactSupportScreen} />
      <Stack.Screen name="Settings" component={AppSettingsScreen} />
    </Stack.Navigator>
  );
}
