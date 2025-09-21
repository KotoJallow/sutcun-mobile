import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Product } from '../constants/dummyData';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useProducts } from '../hooks/useApi';

interface ProductListProps {
  selectedCategoryId?: number;
  district?: string;
  neighborhood?: string;
}

const ProductList: React.FC<ProductListProps> = ({ selectedCategoryId, district, neighborhood }) => {
  const { data: products, loading, error, refetch } = useProducts({
    district,
    neighborhood,
    categoryId: selectedCategoryId,
  });

  // Group products into rows of 2
  const rows = [];
  if (products) {
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={refetch}
        retryText="Retry"
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products available for this location</Text>
        <Text style={styles.emptySubtext}>Try selecting a different address</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rows.map((row, idx) => (
        <View key={idx} style={styles.row}>
          {row.map((item) => (
            <ProductCard
              product={item}
              key={item.product_id}
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ProductList;