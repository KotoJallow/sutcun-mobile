import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Product } from '../constants/dummyData';
import { RootState } from '../redux/store';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const NUM_OF_CARDS = 2;
const PADDING = width * 0.04;
const CARD_WIDTH = (width - (PADDING * (NUM_OF_CARDS + 1))) / NUM_OF_CARDS;

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { addresses } = useSelector((state: RootState) => state.user);

  const handleAddToCart = () => {
    // Check if user has any saved addresses
    if (addresses.length === 0) {
      Alert.alert(
        'Address Required',
        'You need to add an address before adding products to cart. Would you like to add an address now?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Add Address', 
            onPress: () => navigation.navigate('AddAddress')
          }
        ]
      );
      return;
    }

    // Add product to cart
    dispatch(addToCart(product));
    
    // Show success message
    Alert.alert('Success', `${product.product_name} added to cart!`);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.product_name}</Text>
      <Text style={styles.unit}>{product.unit}</Text>
      <Text style={styles.price}>{product.price.toFixed(2)} TL</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: PADDING,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: CARD_WIDTH,
  },
  
  image: {
    width: CARD_WIDTH * 0.6, // Kart genişliğinin %60'ı
    height: CARD_WIDTH * 0.6,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: PADDING,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
  },
  unit: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#3EC6C1',
    borderRadius: 20,
    width: CARD_WIDTH * 0.2, // Kart genişliğinin %20'si
    height: CARD_WIDTH * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: PADDING,
    bottom: PADDING,
  },
  plus: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default ProductCard;