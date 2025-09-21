import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import colors from '../constants/colors';
import { RootState } from '../redux/store';
import { getDefaultProducts } from '../constants/dummyData';

const HomeScreen = ({ navigation }: any) => {
  const { addresses, address } = useSelector((state: RootState) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>('Dairy');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [currentLocation, setCurrentLocation] = useState<{district: string, neighborhood: string} | null>(null);
  
  const sliderImages = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

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
    setSelectedCategoryId(id);
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
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
        <ProductList 
          selectedCategoryId={selectedCategoryId} 
          district={currentLocation?.district}
          neighborhood={currentLocation?.neighborhood}
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