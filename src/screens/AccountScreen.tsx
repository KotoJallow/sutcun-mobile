import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import MenuList from '../components/MenuList';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';

export default function AccountScreen({ navigation }: any) {
  const menuItems = [
    {
      title: 'My Orders',
      icon: 'package-variant',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      title: 'My Addresses',
      icon: 'map-marker-outline',
      onPress: () => navigation.navigate('AddressManagement'),
    },
    {
      title: 'Payment Methods',
      icon: 'credit-card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      title: 'Contact Support',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
    {
      title: 'App Settings',
      icon: 'cog-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: 'Quit App',
      icon: 'exit-to-app',
      onPress: () => navigation.navigate('Orders'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileCard
          name="Ahmet Süt"
          phone="+90 555 123 4567"
          initials="AS"
        />
        <MenuList items={menuItems} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
