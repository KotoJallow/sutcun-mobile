import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import MenuList from '../components/MenuList';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';
import Strings from '../constants/strings';
import { RootState } from '../redux/store';
import { logout } from '../redux/userSlice';
import { clearCart } from '../redux/cartSlice';
import { clearCurrentOrder } from '../redux/orderSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function AccountScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { name, surname, phone, isVerified } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    Alert.alert(
      Strings.logoutTitle,
      Strings.logoutMessage,
      [
        { text: Strings.cancel, style: 'cancel' },
        {
          text: Strings.logoutTitle,
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Firebase
              await signOut(auth);
              
              // Clear Redux state
              dispatch(logout());
              dispatch(clearCart());
              dispatch(clearCurrentOrder());
              
              // Navigate to welcome screen
              navigation.replace('Welcome');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Hata', Strings.logoutError);
            }
          }
        }
      ]
    );
  };

  const getUserDisplayName = () => {
    if (name && surname) {
      return `${name} ${surname}`;
    }
    return name || Strings.defaultUserName;
  };

  const getUserInitials = () => {
    if (name && surname) {
      return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return Strings.defaultUserName.charAt(0).toUpperCase();
  };

  const menuItems = [
    {
      title: Strings.myOrders,
      icon: 'package-variant',
      onPress: () => navigation.navigate('Orders'),
    },
    {
      title: Strings.myAddresses,
      icon: 'map-marker-outline',
      onPress: () => navigation.navigate('AddressManagement'),
    },
    {
      title: Strings.paymentMethods,
      icon: 'credit-card-outline',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      title: Strings.contactSupport,
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Support'),
    },
    {
      title: Strings.appSettings,
      icon: 'cog-outline',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      title: Strings.logoutTitle,
      icon: 'exit-to-app',
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileCard
          name={getUserDisplayName()}
          phone={phone || Strings.notProvided}
          initials={getUserInitials()}
          isVerified={isVerified}
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
