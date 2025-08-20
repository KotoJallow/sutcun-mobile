import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import colors from '../constants/colors';

const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Dairy');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  
  const sliderImages = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

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

  return (
    <View style={styles.container}>
      <AddressBar 
        address="Kadıköy, Caferağa"
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
        <ProductList selectedCategoryId={selectedCategoryId} />
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