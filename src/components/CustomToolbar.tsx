import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/colors';

interface CustomToolbarProps {
  title: string;
  showCart?: boolean;
  showBack?: boolean;
  onCartPress?: () => void;
  onBackPress?: () => void;
}

const CustomToolbar = ({ 
  title, 
  showCart = false, 
  showBack = false,
  onCartPress,
  onBackPress 
}: CustomToolbarProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.toolbar}>
      {showBack && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackPress}
        >
          <MaterialIcons 
            name="arrow-back" 
            size={24} 
            color={Colors.white} 
          />
        </TouchableOpacity>
      )}
      <Text style={[
        styles.title,
        showBack && styles.titleWithBack
      ]}>{title}</Text>
      {showCart && (
        <TouchableOpacity style={styles.cartContainer} onPress={onCartPress}>
          <MaterialIcons name="shopping-cart" size={24} color={Colors.white} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primary,
  },
  toolbar: {
    height: 56,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 0,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  titleWithBack: {
    marginLeft: 32, // Give some space for back button
  },
  cartContainer: {
    position: 'relative',
    marginLeft: 'auto',
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomToolbar;