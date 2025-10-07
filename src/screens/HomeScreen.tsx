import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import { useCategories, useProducts } from '../hooks/useApi';

const HomeScreen = ({ navigation }: any) => {
  const { addresses, address } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [currentLocation, setCurrentLocation] = useState<{district: string, neighborhood: string} | null>(null);
  
  // Firebase hooks
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: products, loading: productsLoading } = useProducts({
    district: currentLocation?.district,
    neighborhood: currentLocation?.neighborhood,
    categoryId: selectedCategoryId
  });
  
  const sliderImages = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

  // "Tümü" kategorisini kategorilerin başına ekle
  const allCategories = categories ? [
    { id: 0, name: 'Tümü', icon: 'grid' }, 
    ...categories
  ] : [{ id: 0, name: 'Tümü', icon: 'grid' }];

  useEffect(() => {
    // Set current location based on user's default address or default to Beylikdüzü/Kavaklı
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setCurrentLocation({
          district: defaultAddress.district,
          neighborhood: defaultAddress.neighborhood
        });
      }
    } else {
      // Default location for new users
      setCurrentLocation({
        district: 'Beylikdüzü',
        neighborhood: 'Kavaklı'
      });
    }
  }, [addresses]);

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
    if (currentLocation) {
      return `${currentLocation.district}, ${currentLocation.neighborhood}`;
    }
    return 'Beylikdüzü, Kavaklı'; // Default fallback
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
          categories={allCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          loading={categoriesLoading}
        />
        <ProductList 
          products={products || []}
          selectedCategoryId={selectedCategoryId} 
          district={currentLocation?.district}
          neighborhood={currentLocation?.neighborhood}
          loading={productsLoading}
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