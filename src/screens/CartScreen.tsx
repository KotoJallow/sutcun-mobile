import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import CustomToolbar from '../components/CustomToolbar';
import CartItem from '../components/CartItem';
import Colors from '../constants/colors';

const CartScreen = ({ navigation }: any) => {
  const [items, setItems] = useState([
    {
      id: 1,
      image: 'https://picsum.photos/80/80',
      name: 'Fresh Milk',
      price: 24.90,
      quantity: 2,
      unit: '1L, Bottle',
    },
  ]);

  const handleIncrement = (id: number) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const handleDecrement = (id: number) => {
    setItems(items.map(item => 
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to clear your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear",
          onPress: () => {
            // Implement cart clearing logic here
            console.log("Cart cleared");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CustomToolbar
        title="Cart"
        showBack={true}
        showDelete={true}
        onBackPress={handleBackPress}
        onDeletePress={handleDeletePress}
      />
      <ScrollView>
        {items.map(item => (
          <CartItem
            key={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            unit={item.unit}
            onIncrement={() => handleIncrement(item.id)}
            onDecrement={() => handleDecrement(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
});

export default CartScreen;