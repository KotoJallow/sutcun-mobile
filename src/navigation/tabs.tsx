// src/navigation/tabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import CustomToolbar from '../components/CustomToolbar';
import Strings from '../constants/strings';
import Colors from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: (props) => {
          const screenName = props.route.name;
          let showCart = false;
          let title = screenName;

          if (screenName === 'Home') {
            showCart = true;
            title = Strings.homeTitle;
          }
          
          if (screenName === 'Orders') title = Strings.ordersTitle;
          if (screenName === 'Account') title = Strings.accountTitle;

          return (
            <CustomToolbar
              title={title}
              showCart={showCart}
              onCartPress={() => {
                console.log('Sepete tıklandı');
              }}
            />
          );
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.lightGray,
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        }
      }}
    >
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{
          tabBarLabel: Strings.ordersTitle,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-list" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: '', // Remove label
          tabBarIcon: ({ color, size }) => (
            <View style={styles.homeIconContainer}>
              <MaterialCommunityIcons 
                name="home" 
                color={Colors.white} 
                size={26} 
              />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          tabBarLabel: Strings.accountTitle,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
