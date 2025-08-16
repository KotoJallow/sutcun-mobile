import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/colors';

interface CartItemProps {
  image: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  image,
  name,
  price,
  quantity,
  unit,
  onIncrement,
  onDecrement,
}) => {
  const totalPrice = price * quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>₺{price.toFixed(2)}</Text>
        </View>
        <Text style={styles.unit}>{unit}</Text>
        <View style={styles.bottomContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={onDecrement}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity 
              onPress={onIncrement}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.totalPrice}>₺{totalPrice.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  unit: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightestGray,
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
});

export default CartItem;