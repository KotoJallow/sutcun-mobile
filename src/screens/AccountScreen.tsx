import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import MenuList from '../components/MenuList';
import CustomToolbar from '../components/CustomToolbar';
import colors from '../constants/colors';
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
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
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
              Alert.alert('Error', 'Failed to logout. Please try again.');
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
    return name || 'User';
  };

  const getUserInitials = () => {
    if (name && surname) {
      return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

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
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileCard
          name={getUserDisplayName()}
          phone={phone || 'Not provided'}
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
