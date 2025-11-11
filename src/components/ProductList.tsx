import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Product } from '../constants/dummyData';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Strings from '../constants/strings';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  hasLocation: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, error, onRetry, hasLocation }) => {
  const rows = useMemo(() => {
    const grouped: Product[][] = [];
    if (products) {
      for (let i = 0; i < products.length; i += 2) {
        grouped.push(products.slice(i, i + 2));
      }
    }
    return grouped;
  }, [products]);

  if (!hasLocation) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{Strings.addressRequired}</Text>
        <Text style={styles.emptySubtext}>{Strings.addressBeforeCart}</Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner text={Strings.loadingProducts} />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRetry}
        retryText={Strings.retryButton}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{Strings.noProductsForLocation}</Text>
        <Text style={styles.emptySubtext}>{Strings.tryDifferentAddress}</Text>
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
              key={`${item.product_id ?? item.id ?? item.productId}`}
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