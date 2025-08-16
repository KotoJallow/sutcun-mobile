import React from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomToolbar from '../components/CustomToolbar';
import CartItem from '../components/CartItem';
import Colors from '../constants/colors';
import { RootState } from '../redux/store';
import { increment, decrement, clearCart, removeFromCart } from '../redux/cartSlice';

const CartScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleIncrement = (productId: number) => {
    dispatch(increment(productId));
  };

  const handleDecrement = (productId: number) => {
    dispatch(decrement(productId));
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
          onPress: () => dispatch(clearCart()),
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
      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <CartItem
            key={item.product.product_id}
            product={item.product}
            quantity={item.quantity}
            onIncrement={() => handleIncrement(item.product.product_id)}
            onDecrement={() => handleDecrement(item.product.product_id)}
          />
        ))}
      </ScrollView>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Toplam Tutar:</Text>
        <Text style={styles.totalAmount}>{total.toFixed(2)} TL</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default CartScreen;