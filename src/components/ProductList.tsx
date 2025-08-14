import React from 'react';
import { View, StyleSheet } from 'react-native';
import { products } from '../constants/dummyData';
import ProductCard from './ProductCard';

interface ProductListProps {
  selectedCategoryId?: number;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId }) => {
  // Seçili kategoriye göre ürünleri filtrele
  const filteredProducts = selectedCategoryId
    ? products.filter(product => product.category_id === selectedCategoryId)
    : products;

  // Filtrelenmiş ürünleri ikili gruplara ayır
  const rows = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    rows.push(filteredProducts.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((item) => (
            <ProductCard
              key={item.product_id}
              name={item.product_name}
              image={item.image}
              price={item.price}
              unit={item.unit}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
});

export default ProductList;