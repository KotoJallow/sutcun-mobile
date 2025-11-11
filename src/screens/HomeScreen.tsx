import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import { useCategories, useProducts } from '../hooks/useApi';
import Strings from '../constants/strings';

const normalizeCategoryId = (value: any): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};

const getProductCategoryId = (product: any): number | null => {
  const sources = [
    product?.category_id,
    product?.categoryId,
    product?.category?.id,
  ];

  for (const source of sources) {
    const normalized = normalizeCategoryId(source);
    if (normalized !== null) {
      return normalized;
    }
  }

  return null;
};

const HomeScreen = ({ navigation }: any) => {
  const { addresses, address } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>(Strings.allCategory);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState<{district: string, neighborhood: string} | null>(null);
  
  // Firebase hooks
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: products, loading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts({
    district: currentLocation?.district,
    neighborhood: currentLocation?.neighborhood,
  });
  
  const sliderImages = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

  // "Tümü" kategorisini kategorilerin başına ekle
  const availableCategoryIds = useMemo(() => {
    const ids = new Set<number>();
    if (products) {
      products.forEach((product: any) => {
        const categoryId = getProductCategoryId(product);
        if (categoryId !== null && !Number.isNaN(categoryId)) {
          ids.add(categoryId);
        }
      });
    }
    return ids;
  }, [products]);

  const filteredCategories = useMemo(() => {
    if (!categories) {
      return [];
    }

    return categories.reduce((acc: any[], category: any) => {
      const resolvedId = normalizeCategoryId(
        category?.category_id ?? category?.id ?? category?.categoryId
      );

      if (resolvedId === null || Number.isNaN(resolvedId)) {
        return acc;
      }

      if (!availableCategoryIds.has(resolvedId)) {
        return acc;
      }

      acc.push({
        ...category,
        id: resolvedId,
        category_id: resolvedId,
        name: category?.name ?? category?.category_name ?? category?.title ?? Strings.allCategory,
        icon: category?.icon ?? category?.category_icon ?? 'grid',
      });

      return acc;
    }, []);
  }, [categories, availableCategoryIds]);

  const displayedCategories = useMemo(() => {
    const uniqueMap = new Map<number, any>();
    filteredCategories.forEach(category => {
      if (!uniqueMap.has(category.id)) {
        uniqueMap.set(category.id, category);
      }
    });

    return [
      { id: 0, category_id: 0, name: Strings.allCategory, icon: 'grid' },
      ...Array.from(uniqueMap.values()),
    ];
  }, [filteredCategories]);

  const displayedProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    if (!selectedCategoryId || selectedCategoryId === 0) {
      return products;
    }

    return products.filter((product: any) => getProductCategoryId(product) === selectedCategoryId);
  }, [products, selectedCategoryId]);

  useEffect(() => {
    // Set current location based on user's default address or default to Beylikdüzü/Kavaklı
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      const addressToUse = defaultAddress || addresses[0];

      if (addressToUse && addressToUse.district && addressToUse.neighborhood) {
        setCurrentLocation({
          district: addressToUse.district,
          neighborhood: addressToUse.neighborhood
        });
        return;
      }
    }

    if (address) {
      const [district, neighborhood] = address.split('/').map(part => part.trim());
      if (district && neighborhood) {
        setCurrentLocation({ district, neighborhood });
        return;
      }
    }

    setCurrentLocation(null);
  }, [addresses, address]);

  const handleAddressPress = () => {
    navigation.navigate('AddressManagement');
  };

  const handleSliderPress = () => {
    console.log('Slider pressed');
  };

  const handleCategorySelect = (category: string, id: number) => {
    setSelectedCategory(category);
    // "Tümü" kategorisi seçildiğinde categoryId'yi undefined yap (tüm ürünleri getir)
    setSelectedCategoryId(id === 0 ? undefined : id);
  };

  const getAddressDisplayText = () => {
    if (currentLocation && currentLocation.district && currentLocation.neighborhood) {
      return `${currentLocation.district}, ${currentLocation.neighborhood}`;
    }
    return Strings.addressRequired;
  };

  return (
    <View style={styles.container}>
      <AddressBar 
        address={getAddressDisplayText()}
        onPress={handleAddressPress}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageSlider 
          images={sliderImages}
          onPress={handleSliderPress}
        />
        <CategoryList
          categories={displayedCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          loading={categoriesLoading}
        />
        <ProductList 
          products={displayedProducts}
          loading={productsLoading}
          error={productsError}
          onRetry={refetchProducts}
          hasLocation={!!currentLocation?.district && !!currentLocation?.neighborhood}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default HomeScreen;