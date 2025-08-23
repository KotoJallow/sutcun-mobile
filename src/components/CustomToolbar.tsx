import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface CustomToolbarProps {
  title: string;
  showCart?: boolean;
  showBack?: boolean;
  showDelete?: boolean;
  onCartPress?: () => void;
  onBackPress?: () => void;
  onDeletePress?: () => void;
}

const CustomToolbar = ({ 
  title, 
  showCart = false, 
  showBack = false,
  showDelete = false,
  onCartPress,
  onBackPress,
  onDeletePress
}: CustomToolbarProps) => {

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.toolbar}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBackPress}
          >
            <Icon name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightIcons}>
          {showDelete && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={onDeletePress}
            >
              <Icon name="delete" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
          {showCart && (
            <TouchableOpacity style={styles.cartContainer} onPress={onCartPress}>
              <Icon name="shopping-cart" size={24} color={Colors.white} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
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
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  rightIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  backButton: {
    zIndex: 1,
  },
  titleWithBack: {
    marginLeft: 32, // Give some space for back button
  },
  cartContainer: {
    position: 'relative',
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
  deleteButton: {
    marginRight: 0,
  }
});

export default CustomToolbar;