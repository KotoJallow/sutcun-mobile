import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/colors';

interface CustomToolbarProps {
  title: string;
  showCart?: boolean;
  onCartPress?: () => void;
}

const CustomToolbar = ({ title, showCart = false, onCartPress }: CustomToolbarProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        <Text style={styles.title}>{title}</Text>
        {showCart && (
          <TouchableOpacity style={styles.cartContainer} onPress={onCartPress}>
            <Icon name="shopping-cart" size={24} color="#fff" />
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