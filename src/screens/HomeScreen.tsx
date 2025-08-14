import React, { useState } from 'react';
import { View } from 'react-native';
import AddressBar from '../components/AddressBar';
import ImageSlider from '../components/ImageSlider';
import CategoryList from '../components/CategoryList';

const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Dairy');
  
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    console.log('Selected category:', category);
  };

  return (
    <View style={{ flex: 1 }}>
      <AddressBar 
        address="Kadıköy, Caferağa"
        onPress={handleAddressPress}
      />
      <ImageSlider 
        images={sliderImages}
        onPress={handleSliderPress}
      />
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
    </View>
  );
};

export default HomeScreen;